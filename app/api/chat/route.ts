import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MODELS } from '@/lib/anthropic'
import { buildSystemPrompt } from '@/lib/system-prompt'
import type { ChatMessage, CaseFile, EvidenceItem } from '@/lib/types'
import { FREE_MESSAGE_LIMIT } from '@/lib/types'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message, conversation_id } = body as { message: string; conversation_id?: string }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (message.length > 4000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    const isPaid = userProfile?.subscription_status === 'active'
    const messageCount = userProfile?.message_count || 0

    // Check free tier limit
    if (!isPaid && messageCount >= FREE_MESSAGE_LIMIT) {
      return NextResponse.json({
        error: 'Free message limit reached. Please upgrade to continue.',
        requires_subscription: true,
        message_count: messageCount,
      }, { status: 402 })
    }

    // Load or create conversation
    let conversation = null
    let conversationId = conversation_id

    if (conversationId) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single()
      conversation = data
    }

    if (!conversation) {
      // Get most recent conversation
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      conversation = data
      conversationId = data?.id
    }

    const existingMessages: ChatMessage[] = conversation?.messages || []

    // Load case file
    const { data: caseFile } = await supabase
      .from('case_files')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle() as { data: CaseFile | null }

    // Load evidence
    const { data: evidenceRaw } = await supabase
      .from('evidence_items')
      .select('*')
      .eq('user_id', user.id)
      .order('date_observed', { ascending: false })
      .limit(20)

    const evidence = (evidenceRaw || []) as EvidenceItem[]

    // Build system prompt
    const systemPrompt = buildSystemPrompt(caseFile, evidence, messageCount, isPaid)

    // Build message history (limit to last 20 for context window management)
    const historyMessages = existingMessages.slice(-20).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    // Add the new user message
    const allMessages = [
      ...historyMessages,
      { role: 'user' as const, content: message.trim() },
    ]

    // Select model based on complexity
    // Use Sonnet for pattern analysis (detected by keywords), Haiku for general chat
    const needsSonnet = /pattern|analyz|assess|confront|evidence shows|what does this mean|ready to|summary|overview/i.test(message)
    const model = needsSonnet ? MODELS.sonnet : MODELS.haiku

    // Call Claude API (lazy import to avoid build-time errors)
    const { getAnthropicClient } = await import('@/lib/anthropic')
    const client = await getAnthropicClient()
    const aiResponse = await client.messages.create({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: allMessages,
    })

    const reply = aiResponse.content[0].type === 'text'
      ? aiResponse.content[0].text
      : 'I encountered an issue generating a response. Please try again.'

    // Build updated message history
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    }
    const newAssistantMessage: ChatMessage = {
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...existingMessages, newUserMessage, newAssistantMessage]

    // Save/update conversation
    if (conversationId) {
      await supabase
        .from('conversations')
        .update({
          messages: updatedMessages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
    } else {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          messages: updatedMessages,
          case_file_id: caseFile?.id || null,
        })
        .select('id')
        .single()
      conversationId = newConv?.id
    }

    // Increment message count
    const newMessageCount = messageCount + 1
    await supabase
      .from('users')
      .update({ message_count: newMessageCount })
      .eq('id', user.id)

    // Parse AI response for case file updates
    await updateCaseFileFromResponse(supabase, user.id, caseFile, message, reply)

    return NextResponse.json({
      reply,
      conversation_id: conversationId,
      message_count: newMessageCount,
      requires_subscription: false,
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

// Heuristic updates to the case file based on conversation content
async function updateCaseFileFromResponse(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  existingCaseFile: CaseFile | null,
  userMessage: string,
  aiReply: string
) {
  try {
    // Extract suspicion level signals from AI reply
    let suspicionLevel = existingCaseFile?.suspicion_level || 'unknown'
    if (/high concern|significant pattern|multiple red flags/i.test(aiReply)) suspicionLevel = 'high'
    else if (/moderate concern|some patterns|worth investigating/i.test(aiReply)) suspicionLevel = 'moderate'
    else if (/low concern|likely innocent|not typical of cheating/i.test(aiReply)) suspicionLevel = 'low'

    // Detect phase from AI reply
    let phase = existingCaseFile?.phase || 1
    if (/confrontation|ready to confront/i.test(aiReply)) phase = Math.max(phase, 4)
    else if (/pattern|evidence shows|analyzing/i.test(aiReply)) phase = Math.max(phase, 3)
    else if (/investigate|module|look for|check/i.test(aiReply)) phase = Math.max(phase, 2)

    if (!existingCaseFile) {
      // Create initial case file if we have enough context
      if (userMessage.length > 50) {
        await supabase.from('case_files').insert({
          user_id: userId,
          status: 'active',
          phase: 1,
          suspicion_level: suspicionLevel,
          investigation_progress: 5,
          partner_profile: {},
        })
      }
    } else {
      // Update existing case file
      const progress = Math.min(
        100,
        (existingCaseFile.investigation_progress || 0) + 2
      )

      await supabase
        .from('case_files')
        .update({
          suspicion_level: suspicionLevel,
          phase,
          investigation_progress: progress,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCaseFile.id)
    }
  } catch {
    // Non-critical — don't fail the request
  }
}
