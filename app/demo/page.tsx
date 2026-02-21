import Link from 'next/link'
import {
  MessageSquare, FileText, TrendingUp, ChevronRight,
  AlertCircle, CheckCircle, Clock, Shield, ArrowRight, Zap,
  Eye, Search, Brain
} from 'lucide-react'

// Seeded demo data
const DEMO_CASE = {
  phase: 2,
  suspicion_level: 'moderate' as const,
  status: 'active',
  investigation_progress: 35,
  created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
}

const DEMO_EVIDENCE = [
  {
    id: '1',
    type: 'digital',
    description: 'Changed phone password without explanation. Phone now always face-down on surfaces.',
    date_observed: '3 days ago',
    significance_level: 'high',
  },
  {
    id: '2',
    type: 'schedule',
    description: 'Started "working late" every Tuesday and Thursday. Never worked late before in 3 years.',
    date_observed: '1 week ago',
    significance_level: 'high',
  },
  {
    id: '3',
    type: 'communication',
    description: 'Leaves room to take phone calls. Whispers and hangs up when I walk in.',
    date_observed: '5 days ago',
    significance_level: 'medium',
  },
  {
    id: '4',
    type: 'behavioral',
    description: 'Suddenly more attentive — buying flowers for no reason. Never did this before.',
    date_observed: '4 days ago',
    significance_level: 'medium',
  },
  {
    id: '5',
    type: 'financial',
    description: 'Unknown restaurant charge $87 on credit card statement — he said he was at the office.',
    date_observed: '2 days ago',
    significance_level: 'critical',
  },
]

const PHASE_LABELS: Record<number, string> = {
  1: 'Initial Assessment',
  2: 'Evidence Gathering',
  3: 'Pattern Analysis',
  4: 'Decision Prep',
  5: 'Confrontation',
}

