'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Shield, FileText, AlertTriangle, CheckCircle, ChevronRight,
  MessageSquare, Scale, Heart, Lock, ArrowRight, Phone,
  MapPin, Clock, Users
} from 'lucide-react'
import { getDemoCaseFile, getDemoEvidence, getDemoUser } from '@/lib/demo-store'
import type { CaseFile } from '@/lib/types'

export default function ConfrontationToolkit() {
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null)
  const [evidenceCount, setEvidenceCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setCaseFile(getDemoCaseFile())
    setEvidenceCount(getDemoEvidence().length)
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--vigil-gold)]/30 border-t-[var(--vigil-gold)] rounded-full animate-spin" />
      </div>
    )
  }

  const isReady = caseFile && caseFile.phase >= 3 && evidenceCount >= 3
  const isPaid = getDemoUser().subscription_status === 'active'

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-8 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Confrontation Toolkit</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {isReady ? 'Your preparation resources' : 'Available when investigation progresses'}
          </p>
        </div>
      </div>

      {!isReady ? (
        <div className="vigil-card p-6 text-center border-dashed">
          <Shield className="w-10 h-10 text-[var(--vigil-gold)]/30 mx-auto mb-4" />
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Not ready yet</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-sm mx-auto">
            The confrontation toolkit unlocks when you&apos;ve gathered enough evidence (Phase 3+). 
            Continue your investigation with Vigil to build your case.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-muted)] mb-6">
            <span className={evidenceCount >= 3 ? 'text-green-400' : ''}>
              {evidenceCount >= 3 ? <CheckCircle className="w-3.5 h-3.5 inline mr-1" /> : null}
              {evidenceCount}/3 evidence items
            </span>
            <span className={caseFile && caseFile.phase >= 3 ? 'text-green-400' : ''}>
              Phase {caseFile?.phase || 1}/3 required
            </span>
          </div>
          <Link href="/demo/chat" className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            Continue investigation <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Readiness assessment */}
          <div className="vigil-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Investigation ready for next steps</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              You have {evidenceCount} evidence items across multiple categories. 
              Vigil has analyzed the patterns and can help you prepare for a conversation.
            </p>
          </div>

          {/* Toolkit sections */}
          {([
            {
              icon: <MessageSquare className="w-5 h-5" />,
              title: 'What to Say',
              desc: 'Scripted conversation starters, how to present evidence, what NOT to say',
              locked: !isPaid,
            },
            {
              icon: <AlertTriangle className="w-5 h-5" />,
              title: 'Handling Denial',
              desc: 'How to respond when they deny, deflect, gaslight, or turn it around on you',
              locked: !isPaid,
            },
            {
              icon: <Scale className="w-5 h-5" />,
              title: 'Legal Preparation',
              desc: 'Recording laws, evidence preservation, attorney consultation checklist',
              locked: !isPaid,
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: 'Safety Planning',
              desc: 'Physical safety, financial protection, support network, exit plan if needed',
              locked: !isPaid,
            },
            {
              icon: <MapPin className="w-5 h-5" />,
              title: 'Timing & Location',
              desc: 'When and where to have the conversation for best outcome',
              locked: !isPaid,
            },
            {
              icon: <Heart className="w-5 h-5" />,
              title: 'Emotional Preparation',
              desc: 'Managing your emotions during and after, regardless of the outcome',
              locked: false,
              href: '/demo/toolkit/emotional',
            },
            {
              icon: <Users className="w-5 h-5" />,
              title: 'Involving Others',
              desc: 'When to bring in family, friends, therapists, or legal counsel',
              locked: !isPaid,
            },
            {
              icon: <Phone className="w-5 h-5" />,
              title: 'Crisis Resources',
              desc: 'Hotlines, support groups, and professional help if you need it',
              locked: false,
              href: '/demo/toolkit/crisis',
            },
          ] as Array<{ icon: React.ReactNode; title: string; desc: string; locked: boolean; href?: string }>).map((section, i) => (
            <div key={i} className={`vigil-card p-4 flex items-center gap-4 ${section.locked ? 'opacity-60' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                section.locked
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                  : 'bg-[var(--vigil-gold)]/10 text-[var(--vigil-gold)]'
              }`}>
                {section.locked ? <Lock className="w-4 h-4" /> : section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">{section.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{section.desc}</p>
              </div>
              {section.locked ? (
                <Link href="/pricing" className="text-xs text-[var(--vigil-gold)] font-medium shrink-0">
                  Unlock
                </Link>
              ) : (
                <Link href={section.href || '/demo/chat'} className="text-xs text-[var(--vigil-gold)] font-medium shrink-0 flex items-center gap-0.5">
                  Open <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}

          {/* Upgrade prompt if not paid */}
          {!isPaid && (
            <div className="p-5 bg-[var(--vigil-gold)]/[0.04] border border-[var(--vigil-gold)]/20 rounded-2xl text-center">
              <h3 className="text-sm font-semibold text-[var(--vigil-gold)] mb-2">
                Unlock the full confrontation toolkit
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Get complete scripts, legal guides, safety planning, and more — starting at $29.99/month or $49.99 one-time.
              </p>
              <Link href="/pricing" className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 text-sm">
                View plans <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
