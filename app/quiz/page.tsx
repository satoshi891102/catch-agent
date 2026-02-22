'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Eye, ArrowRight, ArrowLeft, CheckCircle, Share2 } from 'lucide-react'

const questions = [
  {
    id: 1,
    text: 'Has your partner recently changed their phone password or become more protective of their device?',
    category: 'digital',
    weight: 2,
  },
  {
    id: 2,
    text: 'Are there new, unexplained absences or schedule changes (working late, gym, meetings)?',
    category: 'schedule',
    weight: 2,
  },
  {
    id: 3,
    text: 'Have you noticed unfamiliar charges, cash withdrawals, or new financial accounts?',
    category: 'financial',
    weight: 3,
  },
  {
    id: 4,
    text: 'Does your partner leave the room to take calls, whisper, or delete messages?',
    category: 'communication',
    weight: 3,
  },
  {
    id: 5,
    text: 'Have they suddenly changed their appearance, started new hobbies, or become unusually defensive?',
    category: 'behavioral',
    weight: 2,
  },
  {
    id: 6,
    text: 'Has your partner accused YOU of being paranoid, jealous, or controlling when you ask questions?',
    category: 'behavioral',
    weight: 3,
  },
  {
    id: 7,
    text: 'On a gut level — do you feel something is wrong, even if you can\'t prove it?',
    category: 'gut',
    weight: 1,
  },
]

type Answer = 'yes' | 'no' | 'unsure'

const answerScores: Record<Answer, number> = {
  yes: 1,
  no: 0,
  unsure: 0.5,
}