const suspicionColors: Record<string, string> = {
  unknown: 'text-[var(--text-muted)] bg-[var(--text-muted)]/10 border-[var(--text-muted)]/20',
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

export default function DemoDashboard() {
  const caseFile = DEMO_CASE
  const recentEvidence = DEMO_EVIDENCE

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Case Dashboard</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Phase {caseFile.phase} — {PHASE_LABELS[caseFile.phase]}
          </p>
        </div>
        <Link
          href="/demo/chat"
          className="btn-gold flex items-center gap-1.5 px-4 py-2 text-sm"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Investigate
        </Link>
      </div>

      {/* Free tier notice */}
      <div className="mb-4 p-4 rounded-xl border bg-[var(--vigil-gold)]/5 border-[var(--vigil-gold)]/15 flex items-start gap-3">
        <MessageSquare className="w-4 h-4 text-[var(--vigil-gold)] mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--vigil-gold)]">7 free messages remaining</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Upgrade for unlimited investigation support</p>
        </div>
        <Link href="/pricing" className="text-xs text-[var(--vigil-gold)] hover:text-[var(--vigil-gold-light)] font-medium whitespace-nowrap flex items-center gap-1">
          Upgrade <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Case status card */}
      <div className="mb-4 p-5 vigil-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-mono tracking-wider">CASE FILE</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${suspicionColors[caseFile.suspicion_level]}`}>
              {caseFile.suspicion_level.toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">
            {caseFile.status.toUpperCase()}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--text-secondary)]">Investigation progress</span>
            <span className="text-[var(--vigil-gold)] font-medium">{caseFile.investigation_progress}%</span>
          </div>
          <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#9a7a32] to-[var(--vigil-gold)] rounded-full"
              style={{ width: `${caseFile.investigation_progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[var(--border-subtle)]">
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--text-primary)]">{caseFile.phase}</div>
            <div className="text-xs text-[var(--text-muted)]">Phase</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--text-primary)]">{recentEvidence.length}</div>
            <div className="text-xs text-[var(--text-muted)]">Evidence</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-amber-400">35%</div>
            <div className="text-xs text-[var(--text-muted)]">Suspicion</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link
          href="/demo/chat"
          className="vigil-card flex items-center gap-3 p-4 group"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--vigil-gold)]/8 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-[var(--vigil-gold)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--vigil-gold)] transition-colors">Chat</div>
            <div className="text-xs text-[var(--text-muted)]">Talk to Vigil</div>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--vigil-gold)] transition-colors" />
        </Link>
        <Link
          href="/demo/evidence"
          className="vigil-card flex items-center gap-3 p-4 group"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--vigil-gold)]/8 flex items-center justify-center">
            <FileText className="w-4 h-4 text-[var(--vigil-gold)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--vigil-gold)] transition-colors">Evidence</div>
            <div className="text-xs text-[var(--text-muted)]">Log & review</div>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--vigil-gold)] transition-colors" />
        </Link>
      </div>

      {/* Recent evidence */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Recent Evidence</h2>
          <Link href="/demo/evidence" className="text-xs text-[var(--vigil-gold)] hover:text-[var(--vigil-gold-light)] flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentEvidence.map(item => (
            <div key={item.id} className="vigil-card flex items-start gap-3 p-3.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 shrink-0 ${evidenceTypeColors[item.type]}`}>
                {item.type}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] line-clamp-2">{item.description}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{item.date_observed}</p>
              </div>
              <span className={`text-xs shrink-0 font-medium ${
                item.significance_level === 'critical' ? 'text-red-400' :
                item.significance_level === 'high' ? 'text-orange-400' :
                item.significance_level === 'medium' ? 'text-amber-400' :
                'text-[var(--text-muted)]'
              }`}>
                {item.significance_level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Investigation modules */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Investigation Modules</h2>
        <div className="space-y-2">
          {[
            { id: 'A', label: 'Digital Behavior', desc: 'Phone, apps, social media patterns', icon: <Eye className="w-4 h-4" />, progress: 60, unlocked: true },
            { id: 'B', label: 'Schedule & Routine', desc: 'Time gaps, work changes, absences', icon: <Clock className="w-4 h-4" />, progress: 40, unlocked: true },
            { id: 'C', label: 'Financial Red Flags', desc: 'Unexplained expenses, cash withdrawals', icon: <TrendingUp className="w-4 h-4" />, progress: 20, unlocked: false },
            { id: 'D', label: 'Communication', desc: 'Texting patterns, call behavior, contacts', icon: <MessageSquare className="w-4 h-4" />, progress: 0, unlocked: false },
            { id: 'E', label: 'Emotional & Physical', desc: 'Appearance changes, intimacy, guilt signals', icon: <Brain className="w-4 h-4" />, progress: 0, unlocked: false },
          ].map(mod => (
            <div
              key={mod.id}
              className={`vigil-card flex items-center gap-3 p-3.5 ${!mod.unlocked ? 'opacity-50' : ''}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                mod.unlocked ? 'bg-[var(--vigil-gold)]/10 text-[var(--vigil-gold)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
              }`}>
                {mod.unlocked ? mod.icon : <Shield className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">Module {mod.id}</span>
                  <span className="text-xs text-[var(--text-muted)]">— {mod.label}</span>
                </div>
                <div className="text-xs text-[var(--text-muted)]">{mod.desc}</div>
                {mod.unlocked && mod.progress > 0 && (
                  <div className="mt-1.5 h-1 bg-[var(--bg-primary)] rounded-full overflow-hidden w-24">
                    <div className="h-full bg-[var(--vigil-gold)]/60 rounded-full" style={{ width: `${mod.progress}%` }} />
                  </div>
                )}
              </div>
              {mod.unlocked ? (
                <Link href="/demo/chat" className="text-xs text-[var(--vigil-gold)] shrink-0 flex items-center gap-0.5 font-medium">
                  Continue <ChevronRight className="w-3 h-3" />
                </Link>
              ) : (
                <Link href="/pricing" className="text-xs text-[var(--vigil-gold)] shrink-0 font-medium">Unlock</Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="mb-6 p-5 bg-[var(--vigil-gold)]/[0.04] border border-[var(--vigil-gold)]/20 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-[var(--vigil-gold)]" />
          <span className="text-sm font-semibold text-[var(--vigil-gold)]">Unlock Full Investigation</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Get unlimited conversations, all 5 modules, pattern analysis, and confrontation prep — starting at $9.99/week.
        </p>
        <Link
          href="/pricing"
          className="btn-gold flex items-center justify-center gap-2 py-2.5 px-5 text-sm w-full sm:w-auto sm:inline-flex"
        >
          View plans
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
