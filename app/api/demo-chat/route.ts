import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/system-prompt'
import type { CaseFile, EvidenceItem } from '@/lib/types'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body as { messages: Array<{ role: string; content: string }> }

    if (!messages?.length) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    // Build a demo-appropriate system prompt
    const demoCaseFile: CaseFile = {
      id: 'demo',
      user_id: 'demo',
      status: 'active',
      phase: 2,
      suspicion_level: 'moderate',
      investigation_progress: 35,
      partner_profile: {},
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const demoEvidence: EvidenceItem[] = [
      {
        id: '1', user_id: 'demo', case_file_id: 'demo',
        type: 'digital',
        description: 'Changed phone password, phone always face-down',
        date_observed: '3 days ago',
        significance_level: 'high',
        
        module_source: null, tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2', user_id: 'demo', case_file_id: 'demo',
        type: 'schedule',
        description: 'Working late Tue/Thu, never did before',
        date_observed: '1 week ago',
        significance_level: 'high',
        
        module_source: null, tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const systemPrompt = buildSystemPrompt(demoCaseFile, demoEvidence, 3, false)

    const formattedMessages = messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Call Claude
    const { getAnthropicClient } = await import('@/lib/anthropic')
    const client = await getAnthropicClient()
    const aiResponse = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      system: systemPrompt,
      messages: formattedMessages,
    })

    const reply = aiResponse.content[0].type === 'text'
      ? aiResponse.content[0].text
      : 'I had trouble processing that. Could you rephrase?'

    return NextResponse.json({ content: reply })

  } catch (error) {
    console.error('Demo chat error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