function getResult(score: number): { level: string; color: string; bg: string; message: string; urgency: string } {
  if (score >= 14) return {
    level: 'HIGH CONCERN',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/25',
    message: 'Multiple strong indicators suggest something may be happening. This pattern is significant enough to warrant a thorough investigation.',
    urgency: 'We recommend starting a conversation with Vigil immediately.',
  }
  if (score >= 9) return {
    level: 'MODERATE CONCERN',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/25',
    message: 'Some concerning patterns are present. While no single indicator is conclusive, the combination deserves attention.',
    urgency: 'A deeper investigation could help clarify the situation.',
  }
  if (score >= 4) return {
    level: 'LOW CONCERN',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/25',
    message: 'The indicators you\'ve identified are relatively mild. They could have innocent explanations, but your instinct brought you here for a reason.',
    urgency: 'If you still feel uneasy, talking to Vigil can help you think through it clearly.',
  }
  return {
    level: 'MINIMAL INDICATORS',
    color: 'text-[var(--text-muted)]',
    bg: 'bg-[var(--bg-elevated)] border-[var(--border-subtle)]',
    message: 'Based on your answers, there aren\'t strong indicators of infidelity. That said, if something still feels off, trust your instincts.',
    urgency: 'Vigil is here if you need clarity — even if just to rule things out.',
  }
}

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Answer>>({})
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (answer: Answer) => {
    const newAnswers = { ...answers, [questions[currentQ].id]: answer }
    setAnswers(newAnswers)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setShowResult(true)
    }
  }

  const goBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1)
  }

  const totalScore = Object.entries(answers).reduce((score, [qId, answer]) => {
    const q = questions.find(q => q.id === Number(qId))
    return score + (q ? q.weight * answerScores[answer] : 0)
  }, 0)

  const result = getResult(totalScore)
  const yesCount = Object.values(answers).filter(a => a === 'yes').length
  const progress = ((currentQ + (showResult ? 1 : 0)) / questions.length) * 100

  if (showResult) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-16 flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/30 flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-[var(--vigil-gold)]" />
            </div>
            <h1 className="display-md text-[var(--text-primary)] mb-1">Your Quick Assessment</h1>
            <p className="text-sm text-[var(--text-muted)]">Based on {questions.length} key indicators</p>
          </div>

          {/* Result card */}
          <div className={`p-6 rounded-2xl border mb-6 text-center ${result.bg}`}>
            <div className={`label-xs mb-2 ${result.color}`}>
              Assessment Level
            </div>
            <div className={`text-2xl font-bold mb-3 ${result.color}`}>
              {result.level}
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {result.message}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="vigil-card p-3 text-center">
              <div className="text-xl font-bold text-[var(--text-primary)]">{yesCount}</div>
              <div className="text-[10px] text-[var(--text-muted)]">Indicators</div>
            </div>
            <div className="vigil-card p-3 text-center">
              <div className="text-xl font-bold text-[var(--text-primary)]">
                {new Set(Object.entries(answers).filter(([qId, a]) => a === 'yes').map(([qId]) => questions.find(q => q.id === Number(qId))?.category)).size}
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">Categories</div>
            </div>
            <div className="vigil-card p-3 text-center">
              <div className="text-xl font-bold text-amber-400">{Math.round(totalScore)}</div>
              <div className="text-[10px] text-[var(--text-muted)]">Score / {questions.reduce((s, q) => s + q.weight, 0)}</div>
            </div>
          </div>

          {/* Urgency + CTA */}
          <div className="vigil-card p-5 mb-6">
            <p className="text-sm text-[var(--vigil-gold)] font-medium mb-2">{result.urgency}</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              This quick assessment only scratches the surface. Vigil&apos;s full investigation goes deeper — tracking patterns across 5 modules, building a case file, and preparing you for whatever comes next.
            </p>
          </div>

          <Link
            href="/demo/chat"
            className="btn-gold flex items-center justify-center gap-2 py-4 text-base w-full mb-3"
          >
            Start Full Investigation — Free
            <ArrowRight className="w-5 h-5" />
          </Link>

          <button
            onClick={async () => {
              const text = `My quick assessment result: ${result.level}\n${yesCount} indicators identified.\n\nTake the assessment: https://catch-agent.vercel.app/quiz`
              if (navigator.share) {
                try { await navigator.share({ title: 'My Vigil Assessment', text, url: 'https://catch-agent.vercel.app/quiz' }) } catch {}
              } else {
                await navigator.clipboard.writeText(text)
              }
            }}
            className="btn-ghost flex items-center justify-center gap-2 py-3 text-sm w-full mb-3"
          >
            <Share2 className="w-4 h-4" /> Share Result
          </button>

          <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
            {['10 free messages', 'No credit card', '100% private'].map(item => (
              <span key={item} className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-[var(--vigil-gold)]/60" />
                {item}
              </span>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-16 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[var(--vigil-gold)]" />
            <span className="text-sm font-medium text-[var(--text-muted)] tracking-[0.1em]">VIGIL</span>
          </div>
          <span className="text-xs text-[var(--text-muted)]">{currentQ + 1} of {questions.length}</span>
        </div>

        {/* Progress */}
        <div className="h-1 bg-[var(--bg-elevated)] rounded-full mb-10 overflow-hidden">
          <div
            className="h-full bg-[var(--vigil-gold)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] leading-relaxed mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
                {q.text}
              </h2>

              {/* Answer buttons */}
              <div className="space-y-3">
                {(['yes', 'no', 'unsure'] as Answer[]).map(answer => (
                  <motion.button
                    key={answer}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(answer)}
                    className={`w-full py-4 rounded-xl text-[14px] font-medium transition-all ${
                      answers[q.id] === answer
                        ? 'bg-[var(--vigil-gold)]/12 border-2 border-[var(--vigil-gold)]/30 text-[var(--vigil-gold)]'
                        : 'bg-[var(--bg-elevated)] border-2 border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--vigil-gold)]/20 hover:bg-[var(--vigil-gold)]/[0.04]'
                    }`}
                  >
                    {answer === 'yes' ? 'Yes' : answer === 'no' ? 'No' : 'Not sure'}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[var(--border-subtle)]">
          <button
            onClick={goBack}
            disabled={currentQ === 0}
            className="flex items-center gap-1 text-sm text-[var(--text-muted)] disabled:opacity-30 hover:text-[var(--text-secondary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
            Exit quiz
          </Link>
        </div>
      </div>
    </div>
  )
}
