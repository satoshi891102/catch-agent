// Demo storage layer — uses localStorage for persistence without Supabase
// Swappable to Supabase when credentials are available

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

const STORAGE_KEYS = {
  user: 'vigil_demo_user',
  caseFile: 'vigil_demo_case',
  evidence: 'vigil_demo_evidence',
  conversations: 'vigil_demo_conversations',
  activeConversation: 'vigil_demo_active_conv',
} as const

function generateId(): string {
  return `demo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setItem(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

// ═══ USER ═══

export function getDemoUser(): User {
  const existing = getItem<User>(STORAGE_KEYS.user)
  if (existing) return existing

  const user: User = {
    id: generateId(),
    email: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subscription_status: 'free',
    subscription_plan: null,
    message_count: 0,
    is_anonymous: true,
    stripe_customer_id: null,
  }
  setItem(STORAGE_KEYS.user, user)
  return user
}

export function updateDemoUser(updates: Partial<User>): User {
  const user = getDemoUser()
  const updated = { ...user, ...updates, updated_at: new Date().toISOString() }
  setItem(STORAGE_KEYS.user, updated)
  return updated
}

export function incrementMessageCount(): number {
  const user = getDemoUser()
  const newCount = user.message_count + 1
  updateDemoUser({ message_count: newCount })
  return newCount
}

// ═══ CASE FILE ═══

export function getDemoCaseFile(): CaseFile | null {
  return getItem<CaseFile>(STORAGE_KEYS.caseFile)
}

export function createDemoCaseFile(partialProfile?: Partial<PartnerProfile>): CaseFile {
  const caseFile: CaseFile = {
    id: generateId(),
    user_id: getDemoUser().id,
    status: 'active',
    phase: 1,
    partner_profile: partialProfile || {},
    suspicion_level: 'unknown',
    investigation_progress: 5,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  setItem(STORAGE_KEYS.caseFile, caseFile)
  return caseFile
}

export function updateDemoCaseFile(updates: Partial<CaseFile>): CaseFile {
  const existing = getDemoCaseFile()
  if (!existing) return createDemoCaseFile()
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() }
  setItem(STORAGE_KEYS.caseFile, updated)
  return updated
}

// ═══ EVIDENCE ═══

export function getDemoEvidence(): EvidenceItem[] {
  return getItem<EvidenceItem[]>(STORAGE_KEYS.evidence) || []
}

export function addDemoEvidence(item: {
  type: EvidenceType
  description: string
  date_observed?: string
  significance_level?: SignificanceLevel
  module_source?: InvestigationModule | null
  tags?: string[]
}): EvidenceItem {
  const evidence = getDemoEvidence()
  const newItem: EvidenceItem = {
    id: generateId(),
    case_file_id: getDemoCaseFile()?.id || 'none',
    user_id: getDemoUser().id,
    type: item.type,
    description: item.description,
    date_observed: item.date_observed || new Date().toLocaleDateString(),
    significance_level: item.significance_level || 'medium',
    module_source: item.module_source || null,
    tags: item.tags || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  evidence.unshift(newItem) // newest first
  setItem(STORAGE_KEYS.evidence, evidence)

  // Update investigation progress
  const caseFile = getDemoCaseFile()
  if (caseFile) {
    const newProgress = Math.min(100, caseFile.investigation_progress + 3)
    updateDemoCaseFile({ investigation_progress: newProgress })
  }

  return newItem
}

export function deleteDemoEvidence(id: string): void {
  const evidence = getDemoEvidence().filter(e => e.id !== id)
  setItem(STORAGE_KEYS.evidence, evidence)
}

// ═══ CONVERSATIONS ═══

export function getDemoConversation(): Conversation {
  const existing = getItem<Conversation>(STORAGE_KEYS.activeConversation)
  if (existing) return existing

  const conv: Conversation = {
    id: generateId(),
    user_id: getDemoUser().id,
    messages: [],
    case_file_id: getDemoCaseFile()?.id || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  setItem(STORAGE_KEYS.activeConversation, conv)
  return conv
}

export function addMessageToConversation(message: ChatMessage): Conversation {
  const conv = getDemoConversation()
  conv.messages.push(message)
  conv.updated_at = new Date().toISOString()
  setItem(STORAGE_KEYS.activeConversation, conv)
  return conv
}

// ═══ AI ANALYSIS HELPERS ═══

/**
 * Parse AI response to extract evidence items mentioned
 * Returns evidence suggestions the UI can prompt the user to confirm
 */
export function extractEvidenceFromResponse(aiReply: string): Array<{
  type: EvidenceType
  description: string
  significance_level: SignificanceLevel
}> {
  const evidence: Array<{
    type: EvidenceType
    description: string
    significance_level: SignificanceLevel
  }> = []

  // Look for structured evidence markers in AI response
  const evidencePattern = new RegExp('\\[EVIDENCE:(\\w+)\\|(\\w+)\\]\\s*(.+?)(?=\\[EVIDENCE|\\n\\n|$)', 'gs')
  let match
  while ((match = evidencePattern.exec(aiReply)) !== null) {
    const type = match[1] as EvidenceType
    const significance = match[2] as SignificanceLevel
    const description = match[3].trim()
    if (['digital', 'schedule', 'financial', 'communication', 'behavioral'].includes(type)) {
      evidence.push({ type, description, significance_level: significance })
    }
  }

  return evidence
}

/**
 * Determine suspicion level from conversation context
 */
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

/**
 * Determine investigation phase from evidence and conversation state
 */
export function calculatePhase(
  evidence: EvidenceItem[],
  messageCount: number,
  currentPhase: number
): number {
  // Never go backwards
  if (messageCount < 5) return Math.max(currentPhase, 1)
  if (evidence.length === 0) return Math.max(currentPhase, 1)
  if (evidence.length < 3) return Math.max(currentPhase, 2)

  const suspicion = calculateSuspicionLevel(evidence)
  if (suspicion === 'confirmed') return Math.max(currentPhase, 4)
  if (suspicion === 'high' && evidence.length >= 5) return Math.max(currentPhase, 3)
  if (evidence.length >= 3) return Math.max(currentPhase, 2)

  return Math.max(currentPhase, 1)
}

/**
 * Update case file based on latest evidence and conversation
 */
export function updateCaseFromState(): void {
  const evidence = getDemoEvidence()
  const caseFile = getDemoCaseFile()
  const user = getDemoUser()

  if (!caseFile) {
    if (user.message_count >= 2) {
      createDemoCaseFile()
    }
    return
  }

  const suspicionLevel = calculateSuspicionLevel(evidence)
  const phase = calculatePhase(evidence, user.message_count, caseFile.phase)
  const progress = Math.min(100, 5 + evidence.length * 5 + user.message_count * 2)

  updateDemoCaseFile({
    suspicion_level: suspicionLevel,
    phase,
    investigation_progress: progress,
  })
}

// ═══ RESET ═══

export function resetDemoData(): void {
  if (typeof window === 'undefined') return
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
}
