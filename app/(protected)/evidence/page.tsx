'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, FileText, Calendar, Tag, ChevronDown, Trash2, AlertCircle,
  Smartphone, Clock, CreditCard, MessageCircle, Heart, Filter, Search
} from 'lucide-react'
import type { EvidenceItem, EvidenceType, SignificanceLevel, InvestigationModule } from '@/lib/types'
import { EVIDENCE_TYPE_LABELS } from '@/lib/types'

const TYPE_ICONS: Record<EvidenceType, React.ReactNode> = {
  digital: <Smartphone className="w-4 h-4" />,
  schedule: <Clock className="w-4 h-4" />,
  financial: <CreditCard className="w-4 h-4" />,
  communication: <MessageCircle className="w-4 h-4" />,
  behavioral: <Heart className="w-4 h-4" />,
}

const TYPE_COLORS: Record<EvidenceType, string> = {
  digital: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  schedule: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  financial: 'text-green-400 bg-green-400/10 border-green-400/20',
  communication: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  behavioral: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
}

const SIGNIFICANCE_COLORS: Record<SignificanceLevel, string> = {
  low: 'text-[#6e6050] bg-[#6e6050]/10',
  medium: 'text-amber-400 bg-amber-400/10',
  high: 'text-orange-400 bg-orange-400/10',
  critical: 'text-red-400 bg-red-400/10',
}

interface AddEvidenceFormProps {
  onAdd: (item: Partial<EvidenceItem>) => Promise<void>
  onClose: () => void
}

