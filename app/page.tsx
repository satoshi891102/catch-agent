'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Shield,
  Lock,
  Clock,
  TrendingUp,
  FileText,
  MessageSquare,
  ChevronDown,
  CheckCircle,
  ArrowRight,
  Eye,
  Search,
  Brain,
  Zap,
  X,
  Star,
} from 'lucide-react'

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

export default function LandingPage() {
  return (
    <div className="min-h-screen grain-overlay">
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/20 flex items-center justify-center">
            <Eye className="w-3.5 h-3.5 text-[var(--vigil-gold)]" />
          </div>
          <span className="label-sm text-[var(--text-primary)] tracking-[0.15em]">VIGIL</span>
        </Link>
        <div className="hidden sm:flex items-center gap-8">
          <Link href="#how-it-works" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">How it works</Link>
          <Link href="/pricing" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:block">Sign in</Link>
          <Link href="/demo/chat" className="btn-gold text-[13px] px-5 py-2">
            Start free
          </Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero-bg min-h-screen flex flex-col items-center justify-center px-6 pt-14 text-center relative">
        <div className="max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="display-xl text-[var(--text-primary)] mb-6"
          >
            You know something{' '}
            <span className="text-gold-gradient">isn&apos;t right.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-lg text-[var(--text-secondary)] leading-relaxed mb-10 max-w-[480px] mx-auto"
          >
            Vigil is an AI relationship investigator that helps you find the truth — methodically, legally, and without anyone else knowing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col items-center gap-5"
          >
            <Link href="/demo/chat" className="btn-gold-pill inline-flex items-center gap-2.5 px-10 py-4 text-[15px]">
              Start your investigation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/quiz" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--vigil-gold)] transition-colors">
              Not sure? Take the 2-minute assessment →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-[var(--text-muted)]"
          >
            {['Free to start', 'No credit card', 'Available 24/7', '100% private'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--vigil-gold)]/60" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-elevated)] to-transparent" />
      </section>

      {/* ═══ THE 2AM QUOTE ═══ */}
      <section className="section-elevated px-6 py-32">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <p className="display-md text-[var(--text-primary)] leading-snug italic opacity-90" style={{ fontFamily: 'var(--font-display)' }}>
            &ldquo;It&apos;s 2am. You can&apos;t sleep. Something feels off, but you can&apos;t prove it. You don&apos;t know who to talk to.&rdquo;
          </p>
          <p className="mt-10 label-sm text-[var(--vigil-gold)] tracking-[0.15em]">
            That&apos;s exactly why Vigil exists
          </p>
        </FadeIn>
      </section>

      {/* ═══ WHY NOTHING ELSE WORKS ═══ */}
      <section className="section-dark px-6 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="display-lg text-[var(--text-primary)] mb-4">
              Why nothing else works
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)]">
              Every option has a fatal flaw. Vigil was built to fill the gap.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { option: 'Private investigator', problem: '$2,000–5,000. Weeks of waiting. Embarrassing to hire.' },
              { option: 'Spy apps', problem: 'Illegal. Require physical access. Ethically wrong.' },
              { option: 'Friends & family', problem: 'Biased. Gossip risk. Can\'t give objective advice.' },
              { option: 'Therapy', problem: '$200/session. Scheduled appointments. Not available at 2am.' },
              { option: 'Google & Reddit', problem: 'Generic. Contradictory. No memory of your situation.' },
              { option: 'ChatGPT', problem: 'No structure. No case file. No methodology. Forgotten tomorrow.' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="vigil-card flex items-start gap-4 p-5">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center mt-0.5 shrink-0">
                    <X className="w-3.5 h-3.5 text-red-400/70" />
                  </div>
                  <div>
                    <span className="font-medium text-[var(--text-primary)] text-[14px]">{item.option}</span>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-relaxed">{item.problem}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="section-elevated px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="display-lg text-[var(--text-primary)] mb-4">
              How Vigil works
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)]">
              A structured, methodical approach. Not random advice.
            </p>
          </FadeIn>

          <div className="space-y-2">
            {[
              {
                step: '01',
                icon: <MessageSquare className="w-5 h-5" />,
                title: 'Tell your story',
                desc: 'Describe what you\'ve noticed. Vigil listens without judgment, asks the right questions, and builds your personal case file.',
              },
              {
                step: '02',
                icon: <Search className="w-5 h-5" />,
                title: 'Guided investigation',
                desc: 'Walk through 5 investigation modules — digital behavior, schedule patterns, financial red flags, communication changes, and emotional shifts.',
              },
              {
                step: '03',
                icon: <Brain className="w-5 h-5" />,
                title: 'Pattern analysis',
                desc: 'As you gather information, Vigil connects the dots. A single thing can be innocent. Patterns tell the real story.',
              },
              {
                step: '04',
                icon: <FileText className="w-5 h-5" />,
                title: 'The confrontation toolkit',
                desc: 'When you\'re ready, Vigil prepares you — what to say, what not to say, how to handle denial, and what to do with the answer.',
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex gap-5 p-6 rounded-2xl hover:bg-[var(--bg-card)]/50 transition-colors">
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[var(--vigil-gold)]/8 border border-[var(--vigil-gold)]/15 flex items-center justify-center text-[var(--vigil-gold)]">
                      {item.icon}
                    </div>
                    <span className="label-xs text-[var(--text-dim)]">{item.step}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold text-[var(--text-primary)] mb-2 text-[15px]">{item.title}</h3>
                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CHAT PREVIEW ═══ */}
      <section className="section-dark px-6 py-24 sm:py-32">
        <div className="max-w-xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="display-lg text-[var(--text-primary)] mb-4">
              Feel what it&apos;s like
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)]">
              This is how Vigil talks to you.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden bg-[var(--bg-card)] shadow-elevated relative">
              {/* Ambient glow behind */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[var(--vigil-gold)]/[0.03] to-transparent pointer-events-none" />

              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] relative">
                <div className="w-9 h-9 rounded-full bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/20 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-[var(--vigil-gold)]" />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-[var(--text-primary)]">Vigil</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Active
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-5 relative">
                {/* Vigil message */}
                <div className="flex gap-3 items-end">
                  <div className="w-7 h-7 rounded-full bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/20 flex items-center justify-center shrink-0">
                    <Eye className="w-3 h-3 text-[var(--vigil-gold)]" />
                  </div>
                  <div className="bg-[var(--bg-elevated)] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[82%] border border-[var(--border-subtle)]">
                    <p className="text-[14px] text-[var(--text-primary)] leading-relaxed">
                      I&apos;m here, and I&apos;m listening. Tell me everything — what first made you suspicious?
                    </p>
                  </div>
                </div>

                {/* User message */}
                <div className="flex gap-3 items-end justify-end">
                  <div className="bg-gradient-to-br from-[var(--vigil-gold)]/12 to-[var(--vigil-gold)]/6 border border-[var(--vigil-gold)]/15 rounded-2xl rounded-br-sm px-4 py-3 max-w-[82%]">
                    <p className="text-[14px] text-[var(--text-primary)] leading-relaxed">
                      He started coming home late about 3 weeks ago. Always &quot;meetings&quot; but he never used to work late. And he changed his phone password.
                    </p>
                  </div>
                </div>

                {/* Vigil response */}
                <div className="flex gap-3 items-end">
                  <div className="w-7 h-7 rounded-full bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/20 flex items-center justify-center shrink-0">
                    <Eye className="w-3 h-3 text-[var(--vigil-gold)]" />
                  </div>
                  <div className="bg-[var(--bg-elevated)] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[82%] border border-[var(--border-subtle)]">
                    <p className="text-[14px] text-[var(--text-primary)] leading-relaxed">
                      Three weeks ago — that&apos;s a specific starting point, which matters. The phone password change alongside late nights is a notable combination. Let me ask: is it the <em className="text-[var(--vigil-gold)]">same nights</em> each week, or unpredictable?
                    </p>
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-5 py-4 border-t border-[var(--border-subtle)] flex items-center gap-3 bg-[var(--bg-elevated)] relative">
                <div className="flex-1 bg-[var(--bg-primary)] rounded-xl px-4 py-3 text-[13px] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  Tell Vigil what you&apos;ve noticed...
                </div>
                <Link href="/demo/chat" className="btn-gold px-5 py-2.5 text-[13px]">
                  Try free
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="section-elevated px-6 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="display-lg text-[var(--text-primary)] mb-4">
              What you get
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)]">
              Everything a private investigator knows, at a fraction of the cost.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <FileText className="w-5 h-5" />,
                title: 'Persistent Case File',
                desc: 'Every detail you share is remembered and organized. Vigil never forgets.',
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: '24/7 Availability',
                desc: 'Available at 2am when the anxiety peaks and you can\'t sleep.',
              },
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: 'Pattern Analysis',
                desc: 'Connects dots across digital, schedule, financial, and behavioral evidence.',
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: 'Legal Methods Only',
                desc: 'Every technique is legal. Vigil will never advise accessing someone\'s accounts.',
              },
              {
                icon: <Lock className="w-5 h-5" />,
                title: 'Complete Privacy',
                desc: 'No real name needed. End-to-end private. No one ever knows you\'re here.',
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Confrontation Ready',
                desc: 'When you have enough, Vigil prepares you for the conversation.',
              },
            ].map((feature, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="vigil-card p-7 h-full">
                  <div className="w-11 h-11 rounded-xl bg-[var(--vigil-gold)]/6 border border-[var(--vigil-gold)]/12 flex items-center justify-center mb-5 text-[var(--vigil-gold)]">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2 text-[15px]">{feature.title}</h3>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="section-dark px-6 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="display-lg text-[var(--text-primary)] mb-3">
              Simple pricing
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)]">
              A fraction of a private investigator. Cancel anytime.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            {/* Weekly */}
            <FadeIn delay={0}>
              <div className="vigil-card p-7 flex flex-col">
                <span className="label-xs text-[var(--vigil-gold)]">Start now</span>
                <div className="mt-3 mb-1">
                  <span className="text-3xl font-bold text-[var(--text-primary)]">$9.99</span>
                  <span className="text-[13px] text-[var(--text-muted)]">/week</span>
                </div>
                <span className="text-[13px] text-[var(--text-muted)] mb-6">Weekly</span>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Unlimited conversations', 'All 5 investigation modules', 'Pattern analysis', 'Evidence tracking'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)]">
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--vigil-gold)]/60 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/demo/chat" className="text-center py-3 rounded-xl text-[13px] font-medium bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all">
                  Get started
                </Link>
              </div>
            </FadeIn>

            {/* Monthly — highlighted */}
            <FadeIn delay={0.08}>
              <div className="relative p-7 rounded-2xl flex flex-col bg-[var(--vigil-gold)]/[0.04] border-2 border-[var(--vigil-gold)]/30 shadow-glow sm:scale-[1.03]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--vigil-gold)] text-[var(--bg-primary)] label-xs px-4 py-1.5 rounded-full">
                  MOST POPULAR
                </div>
                <span className="label-xs text-[var(--vigil-gold)]">Best value</span>
                <div className="mt-3 mb-1">
                  <span className="text-3xl font-bold text-[var(--text-primary)]">$29.99</span>
                  <span className="text-[13px] text-[var(--text-muted)]">/month</span>
                </div>
                <span className="text-[13px] text-[var(--text-muted)] mb-6">Monthly</span>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Everything in Weekly', 'Confrontation toolkit', 'Legal prep guide', 'Exit planning'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)]">
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--vigil-gold)] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/demo/chat" className="btn-gold text-center py-3 text-[13px]">
                  Get started
                </Link>
              </div>
            </FadeIn>

            {/* Confrontation */}
            <FadeIn delay={0.16}>
              <div className="vigil-card p-7 flex flex-col">
                <span className="label-xs text-[var(--vigil-gold)]">Ready to act</span>
                <div className="mt-3 mb-1">
                  <span className="text-3xl font-bold text-[var(--text-primary)]">$49.99</span>
                  <span className="text-[13px] text-[var(--text-muted)]"> one-time</span>
                </div>
                <span className="text-[13px] text-[var(--text-muted)] mb-6">Confrontation</span>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Complete scripts', 'Recording laws guide', 'Legal prep', 'Lifetime access'].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)]">
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--vigil-gold)]/60 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/demo/chat" className="text-center py-3 rounded-xl text-[13px] font-medium bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all">
                  Get started
                </Link>
              </div>
            </FadeIn>
          </div>

          <p className="text-center text-[12px] text-[var(--text-muted)] mt-10">
            Start free — 10 messages included. No credit card required.
          </p>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section-elevated px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="display-lg text-[var(--text-primary)]">
              From people who found answers
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {[
              {
                text: 'I was spiraling at midnight with no one to talk to. Vigil helped me organize my thoughts and realize I actually had three patterns of evidence I\'d dismissed individually. Within a week, I had my answer.',
                author: 'Anonymous — 2 weeks',
              },
              {
                text: 'I was genuinely afraid I was being paranoid. Vigil told me honestly that most of what I\'d found was explainable. That clarity alone was worth the $10.',
                author: 'Anonymous — 3 days',
              },
              {
                text: 'The confrontation prep was everything. I knew exactly what to say, how to handle denial, and what to do after. I wasn\'t blindsided by anything.',
                author: 'Anonymous — 6 weeks',
              },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="vigil-card p-7 relative">
                  <span className="absolute top-5 left-6 text-[var(--vigil-gold)]/20 text-5xl leading-none font-serif select-none" aria-hidden>&ldquo;</span>
                  <div className="flex gap-0.5 mb-4 relative">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-[var(--vigil-gold)] fill-[var(--vigil-gold)]" />
                    ))}
                  </div>
                  <p className="text-[var(--text-secondary)] text-[14px] leading-relaxed mb-4 relative">
                    {t.text}
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)] font-medium relative">{t.author}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-dark px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="display-lg text-[var(--text-primary)]">
              Common questions
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
                q: 'What if the evidence shows they\'re NOT cheating?',
                a: 'Vigil is honest. If the evidence doesn\'t support infidelity, it will tell you. That clarity — in either direction — is what this product is for.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel from your account settings at any moment. No questions asked.',
              },
              {
                q: 'Is there a human on the other end?',
                a: 'No — Vigil is an AI powered by advanced language models. It\'s not a human therapist or PI. But it\'s available when they aren\'t — especially at 2am.',
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
      <section className="section-elevated px-6 py-24">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <Lock className="w-5 h-5 text-[var(--vigil-gold)]" />
            <span className="label-sm text-[var(--vigil-gold)] tracking-[0.15em]">Privacy First</span>
          </div>
          <h2 className="display-md text-[var(--text-primary)] mb-5">
            Your secret is safe here.
          </h2>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto mb-12">
            We handle your situation with the same discretion a trusted friend would. No real name needed. No data sold — ever.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Lock className="w-4 h-4" />, label: 'Encrypted data' },
              { icon: <Eye className="w-4 h-4" />, label: 'Zero analytics' },
              { icon: <Shield className="w-4 h-4" />, label: 'Anonymous accounts' },
              { icon: <FileText className="w-4 h-4" />, label: 'Instant deletion' },
            ].map((item, i) => (
              <div key={i} className="vigil-card flex flex-col items-center gap-3 p-5">
                <div className="text-[var(--vigil-gold)]">{item.icon}</div>
                <span className="text-[12px] text-[var(--text-secondary)] text-center font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="section-dark px-6 py-32 sm:py-40 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[var(--vigil-gold)]/[0.03] rounded-full blur-[120px]" />
        <FadeIn className="max-w-xl mx-auto text-center relative">
          <h2 className="display-lg text-[var(--text-primary)] mb-6">
            You deserve to know the truth.
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed">
            Start free — no credit card, no commitment. Just answers.
          </p>
          <Link href="/demo/chat" className="btn-gold-pill inline-flex items-center gap-2.5 px-10 py-4 text-[15px]">
            Start your investigation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-6 py-8 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-[var(--vigil-gold)]" />
            <span className="label-xs text-[var(--text-secondary)] tracking-[0.12em]">VIGIL</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-[var(--text-muted)]">
            <Link href="/pricing" className="hover:text-[var(--text-secondary)] transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-[var(--text-secondary)] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--text-secondary)] transition-colors">Terms</Link>
            <Link href="/login" className="hover:text-[var(--text-secondary)] transition-colors">Sign in</Link>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
