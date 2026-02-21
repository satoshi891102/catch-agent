// Core type definitions for Catch Agent

export type SubscriptionStatus = 'free' | 'active' | 'past_due' | 'canceled' | 'trialing'
export type SubscriptionPlan = 'weekly' | 'monthly' | 'confrontation' | null
export type CaseStatus = 'active' | 'resolved' | 'paused' | 'closed'
export type SuspicionLevel = 'unknown' | 'low' | 'moderate' | 'high' | 'confirmed'
export type EvidenceType = 'digital' | 'schedule' | 'financial' | 'communication' | 'behavioral'
export type SignificanceLevel = 'low' | 'medium' | 'high' | 'critical'
export type InvestigationModule = 'A' | 'B' | 'C' | 'D' | 'E'

export interface User {
  id: string
  email: string | null
  created_at: string
  updated_at: string
  subscription_status: SubscriptionStatus
  subscription_plan: SubscriptionPlan
  message_count: number
  is_anonymous: boolean
  stripe_customer_id: string | null
}

export interface PartnerProfile {
  relationship_type?: string // marriage, dating, cohabiting
  relationship_duration?: string
  children?: boolean
  children_count?: number
  shared_finances?: boolean
  living_together?: boolean
  partner_name_alias?: string // optional alias for reference
  suspicion_start_date?: string
  gut_feeling_score?: number // 1-10
  initial_triggers?: string[]
}

export interface CaseFile {
  id: string
  user_id: string
  status: CaseStatus
  phase: number // 1-5
  partner_profile: PartnerProfile
  suspicion_level: SuspicionLevel
  investigation_progress: number // 0-100
  notes: string | null
  created_at: string
  updated_at: string
}

export interface EvidenceItem {
  id: string
  case_file_id: string
  user_id: string
  type: EvidenceType
  description: string
  date_observed: string
  significance_level: SignificanceLevel
  module_source: InvestigationModule | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  user_id: string
  messages: ChatMessage[]
  case_file_id: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  plan: Exclude<SubscriptionPlan, null>
  status: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// API Request/Response types
export interface ChatRequest {
  message: string
  conversation_id?: string
}

export interface ChatResponse {
  reply: string
  conversation_id: string
  message_count: number
  requires_subscription: boolean
}

export interface EvidenceCreateRequest {
  type: EvidenceType
  description: string
  date_observed?: string
  significance_level?: SignificanceLevel
  module_source?: InvestigationModule
  tags?: string[]
}

export interface StripeCheckoutRequest {
  plan: 'weekly' | 'monthly' | 'confrontation'
  success_url?: string
  cancel_url?: string
}

// Pricing
export interface PricingPlan {
  id: 'weekly' | 'monthly' | 'confrontation'
  name: string
  price: number
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  badge?: string
  priceId: string
}

export const FREE_MESSAGE_LIMIT = 10

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 9.99,
    period: '/week',
    description: 'Start your investigation now',
    badge: 'Most Urgent',
    features: [
      'Unlimited conversations',
      'Full case file system',
      'All 5 investigation modules',
      'Pattern analysis',
      'Evidence tracking',
      'Daily check-in prompts',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID || '',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 29.99,
    period: '/month',
    description: 'For thorough investigations',
    highlighted: true,
    badge: 'Best Value',
    features: [
      'Everything in Weekly',
      'Confrontation toolkit',
      'Legal preparation guide',
      'Exit planning module',
      'Priority support',
      'Save ~$10 vs weekly',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '',
  },
  {
    id: 'confrontation',
    name: 'Confrontation Pack',
    price: 49.99,
    period: 'one-time',
    description: 'When you\'re ready for the truth',
    features: [
      'Complete confrontation scripts',
      'Recording laws by state',
      'Evidence organization guide',
      'Safety planning template',
      'Attorney consultation prep',
      'Lifetime access',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_CONFRONTATION_PRICE_ID || '',
  },
]

export const PHASE_LABELS: Record<number, string> = {
  1: 'Initial Assessment',
  2: 'Evidence Gathering',
  3: 'Pattern Analysis',
  4: 'Confrontation Prep',
  5: 'Aftermath & Next Steps',
}

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  digital: 'Digital Behavior',
  schedule: 'Schedule & Routine',
  financial: 'Financial',
  communication: 'Communication',
  behavioral: 'Emotional & Behavioral',
}

export const MODULE_LABELS: Record<InvestigationModule, string> = {
  A: 'Digital Behavior',
  B: 'Schedule & Routine',
  C: 'Financial Red Flags',
  D: 'Communication Patterns',
  E: 'Emotional & Physical',
}
