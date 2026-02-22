'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Eye, Shield, Share2, Download, ArrowRight, AlertTriangle, CheckCircle, Lock } from 'lucide-react'
import {
  getDemoCaseFile,
  getDemoEvidence,
  getDemoUser,
} from '@/lib/demo-store'
import type { CaseFile, EvidenceItem } from '@/lib/types'
import { PHASE_LABELS } from '@/lib/types'

const suspicionConfig: Record<string, { label: string; color: string; bg: string; message: string }> = {
  unknown: {
    label: 'INSUFFICIENT DATA',
    color: 'text-[var(--text-muted)]',
    bg: 'bg-[var(--text-muted)]/10 border-[var(--text-muted)]/20',
    message: 'More information is needed to make an assessment.',
  },
  low: {
    label: 'LOW CONCERN',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/25',
    message: 'Current evidence does not strongly suggest infidelity. However, trust your instincts — if something still feels off, continue investigating.',
  },
  moderate: {
    label: 'MODERATE CONCERN',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/25',
    message: 'Multiple indicators suggest something may be happening. This warrants continued investigation across additional modules.',
  },
  high: {
    label: 'HIGH CONCERN',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/25',
    message: 'Strong pattern of evidence across multiple categories. Consider moving to confrontation preparation phase.',
  },
  confirmed: {
    label: 'CONFIRMED PATTERN',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/25',
    message: 'Evidence strongly indicates deception. Vigil recommends reviewing the Confrontation Toolkit before taking action.',
  },
}

const typeLabels: Record<string, string> = {
  digital: 'Digital Behavior',
  schedule: 'Schedule & Routine',
  financial: 'Financial',
  communication: 'Communication',
  behavioral: 'Emotional & Behavioral',
}

