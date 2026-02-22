'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText, Plus, ChevronRight, AlertTriangle, Calendar,
  BarChart3, Trash2, Eye
} from 'lucide-react'
import {
  getDemoEvidence,
  getDemoCaseFile,
  deleteDemoEvidence,
  addDemoEvidence,
  updateCaseFromState,
} from '@/lib/demo-store'
import type { EvidenceItem, EvidenceType, SignificanceLevel } from '@/lib/types'

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
  const [evidence, setEvidence] = useState<EvidenceItem[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newType, setNewType] = useState<EvidenceType>('digital')
  const [newDesc, setNewDesc] = useState('')
  const [newSig, setNewSig] = useState<SignificanceLevel>('medium')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setEvidence(getDemoEvidence())
    setIsLoaded(true)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Remove this evidence item?')) {
      deleteDemoEvidence(id)
      setEvidence(getDemoEvidence())
      updateCaseFromState()
    }
  }

  const handleAdd = () => {
    if (!newDesc.trim()) return
    addDemoEvidence({
      type: newType,
      description: newDesc.trim(),
      significance_level: newSig,
    })
    setEvidence(getDemoEvidence())
    updateCaseFromState()
    setNewDesc('')
    setShowAddForm(false)
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--vigil-gold)]/30 border-t-[var(--vigil-gold)] rounded-full animate-spin" />
      </div>
    )
  }

  const typeCounts = evidence.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const criticalCount = evidence.filter(e => e.significance_level === 'critical').length
  const highCount = evidence.filter(e => e.significance_level === 'high').length

  // Detect patterns
  const patterns: string[] = []
  const types = new Set(evidence.map(e => e.type))
  if (types.size >= 3) {
    patterns.push(`Evidence spans ${types.size} categories — this cross-correlation strengthens the pattern.`)
  }
  if (criticalCount >= 1 && highCount >= 2) {
    patterns.push('Multiple high-priority items detected alongside critical evidence.')
  }
  if (typeCounts['schedule'] && typeCounts['digital']) {
    patterns.push('Schedule changes correlate with digital behavior changes — a common combination.')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Evidence Log</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {evidence.length} item{evidence.length !== 1 ? 's' : ''} documented
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-gold flex items-center gap-1.5 px-4 py-2 text-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Evidence
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="mb-4 p-4 vigil-card space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Add New Evidence</h3>

          <div className="flex gap-2">
            <select
              value={newType}
              onChange={e => setNewType(e.target.value as EvidenceType)}
              className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--vigil-gold)]/40"
            >
              {Object.entries(typeConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <select
              value={newSig}
              onChange={e => setNewSig(e.target.value as SignificanceLevel)}
              className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--vigil-gold)]/40"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <textarea
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            placeholder="Describe what you observed..."
            rows={3}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--vigil-gold)]/40 resize-none"
          />

          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!newDesc.trim()} className="btn-gold text-sm px-4 py-2 disabled:opacity-30">
              Add to case file
            </button>
            <button onClick={() => setShowAddForm(false)} className="text-sm text-[var(--text-muted)] px-4 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {evidence.length === 0 ? (
        <div className="vigil-card p-8 text-center border-dashed">
          <FileText className="w-8 h-8 text-[var(--vigil-gold)]/40 mx-auto mb-3" />
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">No evidence yet</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Evidence is automatically detected during your chat with Vigil, or you can add it manually.
          </p>
          <Link href="/demo/chat" className="btn-gold inline-flex items-center gap-2 px-5 py-2 text-sm">
            Start chatting <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="vigil-card p-4 text-center">
              <div className="text-2xl font-bold text-[var(--text-primary)]">{evidence.length}</div>
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
          <div className="vigil-card p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-[var(--vigil-gold)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">Evidence by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeCounts).map(([type, count]) => {
                const config = typeConfig[type]
                if (!config) return null
                return (
                  <span key={type} className={`text-xs px-2.5 py-1 rounded-full ${config.bg} ${config.color} font-medium`}>
                    {config.label}: {count}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Pattern alerts */}
          {patterns.length > 0 && (
            <div className="mb-4 space-y-2">
              {patterns.map((pattern, i) => (
                <div key={i} className="p-3.5 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-400">Pattern Detected</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{pattern}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Evidence items */}
          <div className="space-y-3">
            {evidence.map(item => {
              const type = typeConfig[item.type] || { color: 'text-gray-400', bg: 'bg-gray-400/10', label: item.type }
              const sig = sigConfig[item.significance_level] || { color: 'text-gray-400', label: item.significance_level }
              return (
                <div key={item.id} className="vigil-card p-4 group relative">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${type.bg} ${type.color}`}>
                        {type.label}
                      </span>
                      <span className={`text-[10px] font-bold tracking-wider ${sig.color}`}>
                        {sig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Calendar className="w-3 h-3" />
                        {item.date_observed}
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition-all p-1"
                        title="Delete evidence"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 text-center">
            <Link href="/demo/chat" className="btn-ghost text-sm inline-flex items-center gap-1.5">
              Continue investigation with Vigil
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
