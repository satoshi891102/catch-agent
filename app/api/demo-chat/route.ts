import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/system-prompt'
import type { CaseFile, EvidenceItem } from '@/lib/types'

export const maxDuration = 60

// Simple in-memory rate limiter (per IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30 // messages per window
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT - 1 }
  }
  
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 }
  }
  
  entry.count++
  return { allowed: true, remaining: RATE_LIMIT - entry.count }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const { allowed, remaining } = checkRateLimit(ip)
    
    if (!allowed) {
      return NextResponse.json(
        { error: 'You\'re sending messages too quickly. Please wait a moment and try again.' },
        { 
          status: 429,
          headers: { 'Retry-After': '60' }
        }
      )
    }

    const body = await request.json()
    const {
      messages,
      caseFile: clientCaseFile,
      evidence: clientEvidence,
      messageCount: clientMessageCount,
    } = body as {
      messages: Array<{ role: string; content: string }>
      caseFile?: CaseFile | null
      evidence?: EvidenceItem[]
      messageCount?: number
    }

    if (!messages?.length) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    // Validate message length (prevent abuse)
    const lastMsg = messages[messages.length - 1]
    if (lastMsg?.content && lastMsg.content.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep it under 5000 characters.' },
        { status: 400 }
      )
    }

    // Use client-provided case data if available, otherwise use defaults
    const caseFile: CaseFile | null = clientCaseFile || null
    const evidence: EvidenceItem[] = clientEvidence || []
    const messageCount = clientMessageCount || messages.filter(m => m.role === 'user').length

    const systemPrompt = buildSystemPrompt(caseFile, evidence, messageCount, false)

    // Keep last 30 messages for context window management
    const formattedMessages = messages.slice(-30).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Call Claude
    const { getAnthropicClient } = await import('@/lib/anthropic')
    const client = await getAnthropicClient()

    // Model selection strategy:
    // - Sonnet for first 3 messages (critical retention window)
    // - Sonnet for crisis language (safety-critical)
    // - Sonnet for analysis requests
    // - Haiku for everything else (speed + cost)
    const lastUserMsg = formattedMessages.filter(m => m.role === 'user').pop()?.content || ''
    const userMsgCount = formattedMessages.filter(m => m.role === 'user').length
    
    const isCrisis = /\b(kill|suicid|end.{0,5}(it|life)|hurt.{0,5}(my)?self|don'?t want to live|afraid|violent|abuse|hit.{0,5}me|beat|threaten)\b/i.test(lastUserMsg)
    const isAnalysis = /pattern|analyz|assess|confront|evidence shows|what does this mean|ready to|summary|overview|what do you think/i.test(lastUserMsg)
    const needsSonnet = isCrisis || userMsgCount <= 3 || isAnalysis

    const aiResponse = await client.messages.create({
      model: needsSonnet ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: formattedMessages,
    })

    const reply = aiResponse.content[0].type === 'text'
      ? aiResponse.content[0].text
      : 'I had trouble processing that. Could you rephrase?'

    const response = NextResponse.json({
      content: reply,
      model: needsSonnet ? 'sonnet' : 'haiku',
    })
    
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    return response

  } catch (error: unknown) {
    console.error('Demo chat error:', error)
    
    // Differentiate error types for better user experience
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('rate_limit') || errorMessage.includes('429')) {
      return NextResponse.json(
        { error: 'Vigil is thinking hard. Please wait a moment and try again.' },
        { status: 429 }
      )
    }
    
    if (errorMessage.includes('authentication') || errorMessage.includes('401') || errorMessage.includes('invalid_api_key')) {
      return NextResponse.json(
        { error: 'Vigil is temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong. Vigil will be back shortly.' },
      { status: 500 }
    )
  }
}
