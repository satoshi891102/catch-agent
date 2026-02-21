import Link from 'next/link'
import { FileText, Plus, ChevronRight, AlertTriangle, ArrowLeft, Calendar, Tag, BarChart3 } from 'lucide-react'

const DEMO_EVIDENCE = [
  {
    id: '1',
    type: 'financial',
    description: 'Unknown restaurant charge $87 on joint credit card — dated Tuesday. He said he was at the office working late that night.',
    date_observed: 'Feb 19, 2026',
    significance_level: 'critical',
    notes: 'Restaurant is an upscale Italian place 30 min from his office. Charge was at 8:47pm.',
  },
  {
    id: '2',
    type: 'digital',
    description: 'Changed phone password without explanation. Phone now always face-down on surfaces. Takes phone to bathroom every time.',
    date_observed: 'Feb 18, 2026',
    significance_level: 'high',
    notes: 'Had the same password for 3 years. Changed it around the same time the late nights started.',
  },
  {
    id: '3',
    type: 'schedule',
    description: 'Working late every Tuesday and Thursday for the past 3 weeks. Gets home around 9pm instead of usual 6pm. Pattern is consistent.',
    date_observed: 'Feb 17, 2026',
    significance_level: 'high',
    notes: 'Never worked late in 3 years together. Started suddenly with no project or deadline mentioned.',
  },
  {
    id: '4',
    type: 'communication',
    description: 'Leaves room to take phone calls. Whispers and quickly hangs up when I walk in. Happened 3 times this week.',
    date_observed: 'Feb 19, 2026',
    significance_level: 'medium',
    notes: 'Used to take all calls openly. New behavior started around same time as late nights.',
  },
  {
    id: '5',
    type: 'behavioral',
    description: 'Suddenly more attentive — bought flowers for no reason, compliments more. Out of character.',
    date_observed: 'Feb 16, 2026',
    significance_level: 'medium',
    notes: 'Could be guilt compensation. Vigil flagged this as a common pattern.',
  },
  {
    id: '6',
    type: 'digital',
    description: 'Notification from unknown contact "J" appeared briefly on lock screen before he swiped it away quickly. Appeared to be a message app.',
    date_observed: 'Feb 20, 2026',
    significance_level: 'high',
    notes: 'He doesn\'t have anyone named J in his contacts that I know of.',
  },
]

const typeConfig: Record<string, { color: string; bg: string; label: string }> = {
  digital: { color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Digital' },
  schedule: { color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'Schedule' },
  financial: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Financial' },
  communication: { color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Communication' },
  behavioral: { color: 'text-pink-400', bg: 'bg-pink-400/10', label: 'Behavioral' },
}

const sigConfig: Record<string, { color: string; label: string }> = {
  critical: { color: 'text-red-400', label: 'CRITICAL' },
  high: { color: 'text-orange-400', label: 'HIGH' },
  medium: { color: 'text-amber-400', label: 'MEDIUM' },
  low: { color: 'text-[var(--text-muted)]', label: 'LOW' },
}

export default function DemoEvidencePage() {
  // Group by type
  const typeCounts = DEMO_EVIDENCE.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const criticalCount = DEMO_EVIDENCE.filter(e => e.significance_level === 'critical').length
  const highCount = DEMO_EVIDENCE.filter(e => e.significance_level === 'high').length

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Evidence Log</h1>
          <p className="text-sm text-[var(--text-muted)]">{DEMO_EVIDENCE.length} items documented</p>
        </div>
        <Link
          href="/demo/chat"
          className="btn-gold flex items-center gap-1.5 px-4 py-2 text-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add via Chat
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="vigil-card p-4 text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{DEMO_EVIDENCE.length}</div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">Total Items</div>
        </div>
        <div className="vigil-card p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{criticalCount + highCount}</div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">High Priority</div>
        </div>
        <div className="vigil-card p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{Object.keys(typeCounts).length}</div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">Categories</div>
        </div>
      </div>

      {/* Type breakdown */}
      <div className="vigil-card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-[var(--vigil-gold)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">Evidence by Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(typeCounts).map(([type, count]) => {
            const config = typeConfig[type]
            return (
              <span key={type} className={`text-xs px-2.5 py-1 rounded-full ${config.bg} ${config.color} font-medium`}>
                {config.label}: {count}
              </span>
            )
          })}
        </div>
      </div>

      {/* Pattern alert */}
      <div className="mb-6 p-4 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-400">Pattern Detected</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Vigil has identified a correlation between schedule changes (Tue/Thu late nights) and digital behavior changes (phone password, screen privacy). These began within the same week.
          </p>
        </div>
      </div>

      {/* Evidence items */}
      <div className="space-y-3">
        {DEMO_EVIDENCE.map(item => {
          const type = typeConfig[item.type]
          const sig = sigConfig[item.significance_level]
          return (
            <div key={item.id} className="vigil-card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${type.bg} ${type.color}`}>
                    {type.label}
                  </span>
                  <span className={`text-[10px] font-bold tracking-wider ${sig.color}`}>
                    {sig.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Calendar className="w-3 h-3" />
                  {item.date_observed}
                </div>
              </div>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed mb-2">
                {item.description}
              </p>
              {item.notes && (
                <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-3 border-l-2 border-[var(--border-default)]">
                  {item.notes}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/demo/chat"
          className="btn-ghost text-sm inline-flex items-center gap-1.5"
        >
          Continue investigation with Vigil
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
