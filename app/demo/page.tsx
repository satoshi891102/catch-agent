'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MessageSquare, FileText, TrendingUp, ChevronRight,
  AlertCircle, CheckCircle, Clock, Shield, ArrowRight, Zap,
  Eye, Search, Brain, RotateCcw
} from 'lucide-react'
import {
  getDemoUser,
  getDemoCaseFile,
  getDemoEvidence,
  resetDemoData,
} from '@/lib/demo-store'
import type { CaseFile, EvidenceItem, User } from '@/lib/types'
import { FREE_MESSAGE_LIMIT, PHASE_LABELS } from '@/lib/types'

const suspicionColors: Record<string, string> = {
  unknown: 'text-[var(--text-muted)] bg-[var(--text-muted)]/10 border-[var(--text-muted)]/15',
  low: 'text-green-400 bg-green-400/8 border-green-400/15',
  moderate: 'text-amber-400 bg-amber-400/8 border-amber-400/15',
  high: 'text-orange-400 bg-orange-400/8 border-orange-400/15',
  confirmed: 'text-red-400 bg-red-400/8 border-red-400/15',
}

const evidenceTypeColors: Record<string, string> = {
  digital: 'text-blue-400 bg-blue-400/8',
  schedule: 'text-purple-400 bg-purple-400/8',
  financial: 'text-emerald-400 bg-emerald-400/8',
  communication: 'text-amber-400 bg-amber-400/8',
  behavioral: 'text-pink-400 bg-pink-400/8',
}

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 12 } as const,
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } } as const,
}

