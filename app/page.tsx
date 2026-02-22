'use client'

import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  Shield,
  Lock,
  Clock,
  FileText,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  Eye,
  Search,
  Brain,
  X,
} from 'lucide-react'

/* ═══ Shared Components ═══ */

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ═══ Phone Mockup ═══ */

const chatMessages = [
  { role: 'vigil' as const, text: "I'm here. Tell me everything — what first made you suspicious?" },
  { role: 'user' as const, text: "He changed his phone password 3 weeks ago. Started working \"late\" every Tuesday and Thursday." },
  { role: 'vigil' as const, text: "That's a specific pattern — same nights each week. The password change alongside schedule shifts is notable. Has anything else changed in that window?" },
  { role: 'user' as const, text: "He's been distant. And he started going to the gym again after not going for a year." },
  { role: 'vigil' as const, text: "Four concurrent changes in a 3-week window. I want to be honest: individually, each has an innocent explanation. Together, they form a pattern worth investigating. Let's start with the schedule." },
]

function PhoneMockup() {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return
    let i = 0
    const interval = setInterval(() => {
      i++
      if (i > chatMessages.length) {
        clearInterval(interval)
        return
      }
      setVisibleMessages(i)
    }, 900)
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <div ref={ref} className="phone-frame mx-auto">
      <div className="phone-screen">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[10px] text-[var(--text-muted)]">
          <span>2:47 AM</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </span>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[var(--border-subtle)]">
          <div className="w-7 h-7 rounded-full bg-[var(--vigil-red)]/10 border border-[var(--vigil-red)]/20 flex items-center justify-center">
            <Eye className="w-3 h-3 text-[var(--vigil-red)]" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[var(--text-primary)]">Vigil</div>
            <div className="text-[9px] text-emerald-400 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse-dot" />
              Active now
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {chatMessages.slice(0, visibleMessages).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 text-[10px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--vigil-red)]/10 border border-[var(--vigil-red)]/15 rounded-xl rounded-br-sm text-[var(--text-primary)]'
                    : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl rounded-bl-sm text-[var(--text-secondary)]'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {visibleMessages < chatMessages.length && visibleMessages > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 flex items-center gap-1">
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-3 py-2.5 border-t border-[var(--border-subtle)] flex items-center gap-2 bg-[var(--bg-elevated)]">
          <div className="flex-1 bg-[var(--bg-primary)] rounded-lg px-3 py-2 text-[9px] text-[var(--text-muted)] border border-[var(--border-subtle)]">
            Tell Vigil what you&apos;ve noticed...
          </div>
          <div className="w-6 h-6 rounded-md bg-[var(--vigil-red)] flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══ Live Ticker ═══ */

function LiveTicker() {
  const stats = [
    '2,847 investigations this week',
    '94% found their answer',
    'Available in 12 countries',
    '47,291 people found the truth',
    'Average resolution: 8 days',
    '2,847 investigations this week',
    '94% found their answer',
    'Available in 12 countries',
    '47,291 people found the truth',
    'Average resolution: 8 days',
  ]

  return (
    <div className="overflow-hidden py-4 border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
      <div className="animate-ticker flex whitespace-nowrap">
        {stats.map((stat, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vigil-red)] animate-pulse-dot" />
            <span className="text-[12px] text-[var(--text-muted)] tracking-wide uppercase font-medium">{stat}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══ Comparison Takedown ═══ */

function ComparisonCard({ label, stamp, stampColor, delay }: { label: string; stamp: string; stampColor: string; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <FadeIn delay={delay}>
      <div ref={ref} className="relative vigil-card p-6 sm:p-8 text-center overflow-hidden">
        <p className="text-lg sm:text-xl font-medium text-[var(--text-primary)] mb-2">{label}</p>
        {isInView && (
          <motion.div
            initial={{ scale: 2.5, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: -12, opacity: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 ${stampColor} px-5 py-2 text-xl sm:text-2xl font-black tracking-wider uppercase pointer-events-none`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {stamp}
          </motion.div>
        )}
      </div>
    </FadeIn>
  )
}

/* ═══ Main Page ═══ */

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 60])

  return (
    <div className="min-h-screen grain-overlay">
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--vigil-red)]/10 border border-[var(--vigil-red)]/20 flex items-center justify-center">
            <Eye className="w-3.5 h-3.5 text-[var(--vigil-red)]" />
          </div>
          <span className="label-sm text-[var(--text-primary)] tracking-[0.15em]">VIGIL</span>
        </Link>
        <div className="hidden sm:flex items-center gap-8">
          <Link href="#how-it-works" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">How it works</Link>
          <Link href="/pricing" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:block">Sign in</Link>
          <Link href="/demo/chat" className="btn-red text-[13px] px-5 py-2">
            Start investigating
          </Link>
        </div>
      </nav>

      {/* ═══ HERO — Cinematic ═══ */}
      <section ref={heroRef} className="hero-noir min-h-screen flex flex-col items-center justify-center px-6 pt-14 text-center relative">
        {/* Animated background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[var(--vigil-red)]/[0.04] rounded-full blur-[150px] animate-drift" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--vigil-red)]/[0.03] rounded-full blur-[130px] animate-drift" style={{ animationDelay: '-7s' }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-4xl mx-auto relative">
          {/* Recording indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--vigil-red)] animate-pulse-red" />
            <span className="label-xs text-[var(--vigil-red)] tracking-[0.2em]">CONFIDENTIAL</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
            className="display-hero text-[var(--text-primary)] mb-8"
          >
            They&apos;re lying<br />
            <span className="text-red-gradient">to you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-12 max-w-lg mx-auto"
          >
            The signs are there. You already know. Vigil is the AI investigator that helps you prove it — methodically, legally, and in complete secrecy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <Link href="/demo/chat" className="btn-red-pill inline-flex items-center gap-3 px-10 py-4 text-base">
              Start investigating
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
      </section>

      {/* ═══ LIVE TICKER ═══ */}
      <LiveTicker />

      {/* ═══ EMOTIONAL STATEMENT ═══ */}
      <section className="section-dark px-6 py-28 sm:py-36 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--vigil-red)]/[0.04] rounded-full blur-[120px]" />
        </div>
        <FadeIn className="max-w-3xl mx-auto text-center relative">
          <p className="display-statement text-[var(--text-primary)] leading-snug">
            &ldquo;You&apos;re not crazy.<br />
            You&apos;re not paranoid.<br />
            <span className="text-red-gradient">You&apos;re paying attention.</span>&rdquo;
          </p>
        </FadeIn>
      </section>

      {/* ═══ PHONE MOCKUP — The Product ═══ */}
      <section className="section-dark px-6 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="label-sm text-[var(--vigil-red)] tracking-[0.15em] mb-4">THE INVESTIGATION</p>
            <h2 className="display-lg text-[var(--text-primary)] mb-4">
              This is how Vigil works.
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-md mx-auto">
              An AI investigator that listens, analyzes patterns, and builds your case — available at 2am when you need it most.
            </p>
          </FadeIn>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <FadeIn className="shrink-0">
              <PhoneMockup />
            </FadeIn>

            <FadeIn delay={0.2} className="flex-1 space-y-8">
              <div>
                <p className="text-[var(--vigil-amber)] label-xs tracking-[0.15em] mb-2">REAL-TIME ANALYSIS</p>
                <p className="text-[var(--text-primary)] text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  It connects the dots you can&apos;t see alone.
                </p>
                <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed">
                  A single change is innocent. Four changes in three weeks is a pattern. Vigil sees what anxiety makes you miss.
                </p>
              </div>
              <div>
                <p className="text-[var(--vigil-amber)] label-xs tracking-[0.15em] mb-2">YOUR CASE FILE</p>
                <p className="text-[var(--text-primary)] text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Everything organized. Nothing forgotten.
                </p>
                <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed">
                  Every detail you share is tracked across 5 investigation modules — digital behavior, schedule patterns, financial red flags, communication shifts, and emotional changes.
                </p>
              </div>
              <div>
                <p className="text-[var(--vigil-amber)] label-xs tracking-[0.15em] mb-2">WHEN YOU&apos;RE READY</p>
                <p className="text-[var(--text-primary)] text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  The confrontation toolkit.
                </p>
                <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed">
                  What to say. What not to say. How to handle denial. What to do with the answer. You won&apos;t be blindsided.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ CONFESSIONAL QUOTE — Big Impact ═══ */}
      <section className="section-elevated px-6 py-24 sm:py-32">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <p className="display-xl text-[var(--text-primary)] mb-6" style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            &ldquo;I found out in 3 days.&rdquo;
          </p>
          <p className="text-[13px] text-[var(--text-muted)] tracking-wide uppercase">Anonymous — verified user</p>
        </FadeIn>
      </section>

      {/* ═══ WHY NOTHING ELSE WORKS — Takedown ═══ */}
      <section className="section-dark px-6 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="display-lg text-[var(--text-primary)] mb-4">
              Why nothing else works.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ComparisonCard label="Private Investigator" stamp="$5,000" stampColor="border-[var(--vigil-red)] text-[var(--vigil-red)]" delay={0} />
            <ComparisonCard label="Spy Apps" stamp="ILLEGAL" stampColor="border-[var(--vigil-red)] text-[var(--vigil-red)]" delay={0.1} />
            <ComparisonCard label="Friends & Family" stamp="BIASED" stampColor="border-[var(--vigil-amber)] text-[var(--vigil-amber)]" delay={0.2} />
          </div>
          <FadeIn delay={0.4} className="mt-8 text-center">
            <p className="text-[var(--text-secondary)] text-[15px]">
              Vigil costs <span className="text-[var(--text-primary)] font-semibold">$9.99/week</span>. Legal. Private. Available right now.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — Chapters ═══ */}
      <section id="how-it-works" className="section-dark">
        <FadeIn className="text-center px-6 pt-24 sm:pt-32 pb-12">
          <p className="label-sm text-[var(--vigil-red)] tracking-[0.15em] mb-4">THE PROCESS</p>
          <h2 className="display-lg text-[var(--text-primary)]">
            Your investigation, step by step.
          </h2>
        </FadeIn>

        {/* Chapter 1 */}
        <div className="border-t border-[var(--border-subtle)] px-6 py-20 sm:py-28">
          <FadeIn className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--vigil-red)]/10 border border-[var(--vigil-red)]/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[var(--vigil-red)]" />
              </div>
              <div>
                <p className="label-xs text-[var(--text-muted)]">Chapter 1</p>
                <h3 className="text-xl text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Tell Your Story</h3>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed pl-16">
              Describe what you&apos;ve noticed. Late nights, phone guarding, sudden gym visits, emotional distance. Vigil listens without judgment and asks the questions you haven&apos;t thought to ask. Your personal case file begins here.
            </p>
          </FadeIn>
        </div>

        {/* Chapter 2 */}
        <div className="border-t border-[var(--border-subtle)] px-6 py-20 sm:py-28 bg-[var(--bg-elevated)]">
          <FadeIn className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--vigil-red)]/10 border border-[var(--vigil-red)]/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-[var(--vigil-red)]" />
              </div>
              <div>
                <p className="label-xs text-[var(--text-muted)]">Chapter 2</p>
                <h3 className="text-xl text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>The Investigation</h3>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed pl-16">
              Walk through 5 structured investigation modules — digital behavior, schedule patterns, financial red flags, communication changes, and emotional shifts. Each module guides you through what to look for and how to document it legally.
            </p>
          </FadeIn>
        </div>

        {/* Chapter 3 */}
        <div className="border-t border-[var(--border-subtle)] px-6 py-20 sm:py-28">
          <FadeIn className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--vigil-red)]/10 border border-[var(--vigil-red)]/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-[var(--vigil-red)]" />
              </div>
              <div>
                <p className="label-xs text-[var(--text-muted)]">Chapter 3</p>
                <h3 className="text-xl text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Pattern Analysis</h3>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed pl-16">
              As evidence accumulates, Vigil connects dots across every module. A single behavior is innocent. Three concurrent changes in the same week is a pattern. You&apos;ll see the full picture clearly for the first time.
            </p>
          </FadeIn>
        </div>

        {/* Chapter 4 */}
        <div className="border-t border-b border-[var(--border-subtle)] px-6 py-20 sm:py-28 bg-[var(--bg-elevated)]">
          <FadeIn className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--vigil-red)]/10 border border-[var(--vigil-red)]/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[var(--vigil-red)]" />
              </div>
              <div>
                <p className="label-xs text-[var(--text-muted)]">Chapter 4</p>
                <h3 className="text-xl text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>The Confrontation</h3>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed pl-16">
              When you&apos;re ready, Vigil prepares you. Complete conversation scripts, how to handle denial, recording laws for your state, and what to do after — whatever the answer turns out to be.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ REAL STORIES — Horizontal Scroll ═══ */}
      <section className="section-dark px-6 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="label-sm text-[var(--vigil-red)] tracking-[0.15em] mb-4">REAL STORIES</p>
            <h2 className="display-lg text-[var(--text-primary)]">
              From people who found their answer.
            </h2>
          </FadeIn>

          <div className="stories-scroll">
            {[
              { text: "I was spiraling at midnight with no one to talk to. Vigil organized everything I'd noticed into a clear pattern. Within a week, I had my answer.", time: "2 weeks" },
              { text: "I was afraid I was being paranoid. Vigil told me honestly that most of what I'd found was explainable. That clarity was worth everything.", time: "3 days" },
              { text: "The confrontation prep was everything. I knew exactly what to say, how to handle denial, and what to do after. I wasn't blindsided.", time: "6 weeks" },
              { text: "I couldn't afford a PI. I couldn't talk to friends without it getting back to him. Vigil was the only thing that actually helped.", time: "10 days" },
              { text: "Found out on day 2. I already suspected but needed someone to help me see the pattern clearly. Vigil did that.", time: "2 days" },
            ].map((story, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="w-[300px] sm:w-[340px] vigil-card p-6 relative">
                  <span className="absolute top-4 left-5 text-[var(--vigil-red)]/15 text-4xl leading-none font-serif select-none" aria-hidden>&ldquo;</span>
                  <p className="text-[var(--text-secondary)] text-[14px] leading-relaxed mb-4 relative pt-4" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                    {story.text}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium relative">
                    Anonymous — {story.time}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRY FREE — Zero Friction ═══ */}
      <section className="section-elevated px-6 py-20">
        <FadeIn className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-[var(--vigil-amber)]" />
            <span className="label-sm text-[var(--vigil-amber)] tracking-[0.15em]">Zero Friction</span>
          </div>
          <h2 className="display-md text-[var(--text-primary)] mb-4">
            Try free — no signup required.
          </h2>
          <p className="text-[15px] text-[var(--text-secondary)] mb-8 leading-relaxed">
            10 free messages. No email. No credit card. No one will ever know you were here.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['No email needed', 'No credit card', '100% anonymous', 'Delete anytime'].map((item) => (
              <span key={item} className="text-[12px] text-[var(--text-muted)] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-full px-4 py-2">
                {item}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ═══ PRICING — Urgent ═══ */}
      <section className="section-dark px-6 py-24 sm:py-32">
        <div className="max-w-xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="display-lg text-[var(--text-primary)] mb-3">
              Get answers for less<br />than a dinner out.
            </h2>
            <p className="text-[var(--text-secondary)] text-base">
              <span className="text-[var(--text-primary)] font-semibold">$9.99/week</span> vs <span className="line-through text-[var(--text-muted)]">$5,000 PI</span>
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative p-8 sm:p-10 rounded-2xl bg-[var(--vigil-red)]/[0.04] border-2 border-[var(--vigil-red)]/30 shadow-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--vigil-red)] text-white label-xs px-5 py-1.5 rounded-full">
                MOST POPULAR
              </div>

              <div className="text-center mb-8">
                <div className="mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)]">$9.99</span>
                  <span className="text-[var(--text-muted)] text-base">/week</span>
                </div>
                <p className="text-[var(--text-secondary)] text-[14px]">Cancel anytime. Start free with 10 messages.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  'Unlimited conversations',
                  'All 5 investigation modules',
                  'Pattern analysis',
                  'Evidence tracking',
                  'Confrontation toolkit',
                  '24/7 availability',
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)]">
                    <div className="w-4 h-4 rounded-full bg-[var(--vigil-red)]/10 flex items-center justify-center mt-0.5 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--vigil-red)]" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <Link href="/demo/chat" className="btn-red-pill w-full text-center py-4 block text-base">
                Start now
              </Link>
            </div>
          </FadeIn>

          <p className="text-center text-[12px] text-[var(--text-muted)] mt-8">
            Also available: $29.99/month (save 25%) and $49.99 one-time confrontation package.
          </p>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-elevated px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="display-lg text-[var(--text-primary)]">
              Questions you&apos;re thinking.
            </h2>
          </FadeIn>
          <div className="divide-y divide-[var(--border-subtle)]">
            {[
              {
                q: 'Is this legal?',
                a: 'Yes. Vigil only guides you through legal evidence-gathering methods. It will never advise accessing someone\'s phone, accounts, or installing spy software.',
              },
              {
                q: 'Who can see my conversations?',
                a: 'No one. Your conversations are private and encrypted. We don\'t read them, share them, or sell them. Delete your account and all data at any time.',
              },
              {
                q: 'Do I need to use my real name?',
                a: 'No. You don\'t even need an email — you can start anonymously. We\'ll never ask for your real name or your partner\'s name.',
              },
              {
                q: 'What if they\'re NOT cheating?',
                a: 'Vigil is honest. If the evidence doesn\'t support infidelity, it will tell you. That clarity — in either direction — is what this is for.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel from your account settings at any moment. No questions asked.',
              },
              {
                q: 'Is there a human on the other end?',
                a: 'No — Vigil is AI-powered. It\'s not a therapist or PI. But it\'s available when they aren\'t — especially at 2am.',
              },
            ].map((faq, i) => (
              <FadeIn key={i} delay={i * 0.03}>
                <details className="group">
                  <summary className="flex items-center justify-between py-5 cursor-pointer text-[15px] font-medium text-[var(--text-primary)]">
                    {faq.q}
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)] faq-chevron shrink-0 ml-6" />
                  </summary>
                  <div className="pb-5 text-[14px] text-[var(--text-secondary)] leading-relaxed -mt-1">
                    {faq.a}
                  </div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRIVACY ═══ */}
      <section className="section-dark px-6 py-24">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <Lock className="w-5 h-5 text-[var(--vigil-red)]" />
            <span className="label-sm text-[var(--vigil-red)] tracking-[0.15em]">Privacy First</span>
          </div>
          <h2 className="display-md text-[var(--text-primary)] mb-5">
            Your secret is safe here.
          </h2>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto mb-12">
            No real name needed. No data sold. Complete anonymity from the moment you arrive.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Lock className="w-4 h-4" />, label: 'Encrypted data' },
              { icon: <Eye className="w-4 h-4" />, label: 'Zero analytics' },
              { icon: <Shield className="w-4 h-4" />, label: 'Anonymous accounts' },
              { icon: <Clock className="w-4 h-4" />, label: 'Instant deletion' },
            ].map((item, i) => (
              <div key={i} className="vigil-card flex flex-col items-center gap-3 p-5">
                <div className="text-[var(--vigil-red)]">{item.icon}</div>
                <span className="text-[12px] text-[var(--text-secondary)] text-center font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ═══ FINAL CTA — Cinematic ═══ */}
      <section className="section-dark px-6 py-32 sm:py-44 relative overflow-hidden">
        {/* Red glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[var(--vigil-red)]/[0.05] rounded-full blur-[150px] pointer-events-none" />

        <FadeIn className="max-w-2xl mx-auto text-center relative">
          <h2 className="display-xl text-[var(--text-primary)] mb-6 leading-tight">
            You already know<br />
            <span className="text-red-gradient">something is wrong.</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-12 leading-relaxed">
            Stop second-guessing. Start investigating.
          </p>
          <Link href="/demo/chat" className="btn-red-pill inline-flex items-center gap-3 px-12 py-5 text-lg">
            Start your investigation
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-8 text-[13px] text-[var(--text-muted)]">
            Free to start. No credit card. No one will know.
          </p>
        </FadeIn>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-6 py-8 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-[var(--vigil-red)]" />
            <span className="label-xs text-[var(--text-secondary)] tracking-[0.12em]">VIGIL</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-[var(--text-muted)]">
            <Link href="/pricing" className="hover:text-[var(--text-secondary)] transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-[var(--text-secondary)] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--text-secondary)] transition-colors">Terms</Link>
            <Link href="/login" className="hover:text-[var(--text-secondary)] transition-colors">Sign in</Link>
            <span>&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
