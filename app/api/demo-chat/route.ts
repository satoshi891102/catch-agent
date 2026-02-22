import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/system-prompt'
import type { CaseFile, EvidenceItem } from '@/lib/types'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
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

    // Use client-provided case data if available, otherwise use defaults
    const caseFile: CaseFile | null = clientCaseFile || null
    const evidence: EvidenceItem[] = clientEvidence || []
    const messageCount = clientMessageCount || messages.filter(m => m.role === 'user').length

    const systemPrompt = buildSystemPrompt(caseFile, evidence, messageCount, false)

    const formattedMessages = messages.slice(-30).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Call Claude
    const { getAnthropicClient } = await import('@/lib/anthropic')
    const client = await getAnthropicClient()

    // Use Haiku for speed on general chat, Sonnet for analysis and early critical moments
    const lastUserMsg = formattedMessages.filter(m => m.role === 'user').pop()?.content || ''
    const userMsgCount = formattedMessages.filter(m => m.role === 'user').length
    // Use Sonnet for first 3 messages (critical for retention), analysis requests, and crisis language
    const isCrisis = /\b(kill|suicid|end.{0,5}(it|life)|hurt.{0,5}(my)?self|don'?t want to live|afraid|violent|abuse|hit.{0,5}me|beat|threaten)\b/i.test(lastUserMsg)
    const needsSonnet = isCrisis || userMsgCount <= 3 || /pattern|analyz|assess|confront|evidence shows|what does this mean|ready to|summary|overview|what do you think/i.test(lastUserMsg)

    const aiResponse = await client.messages.create({
      model: needsSonnet ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: formattedMessages,
    })

    const reply = aiResponse.content[0].type === 'text'
      ? aiResponse.content[0].text
      : 'I had trouble processing that. Could you rephrase?'

    return NextResponse.json({
      content: reply,
      model: needsSonnet ? 'sonnet' : 'haiku',
    })

  } catch (error) {
    console.error('Demo chat error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
