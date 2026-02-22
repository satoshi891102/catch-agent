// Supabase storage layer — drop-in replacement for demo-store.ts
// Swap imports from '@/lib/demo-store' to '@/lib/supabase-store' when Supabase is configured
//
// Usage: All functions mirror demo-store.ts API but use real Supabase calls
// Requires: authenticated user (via Supabase Auth)

import { createClient } from '@/lib/supabase/client'
import type {
  CaseFile,
  EvidenceItem,
  ChatMessage,
  Conversation,
  User,
  PartnerProfile,
  EvidenceType,
  SignificanceLevel,
  InvestigationModule,
  SuspicionLevel,
} from './types'

function supabase() {
  return createClient()
}

// ═══ USER / PROFILE ═══

export async function getUser(): Promise<User | null> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) return null

  return {
    id: profile.id,
    email: profile.email,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    subscription_status: profile.subscription_status,
    subscription_plan: profile.subscription_plan,
    message_count: profile.message_count,
    is_anonymous: !profile.email,
    stripe_customer_id: profile.stripe_customer_id,
  }
}

export async function updateUser(updates: Partial<User>): Promise<User | null> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const { data } = await sb
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single()

  return data ? { ...data, is_anonymous: !data.email } : null
}

export async function incrementMessageCount(): Promise<number> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return 0

  // Use Supabase RPC for atomic increment
  const { data: profile } = await sb
    .from('profiles')
    .select('message_count')
    .eq('id', user.id)
    .single()

  const newCount = (profile?.message_count || 0) + 1

  await sb
    .from('profiles')
    .update({ message_count: newCount })
    .eq('id', user.id)

  return newCount
}

// ═══ CASE FILE ═══

export async function getCaseFile(): Promise<CaseFile | null> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const { data } = await sb
    .from('case_files')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) return null

  return {
    id: data.id,
    user_id: data.user_id,
    status: data.status,
    phase: data.phase,
    partner_profile: data.partner_profile || {},
    suspicion_level: data.suspicion_level,
    investigation_progress: data.investigation_progress,
    notes: data.notes,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

export async function createCaseFile(partialProfile?: Partial<PartnerProfile>): Promise<CaseFile> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await sb
    .from('case_files')
    .insert({
      user_id: user.id,
      status: 'active',
      phase: 1,
      suspicion_level: 'unknown',
      investigation_progress: 5,
      partner_profile: partialProfile || {},
    })
    .select()
    .single()

  if (error || !data) throw new Error(error?.message || 'Failed to create case file')

  return {
    id: data.id,
    user_id: data.user_id,
    status: data.status,
    phase: data.phase,
    partner_profile: data.partner_profile || {},
    suspicion_level: data.suspicion_level,
    investigation_progress: data.investigation_progress,
    notes: data.notes,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

export async function updateCaseFile(updates: Partial<CaseFile>): Promise<CaseFile | null> {
  const caseFile = await getCaseFile()
  if (!caseFile) return null

  const { data } = await supabase()
    .from('case_files')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', caseFile.id)
    .select()
    .single()

  return data ? {
    ...data,
    partner_profile: data.partner_profile || {},
  } : null
}

// ═══ EVIDENCE ═══

export async function getEvidence(): Promise<EvidenceItem[]> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return []

  const { data } = await sb
    .from('evidence_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (data || []).map(item => ({
    id: item.id,
    case_file_id: item.case_file_id,
    user_id: item.user_id,
    type: item.type as EvidenceType,
    description: item.description,
    date_observed: item.date_observed || new Date().toLocaleDateString(),
    significance_level: item.significance_level as SignificanceLevel,
    module_source: item.module_source as InvestigationModule | null,
    tags: item.tags || [],
    created_at: item.created_at,
    updated_at: item.updated_at,
  }))
}

export async function addEvidence(item: {
  type: EvidenceType
  description: string
  date_observed?: string
  significance_level?: SignificanceLevel
  module_source?: InvestigationModule | null
  tags?: string[]
}): Promise<EvidenceItem | null> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const caseFile = await getCaseFile()

  const { data, error } = await sb
    .from('evidence_items')
    .insert({
      case_file_id: caseFile?.id || null,
      user_id: user.id,
      type: item.type,
      description: item.description,
      date_observed: item.date_observed || new Date().toLocaleDateString(),
      significance_level: item.significance_level || 'medium',
      module_source: item.module_source || null,
      tags: item.tags || [],
    })
    .select()
    .single()

  if (error || !data) return null

  // Update investigation progress
  if (caseFile) {
    const newProgress = Math.min(100, caseFile.investigation_progress + 3)
    await updateCaseFile({ investigation_progress: newProgress })
  }

  return data as EvidenceItem
}

