'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Shield, Eye, FileText, ArrowRight } from 'lucide-react'

const screens = [
  {
    icon: Shield,
    title: 'Everything stays between us',
    description: 'No real name needed. No data shared. Your conversations are encrypted and private — delete everything at any time.',
    accent: 'from-[var(--vigil-gold)]/10 to-[var(--vigil-gold)]/5',
    iconBg: 'bg-[var(--vigil-gold)]/8 border-[var(--vigil-gold)]/15',
  },
  {
    icon: Eye,
    title: 'Tell your story. We organize the evidence.',
    description: 'Vigil listens, asks the right questions, and builds a structured case file. Patterns emerge that you might miss alone.',
    accent: 'from-blue-500/10 to-blue-500/5',
    iconBg: 'bg-blue-500/8 border-blue-500/15',
  },
  {
    icon: FileText,
    title: 'Ready when you are',
    description: 'Whether you need clarity, confirmation, or preparation for a conversation — Vigil guides you through every step.',
    accent: 'from-emerald-500/10 to-emerald-500/5',
    iconBg: 'bg-emerald-500/8 border-emerald-500/15',
  },
]

export default function OnboardingPage() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const router = useRouter()
  const screen = screens[currentScreen]

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1)
    } else {
      localStorage.setItem('vigil-onboarded', 'true')
      router.push('/demo/chat')
    }
  }

  const handleSkip = () => {
    localStorage.setItem('vigil-onboarded', 'true')
    router.push('/demo/chat')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-[400px] h-[400px] rounded-full bg-gradient-to-br ${screen.accent} blur-[100px] opacity-50`} />
      </div>

      {/* Skip */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors z-10"
      >
        Skip
      </button>

      {/* Content */}
      <div className="relative z-10 max-w-sm w-full text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col items-center"
          >
            {/* Icon */}
            <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center mb-8 ${screen.iconBg}`}>
              <screen.icon className="w-9 h-9 text-[var(--text-primary)]" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h1 className="display-md text-[var(--text-primary)] mb-4 px-4" style={{ fontFamily: 'var(--font-display)' }}>
              {screen.title}
            </h1>

            {/* Description */}
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-[300px]">
              {screen.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
          {screens.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === currentScreen ? 24 : 6,
                backgroundColor: i === currentScreen ? 'var(--vigil-gold)' : 'var(--text-dim)',
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className="btn-gold-pill inline-flex items-center gap-2.5 px-8 py-3.5 text-[15px] w-full justify-center"
        >
          {currentScreen < screens.length - 1 ? 'Continue' : 'Start your investigation'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