export default function DemoDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null)
  const [evidence, setEvidence] = useState<EvidenceItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setUser(getDemoUser())
    setCaseFile(getDemoCaseFile())
    setEvidence(getDemoEvidence())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      setUser(getDemoUser())
      setCaseFile(getDemoCaseFile())
      setEvidence(getDemoEvidence())
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--vigil-gold)]/8 border border-[var(--vigil-gold)]/15 flex items-center justify-center">
            <Eye className="w-5 h-5 text-[var(--vigil-gold)] animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const isPaid = user?.subscription_status === 'active'
  const messageCount = user?.message_count || 0
  const messagesRemaining = Math.max(0, FREE_MESSAGE_LIMIT - messageCount)
  const progressPct = caseFile?.investigation_progress || 0

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="max-w-2xl mx-auto px-5 pt-6 md:pt-8 pb-24"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Case Dashboard</h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            {caseFile ? `Phase ${caseFile.phase} — ${PHASE_LABELS[caseFile.phase]}` : 'Start your investigation'}
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset your entire investigation?')) {
              resetDemoData()
              window.location.reload()
            }
          }}
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-card)]"
          title="Reset investigation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={itemVariants} className="vigil-card p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-[var(--text-primary)]">Investigation Progress</span>
          <span className="text-[12px] text-[var(--text-muted)]">{progressPct}%</span>
        </div>
        <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-[var(--vigil-gold-dim)] via-[var(--vigil-gold)] to-[var(--vigil-gold-light)]"
          />
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <motion.div variants={itemVariants} className="vigil-card p-4 text-center">
          <p className="text-xl font-bold text-[var(--text-primary)]">{messageCount}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Messages</p>
        </motion.div>
        <motion.div variants={itemVariants} className="vigil-card p-4 text-center">
          <p className="text-xl font-bold text-[var(--text-primary)]">{evidence.length}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Evidence</p>
        </motion.div>
        <motion.div variants={itemVariants} className="vigil-card p-4 text-center">
          <div className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium ${suspicionColors[caseFile?.suspicion_level || 'unknown']}`}>
            {(caseFile?.suspicion_level || 'unknown').charAt(0).toUpperCase() + (caseFile?.suspicion_level || 'unknown').slice(1)}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Suspicion</p>
        </motion.div>
      </div>

      {/* Free tier notice */}
      {!isPaid && (
        <motion.div variants={itemVariants} className="vigil-card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[13px] text-[var(--text-secondary)]">
              {messagesRemaining > 0 ? `${messagesRemaining} free messages remaining` : 'Free messages used'}
            </span>
          </div>
          <Link href="/pricing" className="text-[12px] text-[var(--vigil-gold)] font-medium hover:text-[var(--vigil-gold-light)] transition-colors">
            Upgrade →
          </Link>
        </motion.div>
      )}

      {/* Investigation modules */}
      <motion.div variants={itemVariants}>
        <h2 className="text-[13px] font-medium text-[var(--text-muted)] mb-3 mt-6">Investigation Modules</h2>
      </motion.div>
      <div className="space-y-2">
        {[
          { icon: <Search className="w-4 h-4" />, name: 'Digital Behavior', desc: 'Phone, apps, social media patterns', phase: 1 },
          { icon: <Clock className="w-4 h-4" />, name: 'Schedule Analysis', desc: 'Time gaps, routine changes, alibis', phase: 2 },
          { icon: <TrendingUp className="w-4 h-4" />, name: 'Financial Red Flags', desc: 'Unexplained charges, hidden accounts', phase: 3 },
          { icon: <MessageSquare className="w-4 h-4" />, name: 'Communication Changes', desc: 'Messaging habits, secrecy, new contacts', phase: 3 },
          { icon: <Brain className="w-4 h-4" />, name: 'Behavioral Shifts', desc: 'Emotional changes, guilt signals, gaslighting', phase: 4 },
        ].map((mod, i) => {
          const currentPhase = caseFile?.phase || 1
          const isActive = currentPhase >= mod.phase
          const isComplete = currentPhase > mod.phase
          return (
            <motion.div key={i} variants={itemVariants}>
              <Link
                href="/demo/chat"
                className={`vigil-card flex items-center gap-4 p-4 group ${!isActive ? 'opacity-50' : ''}`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isComplete ? 'bg-emerald-400/8 text-emerald-400 border border-emerald-400/15' :
                  isActive ? 'bg-[var(--vigil-gold)]/8 text-[var(--vigil-gold)] border border-[var(--vigil-gold)]/15' :
                  'bg-[var(--bg-elevated)] text-[var(--text-dim)] border border-[var(--border-subtle)]'
                }`}>
                  {isComplete ? <CheckCircle className="w-4 h-4" /> : mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">{mod.name}</p>
                  <p className="text-[12px] text-[var(--text-muted)]">{mod.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--text-muted)] transition-colors shrink-0" />
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Recent evidence */}
      {evidence.length > 0 && (
        <>
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mt-8 mb-3">
              <h2 className="text-[13px] font-medium text-[var(--text-muted)]">Recent Evidence</h2>
              <Link href="/demo/evidence" className="text-[12px] text-[var(--vigil-gold)] font-medium hover:text-[var(--vigil-gold-light)] transition-colors">
                View all →
              </Link>
            </div>
          </motion.div>
          <div className="space-y-2">
            {evidence.slice(-3).reverse().map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="vigil-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${evidenceTypeColors[item.type] || 'text-[var(--text-muted)] bg-[var(--bg-elevated)]'}`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-[var(--text-dim)]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* CTA if no messages */}
      {messageCount === 0 && (
        <motion.div variants={itemVariants} className="mt-8">
          <Link
            href="/demo/chat"
            className="vigil-card flex items-center justify-center gap-3 p-6 group border-dashed hover:border-[var(--vigil-gold)]/30"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--vigil-gold)]/8 border border-[var(--vigil-gold)]/15 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[var(--vigil-gold)]" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[var(--text-primary)]">Start your investigation</p>
              <p className="text-[12px] text-[var(--text-muted)]">Tell Vigil what you&apos;ve noticed</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--vigil-gold)] transition-colors ml-auto" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}