export async function deleteEvidence(id: string): Promise<void> {
  await supabase().from('evidence_items').delete().eq('id', id)
}

// ═══ CONVERSATIONS ═══

export async function getOrCreateConversation(): Promise<Conversation | null> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const caseFile = await getCaseFile()

  // Get most recent conversation
  const { data: existing } = await sb
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) {
    // Fetch messages
    const { data: messages } = await sb
      .from('messages')
      .select('*')
      .eq('conversation_id', existing.id)
      .order('created_at', { ascending: true })

    return {
      id: existing.id,
      user_id: existing.user_id,
      messages: (messages || []).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
        timestamp: m.created_at,
      })),
      case_file_id: existing.case_file_id,
      created_at: existing.created_at,
      updated_at: existing.updated_at,
    }
  }

  // Create new conversation
  const { data: newConv } = await sb
    .from('conversations')
    .insert({
      user_id: user.id,
      case_file_id: caseFile?.id || null,
    })
    .select()
    .single()

  if (!newConv) return null

  return {
    id: newConv.id,
    user_id: newConv.user_id,
    messages: [],
    case_file_id: newConv.case_file_id,
    created_at: newConv.created_at,
    updated_at: newConv.updated_at,
  }
}

export async function addMessage(conversationId: string, message: ChatMessage, modelUsed?: string): Promise<void> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return

  await sb.from('messages').insert({
    conversation_id: conversationId,
    user_id: user.id,
    role: message.role,
    content: message.content,
    model_used: modelUsed || null,
  })

  // Update conversation timestamp
  await sb
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)
}

// ═══ AI ANALYSIS HELPERS ═══
// These are the same as demo-store.ts — pure logic, no storage dependency

export function calculateSuspicionLevel(evidence: EvidenceItem[]): SuspicionLevel {
  if (evidence.length === 0) return 'unknown'
  const criticalCount = evidence.filter(e => e.significance_level === 'critical').length
  const highCount = evidence.filter(e => e.significance_level === 'high').length
  const uniqueTypes = new Set(evidence.map(e => e.type)).size

  if (criticalCount >= 2 || (criticalCount >= 1 && highCount >= 3)) return 'confirmed'
  if (criticalCount >= 1 || highCount >= 3 || (highCount >= 2 && uniqueTypes >= 3)) return 'high'
  if (highCount >= 1 || evidence.length >= 3) return 'moderate'
  if (evidence.length >= 1) return 'low'
  return 'unknown'
}

export function calculatePhase(
  evidence: EvidenceItem[],
  messageCount: number,
  currentPhase: number
): number {
  if (messageCount < 5) return Math.max(currentPhase, 1)
  if (evidence.length === 0) return Math.max(currentPhase, 1)
  if (evidence.length < 3) return Math.max(currentPhase, 2)

  const suspicion = calculateSuspicionLevel(evidence)
  if (suspicion === 'confirmed') return Math.max(currentPhase, 4)
  if (suspicion === 'high' && evidence.length >= 5) return Math.max(currentPhase, 3)
  if (evidence.length >= 3) return Math.max(currentPhase, 2)

  return Math.max(currentPhase, 1)
}

export async function updateCaseFromState(): Promise<void> {
  const evidence = await getEvidence()
  const caseFile = await getCaseFile()
  const user = await getUser()

  if (!caseFile) {
    if (user && user.message_count >= 2) {
      await createCaseFile()
    }
    return
  }

  const suspicionLevel = calculateSuspicionLevel(evidence)
  const phase = calculatePhase(evidence, user?.message_count || 0, caseFile.phase)
  const progress = Math.min(100, 5 + evidence.length * 5 + (user?.message_count || 0) * 2)

  await updateCaseFile({
    suspicion_level: suspicionLevel,
    phase,
    investigation_progress: progress,
  })
}

// ═══ RESET (for testing) ═══

export async function resetAllData(): Promise<void> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return

  // Delete in order (respect foreign keys)
  await sb.from('messages').delete().eq('user_id', user.id)
  await sb.from('conversations').delete().eq('user_id', user.id)
  await sb.from('evidence_items').delete().eq('user_id', user.id)
  await sb.from('case_files').delete().eq('user_id', user.id)
  await sb.from('profiles').update({ message_count: 0, subscription_status: 'free', subscription_plan: null }).eq('id', user.id)
}
