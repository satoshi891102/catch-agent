import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { EvidenceCreateRequest } from '@/lib/types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: evidence, error } = await supabase
      .from('evidence_items')
      .select('*')
      .eq('user_id', user.id)
      .order('date_observed', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ evidence: evidence || [] })
  } catch {
    return NextResponse.json({ error: 'Failed to load evidence' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as EvidenceCreateRequest

    if (!body.type || !body.description?.trim()) {
      return NextResponse.json({ error: 'Type and description are required' }, { status: 400 })
    }

    const validTypes = ['digital', 'schedule', 'financial', 'communication', 'behavioral']
    if (!validTypes.includes(body.type)) {
      return NextResponse.json({ error: 'Invalid evidence type' }, { status: 400 })
    }

    // Get case file ID
    const { data: caseFile } = await supabase
      .from('case_files')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let caseFileId = caseFile?.id

    // Create case file if none exists
    if (!caseFileId) {
      const { data: newCaseFile } = await supabase
        .from('case_files')
        .insert({
          user_id: user.id,
          status: 'active',
          phase: 1,
          suspicion_level: 'unknown',
          investigation_progress: 0,
          partner_profile: {},
        })
        .select('id')
        .single()
      caseFileId = newCaseFile?.id
    }

    const { data: evidence, error } = await supabase
      .from('evidence_items')
      .insert({
        case_file_id: caseFileId,
        user_id: user.id,
        type: body.type,
        description: body.description.trim(),
        date_observed: body.date_observed || new Date().toISOString().split('T')[0],
        significance_level: body.significance_level || 'medium',
        module_source: body.module_source || null,
        tags: body.tags || [],
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ evidence }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create evidence' }, { status: 500 })
  }
}
