import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { FREE_MESSAGE_LIMIT } from '@/lib/types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get latest conversation
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Get user profile for message count
    const { data: userProfile } = await supabase
      .from('users')
      .select('message_count, subscription_status')
      .eq('id', user.id)
      .single()

    const isPaid = userProfile?.subscription_status === 'active'
    const messageCount = userProfile?.message_count || 0

    return NextResponse.json({
      id: conversation?.id || null,
      messages: conversation?.messages || [],
      messageCount,
      isPaid,
      messagesRemaining: isPaid ? null : Math.max(0, FREE_MESSAGE_LIMIT - messageCount),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load conversation' }, { status: 500 })
  }
}
