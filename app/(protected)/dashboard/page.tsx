import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MessageSquare, FileText, TrendingUp, ChevronRight, AlertCircle, CheckCircle, Clock, Shield, ArrowRight, Zap } from 'lucide-react'
import type { CaseFile, EvidenceItem, User } from '@/lib/types'
import { PHASE_LABELS, EVIDENCE_TYPE_LABELS, FREE_MESSAGE_LIMIT } from '@/lib/types'

async function getDashboardData(userId: string) {
  const supabase = await createClient()

  const [caseFileResult, evidenceResult, userResult] = await Promise.all([
    supabase
      .from('case_files')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('evidence_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single(),
  ])

  return {
    caseFile: caseFileResult.data as CaseFile | null,
    recentEvidence: (evidenceResult.data || []) as EvidenceItem[],
    userProfile: userResult.data as User | null,
  }
}

const suspicionColors: Record<string, string> = {
  unknown: 'text-[#6e6050] bg-[#6e6050]/10 border-[#6e6050]/20',
  low: 'text-green-400 bg-green-400/10 border-green-400/20',
  moderate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  confirmed: 'text-red-400 bg-red-400/10 border-red-400/20',
}

const evidenceTypeColors: Record<string, string> = {
  digital: 'text-blue-400 bg-blue-400/10',
  schedule: 'text-purple-400 bg-purple-400/10',
  financial: 'text-green-400 bg-green-400/10',
  communication: 'text-amber-400 bg-amber-400/10',
  behavioral: 'text-pink-400 bg-pink-400/10',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { caseFile, recentEvidence, userProfile } = await getDashboardData(user.id)

  const isPaid = userProfile?.subscription_status === 'active'
  const messageCount = userProfile?.message_count || 0
  const messagesRemaining = Math.max(0, FREE_MESSAGE_LIMIT - messageCount)
  const progressPct = caseFile?.investigation_progress || 0

  return (
    <div className="md:pl-56 pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 pt-16 md:pt-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#f0ebe0]">Case Dashboard</h1>
            <p className="text-sm text-[#6e6050]">
              {caseFile ? `Phase ${caseFile.phase} — ${PHASE_LABELS[caseFile.phase]}` : 'Start your investigation'}
            </p>
          </div>
          <Link
            href="/chat"
            className="flex items-center gap-1.5 bg-[#c9a84c] text-[#0f0e0c] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#e0c070] transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Investigate
          </Link>
        </div>

        {/* Free tier warning */}
        {!isPaid && (
          <div className={`mb-4 p-4 rounded-xl border flex items-start gap-3 ${
            messagesRemaining <= 2
              ? 'bg-orange-500/8 border-orange-500/20'
              : 'bg-[#c9a84c]/5 border-[#c9a84c]/15'
          }`}>
            {messagesRemaining <= 2 ? (
              <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
            ) : (
              <MessageSquare className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${messagesRemaining <= 2 ? 'text-orange-400' : 'text-[#c9a84c]'}`}>
                {messagesRemaining === 0
                  ? 'Free messages used — upgrade to continue'
                  : `${messagesRemaining} free message${messagesRemaining !== 1 ? 's' : ''} remaining`}
              </p>
              <p className="text-xs text-[#6e6050] mt-0.5">
                Upgrade for unlimited investigation support
              </p>
            </div>
            <Link
              href="/pricing"
              className="text-xs text-[#c9a84c] hover:text-[#e0c070] font-medium whitespace-nowrap flex items-center gap-1"
            >
              Upgrade <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Case status card */}
        {caseFile ? (
          <div className="mb-4 p-5 bg-[#1e1c18] border border-[#2e2b25] rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6e6050] font-mono">CASE FILE</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${suspicionColors[caseFile.suspicion_level]}`}>
                  {caseFile.suspicion_level.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-[#6e6050]">
                {caseFile.status.toUpperCase()}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#b8a98a]">Investigation progress</span>
                <span className="text-[#c9a84c] font-medium">{progressPct}%</span>
              </div>
              <div className="h-2 bg-[#0f0e0c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#9a7a32] to-[#c9a84c] rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-[#f0ebe0]">{caseFile.phase}</div>
                <div className="text-xs text-[#6e6050]">Phase</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#f0ebe0]">{recentEvidence.length}</div>
                <div className="text-xs text-[#6e6050]">Evidence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#f0ebe0]">{PHASE_LABELS[caseFile.phase].split(' ')[0]}</div>
                <div className="text-xs text-[#6e6050]">Status</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-5 bg-[#1e1c18] border border-[#2e2b25] border-dashed rounded-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-[#c9a84c]" />
            </div>
            <h3 className="font-semibold text-[#f0ebe0] mb-1">No case file yet</h3>
            <p className="text-sm text-[#b8a98a] mb-4">Start a conversation with Vigil to begin your investigation.</p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f0e0c] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#e0c070] transition-all"
            >
              Start investigation
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link
            href="/chat"
            className="flex items-center gap-3 p-4 bg-[#1e1c18] border border-[#2e2b25] rounded-2xl hover:border-[#c9a84c]/20 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#c9a84c]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#f0ebe0] group-hover:text-[#c9a84c] transition-colors">Chat</div>
              <div className="text-xs text-[#6e6050]">Talk to Vigil</div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6e6050] group-hover:text-[#c9a84c] transition-colors" />
          </Link>
          <Link
            href="/evidence"
            className="flex items-center gap-3 p-4 bg-[#1e1c18] border border-[#2e2b25] rounded-2xl hover:border-[#c9a84c]/20 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#c9a84c]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#f0ebe0] group-hover:text-[#c9a84c] transition-colors">Evidence</div>
              <div className="text-xs text-[#6e6050]">Log & review</div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6e6050] group-hover:text-[#c9a84c] transition-colors" />
          </Link>
        </div>

        {/* Recent evidence */}
        {recentEvidence.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#f0ebe0]">Recent Evidence</h2>
              <Link href="/evidence" className="text-xs text-[#c9a84c] hover:text-[#e0c070] flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentEvidence.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3.5 bg-[#1e1c18] border border-[#2e2b25] rounded-xl">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 shrink-0 ${evidenceTypeColors[item.type]}`}>
                    {EVIDENCE_TYPE_LABELS[item.type].split(' ')[0]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#f0ebe0] line-clamp-2">{item.description}</p>
                    <p className="text-xs text-[#6e6050] mt-0.5">{item.date_observed}</p>
                  </div>
                  <span className={`text-xs shrink-0 ${
                    item.significance_level === 'critical' ? 'text-red-400' :
                    item.significance_level === 'high' ? 'text-orange-400' :
                    item.significance_level === 'medium' ? 'text-amber-400' :
                    'text-[#6e6050]'
                  }`}>
                    {item.significance_level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investigation modules */}
        <div>
          <h2 className="text-sm font-semibold text-[#f0ebe0] mb-3">Investigation Modules</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'A', label: 'Digital Behavior', desc: 'Phone, apps, social media patterns', icon: '📱', locked: !isPaid && messageCount < 3 },
              { id: 'B', label: 'Schedule & Routine', desc: 'Time gaps, work changes, unexplained absences', icon: '🕐', locked: !isPaid && messageCount < 3 },
              { id: 'C', label: 'Financial Red Flags', desc: 'Unexplained expenses, cash withdrawals', icon: '💳', locked: !isPaid },
              { id: 'D', label: 'Communication', desc: 'Texting patterns, call behavior, hidden contacts', icon: '💬', locked: !isPaid },
              { id: 'E', label: 'Emotional & Physical', desc: 'Appearance changes, intimacy shifts, guilt', icon: '🔍', locked: !isPaid },
            ].map(module => (
              <div
                key={module.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                  module.locked
                    ? 'bg-[#1a1814] border-[#2e2b25]/50 opacity-60'
                    : 'bg-[#1e1c18] border-[#2e2b25] hover:border-[#c9a84c]/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#272420] flex items-center justify-center text-base shrink-0">
                  {module.locked ? <Shield className="w-4 h-4 text-[#6e6050]" /> : <span>{module.icon}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#f0ebe0]">Module {module.id} — {module.label}</div>
                  <div className="text-xs text-[#6e6050]">{module.desc}</div>
                </div>
                {module.locked ? (
                  <Link href="/pricing" className="text-xs text-[#c9a84c] shrink-0">Unlock</Link>
                ) : (
                  <Link href="/chat" className="text-xs text-[#c9a84c] shrink-0 flex items-center gap-0.5">
                    Start <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade CTA if not paid */}
        {!isPaid && (
          <div className="mt-4 p-5 bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#c9a84c]" />
              <span className="text-sm font-semibold text-[#c9a84c]">Unlock Full Investigation</span>
            </div>
            <p className="text-sm text-[#b8a98a] mb-4">
              Get unlimited conversations, all 5 modules, pattern analysis, and confrontation prep — starting at $9.99/week.
            </p>
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0f0e0c] py-2.5 px-5 rounded-xl text-sm font-semibold hover:bg-[#e0c070] transition-all"
            >
              View plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {isPaid && (
          <div className="mt-4 flex items-center gap-2 p-3.5 bg-green-500/5 border border-green-500/15 rounded-xl">
            <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-400">
                {userProfile?.subscription_plan === 'weekly' ? 'Weekly Plan' :
                 userProfile?.subscription_plan === 'monthly' ? 'Monthly Plan' :
                 'Confrontation Pack'} active
              </p>
              <p className="text-xs text-[#6e6050]">Full investigation access</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