export default function ReportPage() {
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null)
  const [evidence, setEvidence] = useState<EvidenceItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCaseFile(getDemoCaseFile())
    setEvidence(getDemoEvidence())
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--vigil-gold)]/30 border-t-[var(--vigil-gold)] rounded-full animate-spin" />
      </div>
    )
  }

  if (!caseFile || evidence.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-12 pb-24 text-center">
        <Shield className="w-12 h-12 text-[var(--vigil-gold)]/30 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">No report available yet</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Start an investigation with Vigil and gather evidence to generate your assessment report.
        </p>
        <Link href="/demo/chat" className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm">
          Start investigation <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  const config = suspicionConfig[caseFile.suspicion_level] || suspicionConfig.unknown
  const user = getDemoUser()
  const typeCounts = evidence.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const criticalCount = evidence.filter(e => e.significance_level === 'critical').length
  const highCount = evidence.filter(e => e.significance_level === 'high').length
  const isPaid = user.subscription_status === 'active'

  const handleShare = async () => {
    const shareText = `Vigil Investigation Report\n\nSuspicion Level: ${config.label}\nEvidence Items: ${evidence.length}\nCategories: ${Object.keys(typeCounts).length}\nPhase: ${caseFile.phase} — ${PHASE_LABELS[caseFile.phase]}\n\nGet your own assessment: https://catch-agent.vercel.app`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Vigil Investigation Report', text: shareText })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 md:pt-8 pb-24">
      <div ref={reportRef}>
        {/* Report header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/30 flex items-center justify-center">
              <Eye className="w-5 h-5 text-[var(--vigil-gold)]" />
            </div>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] tracking-[0.25em] uppercase font-mono mb-2">
            Investigation Report
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            Vigil Assessment
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Suspicion level — the main visual */}
        <div className={`p-6 rounded-2xl border mb-6 text-center ${config.bg}`}>
          <div className={`text-xs tracking-[0.2em] uppercase font-mono mb-2 ${config.color}`}>
            Suspicion Level
          </div>
          <div className={`text-3xl font-bold mb-3 ${config.color}`}>
            {config.label}
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
            {config.message}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="vigil-card p-3 text-center">
            <div className="text-xl font-bold text-[var(--text-primary)]">{evidence.length}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Evidence</div>
          </div>
          <div className="vigil-card p-3 text-center">
            <div className="text-xl font-bold text-[var(--text-primary)]">{Object.keys(typeCounts).length}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Categories</div>
          </div>
          <div className="vigil-card p-3 text-center">
            <div className="text-xl font-bold text-red-400">{criticalCount + highCount}</div>
            <div className="text-[10px] text-[var(--text-muted)]">High Priority</div>
          </div>
          <div className="vigil-card p-3 text-center">
            <div className="text-xl font-bold text-[var(--vigil-gold)]">{caseFile.phase}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Phase</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="vigil-card p-4 mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[var(--text-secondary)]">Investigation Progress</span>
            <span className="text-[var(--vigil-gold)] font-medium">{caseFile.investigation_progress}%</span>
          </div>
          <div className="h-2.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#9a7a32] to-[var(--vigil-gold)] rounded-full transition-all duration-700"
              style={{ width: `${caseFile.investigation_progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mt-2">
            <span>Phase {caseFile.phase}: {PHASE_LABELS[caseFile.phase]}</span>
            <span>{user.message_count} messages exchanged</span>
          </div>
        </div>

        {/* Evidence breakdown */}
        <div className="vigil-card p-4 mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Evidence by Category</h3>
          <div className="space-y-2">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">{typeLabels[type] || type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--vigil-gold)] rounded-full"
                      style={{ width: `${(count / evidence.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--text-muted)] w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key findings (redacted for free tier) */}
        <div className="vigil-card p-4 mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Key Findings</h3>
          {isPaid ? (
            <div className="space-y-2">
              {evidence.filter(e => e.significance_level === 'critical' || e.significance_level === 'high').slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                    item.significance_level === 'critical' ? 'text-red-400' : 'text-orange-400'
                  }`} />
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Lock className="w-6 h-6 text-[var(--text-muted)]/40 mx-auto mb-2" />
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Detailed findings are available with a paid plan
              </p>
              <Link href="/pricing" className="text-xs text-[var(--vigil-gold)] hover:text-[var(--vigil-gold-light)] font-medium">
                Upgrade to unlock →
              </Link>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="vigil-card p-4 mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Recommended Next Steps</h3>
          <div className="space-y-2">
            {caseFile.phase <= 2 && (
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--vigil-gold)]" />
                <p className="text-sm text-[var(--text-secondary)]">Continue gathering evidence across all 5 modules to build a complete picture.</p>
              </div>
            )}
            {Object.keys(typeCounts).length < 3 && (
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--vigil-gold)]" />
                <p className="text-sm text-[var(--text-secondary)]">Investigate additional categories. You&apos;ve covered {Object.keys(typeCounts).length} of 5 areas — broader evidence strengthens your case.</p>
              </div>
            )}
            {caseFile.suspicion_level === 'high' || caseFile.suspicion_level === 'confirmed' ? (
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--vigil-gold)]" />
                <p className="text-sm text-[var(--text-secondary)]">Review the Confrontation Toolkit before taking action. Preparation prevents being blindsided.</p>
              </div>
            ) : null}
            <div className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--vigil-gold)]" />
              <p className="text-sm text-[var(--text-secondary)]">Consider consulting a family law attorney if you believe this may lead to separation.</p>
            </div>
          </div>
        </div>

        {/* Vigil watermark */}
        <div className="text-center py-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Eye className="w-3.5 h-3.5 text-[var(--vigil-gold)]" />
            <span className="text-xs font-medium text-[var(--text-muted)] tracking-[0.15em]">VIGIL</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">
            AI-powered relationship investigation · vigilai.co
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleShare}
          className="flex-1 btn-gold flex items-center justify-center gap-2 py-3 text-sm"
        >
          <Share2 className="w-4 h-4" />
          {copied ? 'Copied!' : 'Share Report'}
        </button>
        <Link
          href="/demo/chat"
          className="flex-1 btn-ghost flex items-center justify-center gap-2 py-3 text-sm"
        >
          Continue Investigation
        </Link>
      </div>

      <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">
        This report is AI-generated and should not be used as legal evidence.
        Always consult a professional for legal or medical advice.
      </p>
    </div>
  )
}