function AddEvidenceForm({ onAdd, onClose }: AddEvidenceFormProps) {
  const [type, setType] = useState<EvidenceType>('digital')
  const [description, setDescription] = useState('')
  const [dateObserved, setDateObserved] = useState(new Date().toISOString().split('T')[0])
  const [significance, setSignificance] = useState<SignificanceLevel>('medium')
  const [module, setModule] = useState<InvestigationModule | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return
    setError('')
    setLoading(true)
    try {
      await onAdd({
        type,
        description: description.trim(),
        date_observed: dateObserved,
        significance_level: significance,
        module_source: module || undefined,
      })
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add evidence')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-md bg-[#1e1c18] border border-[#2e2b25] rounded-2xl p-5"
      >
        <h3 className="font-semibold text-[#f0ebe0] mb-4">Log Evidence</h3>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-xs text-[#b8a98a] mb-2 font-medium">Evidence Type</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(Object.keys(EVIDENCE_TYPE_LABELS) as EvidenceType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                    type === t
                      ? `${TYPE_COLORS[t]} border-current`
                      : 'bg-[#0f0e0c] border-[#2e2b25] text-[#6e6050] hover:text-[#b8a98a]'
                  }`}
                >
                  {TYPE_ICONS[t]}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-[#b8a98a] mb-1.5 font-medium">
              What did you observe?
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what you noticed in detail..."
              rows={3}
              required
              className="w-full bg-[#0f0e0c] border border-[#2e2b25] rounded-xl px-4 py-3 text-sm text-[#f0ebe0] placeholder:text-[#6e6050] focus:outline-none focus:border-[#c9a84c]/50 resize-none"
            />
          </div>

          {/* Date and Significance row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#b8a98a] mb-1.5 font-medium">Date Observed</label>
              <input
                type="date"
                value={dateObserved}
                onChange={e => setDateObserved(e.target.value)}
                className="w-full bg-[#0f0e0c] border border-[#2e2b25] rounded-xl px-3 py-2.5 text-sm text-[#f0ebe0] focus:outline-none focus:border-[#c9a84c]/50"
              />
            </div>
            <div>
              <label className="block text-xs text-[#b8a98a] mb-1.5 font-medium">Significance</label>
              <select
                value={significance}
                onChange={e => setSignificance(e.target.value as SignificanceLevel)}
                className="w-full bg-[#0f0e0c] border border-[#2e2b25] rounded-xl px-3 py-2.5 text-sm text-[#f0ebe0] focus:outline-none focus:border-[#c9a84c]/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Module */}
          <div>
            <label className="block text-xs text-[#b8a98a] mb-1.5 font-medium">
              Investigation Module <span className="text-[#6e6050]">(optional)</span>
            </label>
            <select
              value={module}
              onChange={e => setModule(e.target.value as InvestigationModule | '')}
              className="w-full bg-[#0f0e0c] border border-[#2e2b25] rounded-xl px-3 py-2.5 text-sm text-[#f0ebe0] focus:outline-none focus:border-[#c9a84c]/50"
            >
              <option value="">None selected</option>
              <option value="A">Module A — Digital Behavior</option>
              <option value="B">Module B — Schedule & Routine</option>
              <option value="C">Module C — Financial</option>
              <option value="D">Module D — Communication</option>
              <option value="E">Module E — Emotional & Physical</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#2e2b25] text-sm text-[#b8a98a] hover:text-[#f0ebe0] hover:bg-[#272420] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="flex-1 py-2.5 rounded-xl bg-[#c9a84c] text-[#0f0e0c] text-sm font-semibold hover:bg-[#e0c070] transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Log Evidence'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<EvidenceType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchEvidence = async () => {
    try {
      const res = await fetch('/api/evidence')
      if (res.ok) {
        const data = await res.json()
        setEvidence(data.evidence || [])
      }
    } catch {
      setError('Failed to load evidence')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvidence()
  }, [])

  const handleAdd = async (item: Partial<EvidenceItem>) => {
    const res = await fetch('/api/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to add evidence')
    }
    const data = await res.json()
    setEvidence(prev => [data.evidence, ...prev])
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    try {
      const res = await fetch(`/api/evidence/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEvidence(prev => prev.filter(e => e.id !== id))
      }
    } catch {
      // Handle silently
    } finally {
      setDeleteId(null)
    }
  }

  const filtered = evidence.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter
    const matchesSearch = !search || item.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Group by date
  const grouped = filtered.reduce((acc, item) => {
    const date = item.date_observed
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {} as Record<string, EvidenceItem[]>)

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const countByType = evidence.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="md:pl-56 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 pt-16 md:pt-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#f0ebe0]">Evidence Log</h1>
            <p className="text-sm text-[#6e6050]">{evidence.length} items recorded</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-[#c9a84c] text-[#0f0e0c] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#e0c070] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Evidence
          </button>
        </div>

        {/* Stats by type */}
        {evidence.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mb-5">
            {(Object.keys(EVIDENCE_TYPE_LABELS) as EvidenceType[]).map(type => (
              <button
                key={type}
                onClick={() => setFilter(filter === type ? 'all' : type)}
                className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                  filter === type
                    ? `${TYPE_COLORS[type]} border-current`
                    : 'bg-[#1e1c18] border-[#2e2b25] text-[#6e6050] hover:text-[#b8a98a]'
                }`}
              >
                <div className="mb-1">{TYPE_ICONS[type]}</div>
                <span className="text-lg font-bold text-[#f0ebe0]">{countByType[type] || 0}</span>
                <span className="text-[9px] leading-tight">{type}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        {evidence.length > 3 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e6050]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search evidence..."
              className="w-full bg-[#1e1c18] border border-[#2e2b25] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#f0ebe0] placeholder:text-[#6e6050] focus:outline-none focus:border-[#c9a84c]/50"
            />
          </div>
        )}

        {/* Evidence list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
          </div>
        ) : evidence.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7 text-[#c9a84c]" />
            </div>
            <h3 className="font-semibold text-[#f0ebe0] mb-2">No evidence logged yet</h3>
            <p className="text-sm text-[#b8a98a] max-w-xs mx-auto mb-5">
              As you investigate, log every detail here. Patterns emerge from the details.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f0e0c] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#e0c070] transition-all"
            >
              <Plus className="w-4 h-4" />
              Log first evidence
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-[#6e6050]">
            <p className="text-sm">No evidence matches your filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-[#6e6050]" />
                  <span className="text-xs text-[#6e6050] font-medium">
                    {new Date(date + 'T12:00:00').toLocaleDateString(undefined, {
                      weekday: 'long', month: 'long', day: 'numeric'
                    })}
                  </span>
                  <div className="flex-1 h-px bg-[#2e2b25]" />
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {grouped[date].map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group flex items-start gap-3 p-4 bg-[#1e1c18] border border-[#2e2b25] rounded-xl hover:border-[#2e2b25]/80 transition-all"
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 ${TYPE_COLORS[item.type]}`}>
                          {TYPE_ICONS[item.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#f0ebe0] leading-relaxed">{item.description}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${SIGNIFICANCE_COLORS[item.significance_level]}`}>
                              {item.significance_level}
                            </span>
                            {item.module_source && (
                              <span className="text-[10px] text-[#6e6050] px-2 py-0.5 bg-[#272420] rounded-full">
                                Module {item.module_source}
                              </span>
                            )}
                            <span className="text-[10px] text-[#6e6050]">
                              {EVIDENCE_TYPE_LABELS[item.type]}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteId === item.id}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-[#6e6050] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pattern hint */}
        {evidence.length >= 5 && (
          <div className="mt-6 p-4 bg-[#c9a84c]/5 border border-[#c9a84c]/15 rounded-xl">
            <p className="text-xs text-[#b8a98a]">
              <span className="text-[#c9a84c] font-medium">Pattern analysis tip:</span>{' '}
              Share your evidence log with Vigil in the chat for a full pattern analysis across your {evidence.length} logged items.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <AddEvidenceForm onAdd={handleAdd} onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
