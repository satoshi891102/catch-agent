'use client'

import { useRef } from 'react'
import Link from 'next/link'
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
  AlertCircle,
  Star,
  ArrowRight,
  Eye,
  Search,
  Brain,
  Zap,
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0e0c] overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-[#0f0e0c]/90 backdrop-blur-md border-b border-[#2e2b25]/40">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#c9a84c]" />
          <span className="font-semibold text-[#f0ebe0] tracking-wide">VIGIL</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[#b8a98a] hover:text-[#f0ebe0] transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-[#c9a84c] text-[#0f0e0c] px-4 py-1.5 rounded-full font-medium hover:bg-[#e0c070] transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient min-h-screen flex flex-col items-center justify-center px-5 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-medium tracking-widest uppercase mb-6 px-3 py-1.5 border border-[#c9a84c]/30 rounded-full bg-[#c9a84c]/5"
          >
            <Shield className="w-3 h-3" />
            Private. Secure. Zero judgment.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#f0ebe0] leading-tight mb-6"
          >
            You know something{' '}
            <span className="text-gradient-gold">isn&apos;t right.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-[#b8a98a] leading-relaxed mb-8 max-w-xl mx-auto"
          >
            Vigil is an AI relationship investigator that helps you find the truth — methodically, legally, and without anyone else knowing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0f0e0c] px-8 py-4 rounded-full font-semibold text-base hover:bg-[#e0c070] transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] active:scale-95"
            >
              Start your investigation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#b8a98a] hover:text-[#f0ebe0] px-6 py-4 transition-colors"
            >
              See how it works
              <ChevronDown className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#6e6050]"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#c9a84c]" />
              Free to start
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#c9a84c]" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#c9a84c]" />
              Available 24/7
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#c9a84c]" />
              100% private
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-[#6e6050]" />
          </motion.div>
        </motion.div>
      </section>

      {/* The Problem — emotional resonance */}
      <section className="px-5 py-20 bg-[#0a0908]">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl font-light text-[#f0ebe0] leading-relaxed">
            &ldquo;It&apos;s 2am. You can&apos;t sleep. Something feels off, but you can&apos;t prove it. You don&apos;t know who to talk to — you don&apos;t want to worry your friends, you can&apos;t afford a PI, and Google just makes it worse.&rdquo;
          </p>
          <p className="mt-6 text-[#b8a98a] text-lg">
            That&apos;s exactly why Vigil exists.
          </p>
        </AnimatedSection>
      </section>

      {/* The Gap table */}
      <section className="px-5 py-16 bg-[#0f0e0c]">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#f0ebe0] mb-10">
            Why nothing else works
          </h2>
          <div className="space-y-3">
            {[
              { option: 'Private investigator', problem: '$2,000–5,000. Weeks of waiting. Embarrassing to hire.' },
              { option: 'Spy apps', problem: 'Illegal. Require physical access. Ethically wrong.' },
              { option: 'Friends & family', problem: 'Biased. Gossip risk. Can&apos;t give objective advice.' },
              { option: 'Therapy', problem: '$200/session. Scheduled appointments. Not available at 2am.' },
              { option: 'Google & Reddit', problem: 'Generic. Contradictory. No memory of your situation.' },
              { option: 'ChatGPT', problem: 'No structure. No case file. No methodology. Forgotten tomorrow.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-4 bg-[#1a1814] rounded-xl border border-[#2e2b25]"
              >
                <AlertCircle className="w-4 h-4 text-red-400/60 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-[#f0ebe0] text-sm">{item.option}</span>
                  <span className="text-[#6e6050] text-sm"> — </span>
                  <span className="text-[#b8a98a] text-sm" dangerouslySetInnerHTML={{ __html: item.problem }} />
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-5 py-20 bg-[#0a0908]">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#f0ebe0] mb-3">
            How Vigil works
          </h2>
          <p className="text-center text-[#b8a98a] mb-12">
            A structured, methodical approach. Not random advice.
          </p>
          <div className="space-y-6">
            {[
              {
                step: '01',
                icon: <MessageSquare className="w-5 h-5" />,
                title: 'Tell your story',
                description: 'Start by describing what you\'ve noticed. Vigil listens without judgment, asks the right questions, and builds your personal case file.',
              },
              {
                step: '02',
                icon: <Search className="w-5 h-5" />,
                title: 'Guided investigation',
                description: 'Vigil walks you through 5 investigation modules — digital behavior, schedule patterns, financial red flags, communication changes, and emotional shifts.',
              },
              {
                step: '03',
                icon: <Brain className="w-5 h-5" />,
                title: 'Pattern analysis',
                description: 'As you gather information, Vigil connects the dots. A single thing can be innocent. Patterns are different.',
              },
              {
                step: '04',
                icon: <FileText className="w-5 h-5" />,
                title: 'The confrontation toolkit',
                description: 'When you\'re ready, Vigil prepares you — what to say, what not to say, how to handle denial, and what to do with the answer.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 p-5 bg-[#1e1c18] rounded-2xl border border-[#2e2b25]"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c]">
                    {item.icon}
                  </div>
                  <span className="text-xs text-[#6e6050] font-mono">{item.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#f0ebe0] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#b8a98a] leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Chat preview */}
      <section className="px-5 py-20 bg-[#0f0e0c]">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#f0ebe0] mb-3">
            Feel what it&apos;s like
          </h2>
          <p className="text-center text-[#b8a98a] mb-10">
            This is how Vigil talks to you.
          </p>
          <div className="bg-[#1a1814] rounded-2xl border border-[#2e2b25] overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2e2b25] bg-[#1e1c18]">
              <div className="w-8 h-8 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center">
                <Eye className="w-4 h-4 text-[#c9a84c]" />
              </div>
              <div>
                <div className="text-sm font-medium text-[#f0ebe0]">Vigil</div>
                <div className="text-xs text-[#4ade80] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block" />
                  Active
                </div>
              </div>
            </div>
            {/* Messages */}
            <div className="p-4 space-y-4">
              <div className="flex gap-3 items-end">
                <div className="w-6 h-6 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
                  <Eye className="w-3 h-3 text-[#c9a84c]" />
                </div>
                <div className="bg-[#272420] rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                  <p className="text-sm text-[#f0ebe0] leading-relaxed">
                    I&apos;m here, and I&apos;m listening. Tell me everything from the beginning — what first made you suspicious? Don&apos;t filter yourself.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-end justify-end">
                <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                  <p className="text-sm text-[#f0ebe0] leading-relaxed">
                    He started coming home late about 3 weeks ago. Always &quot;meetings&quot; but he never used to work late. And he changed his phone password.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-end">
                <div className="w-6 h-6 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
                  <Eye className="w-3 h-3 text-[#c9a84c]" />
                </div>
                <div className="bg-[#272420] rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                  <p className="text-sm text-[#f0ebe0] leading-relaxed">
                    Three weeks ago — that&apos;s a specific starting point, which matters. The phone password change is worth noting. What changed about the late nights — is it a specific day, or random?
                  </p>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-[#2e2b25] flex items-center gap-3">
              <div className="flex-1 bg-[#0f0e0c] rounded-full px-4 py-2.5 text-sm text-[#6e6050]">
                Tell Vigil what you&apos;ve noticed...
              </div>
              <Link
                href="/signup"
                className="bg-[#c9a84c] text-[#0f0e0c] px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#e0c070] transition-colors"
              >
                Start for free
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features */}
      <section className="px-5 py-20 bg-[#0a0908]">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#f0ebe0] mb-3">
            What you get
          </h2>
          <p className="text-center text-[#b8a98a] mb-12">
            Everything a private investigator knows, at a fraction of the cost.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: <FileText className="w-5 h-5 text-[#c9a84c]" />,
                title: 'Persistent Case File',
                description: 'Every detail you share is remembered and organized. Vigil never forgets.',
              },
              {
                icon: <Clock className="w-5 h-5 text-[#c9a84c]" />,
                title: '24/7 Availability',
                description: 'Available at 2am when the anxiety peaks and you can\'t sleep.',
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-[#c9a84c]" />,
                title: 'Pattern Analysis',
                description: 'Connects dots across digital, schedule, financial, and behavioral evidence.',
              },
              {
                icon: <Shield className="w-5 h-5 text-[#c9a84c]" />,
                title: 'Legal Methods Only',
                description: 'Every technique is legal. Vigil will never advise accessing someone\'s accounts.',
              },
              {
                icon: <Lock className="w-5 h-5 text-[#c9a84c]" />,
                title: 'Complete Privacy',
                description: 'No real name needed. End-to-end private. No one ever knows you\'re here.',
              },
              {
                icon: <Zap className="w-5 h-5 text-[#c9a84c]" />,
                title: 'Confrontation Ready',
                description: 'When you have enough, Vigil prepares you for the conversation.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 bg-[#1e1c18] rounded-2xl border border-[#2e2b25] hover:border-[#c9a84c]/20 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-[#f0ebe0] mb-1.5 text-sm">{feature.title}</h3>
                <p className="text-sm text-[#b8a98a] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Pricing */}
      <section className="px-5 py-20 bg-[#0f0e0c]">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#f0ebe0] mb-2">
            Simple pricing
          </h2>
          <p className="text-center text-[#b8a98a] mb-10">
            A fraction of a private investigator. Cancel anytime.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                name: 'Weekly',
                price: '$9.99',
                period: '/week',
                badge: 'Start now',
                features: ['Unlimited conversations', 'All 5 investigation modules', 'Pattern analysis', 'Evidence tracking'],
              },
              {
                name: 'Monthly',
                price: '$29.99',
                period: '/month',
                badge: 'Best value',
                highlighted: true,
                features: ['Everything in Weekly', 'Confrontation toolkit', 'Legal prep guide', 'Exit planning'],
              },
              {
                name: 'Confrontation',
                price: '$49.99',
                period: 'one-time',
                badge: 'Ready to act',
                features: ['Complete scripts', 'Recording laws guide', 'Legal prep', 'Lifetime access'],
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-5 rounded-2xl border flex flex-col ${
                  plan.highlighted
                    ? 'bg-[#c9a84c]/8 border-[#c9a84c]/40 shadow-[0_0_30px_rgba(201,168,76,0.1)]'
                    : 'bg-[#1e1c18] border-[#2e2b25]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a84c] text-[#0f0e0c] text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <span className="text-xs text-[#c9a84c] font-medium uppercase tracking-wide">{plan.badge}</span>
                  <div className="text-xl font-bold text-[#f0ebe0] mt-1">
                    {plan.price}
                    <span className="text-sm font-normal text-[#b8a98a]">{plan.period}</span>
                  </div>
                  <div className="text-sm font-medium text-[#b8a98a]">{plan.name}</div>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[#b8a98a]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#c9a84c] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`text-center py-2.5 rounded-xl text-sm font-medium transition-all ${
                    plan.highlighted
                      ? 'bg-[#c9a84c] text-[#0f0e0c] hover:bg-[#e0c070]'
                      : 'bg-[#272420] text-[#f0ebe0] hover:bg-[#2e2b25] border border-[#3e3830]'
                  }`}
                >
                  Get started
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-[#6e6050] mt-6">
            Start free — 10 messages included with no credit card. Upgrade when you&apos;re ready.
          </p>
        </AnimatedSection>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-20 bg-[#0a0908]">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#f0ebe0] mb-10">
            From people who found their answers
          </h2>
          <div className="space-y-4">
            {[
              {
                text: 'I was spiraling at midnight with no one to talk to. Vigil helped me organize my thoughts and realize I actually had three patterns of evidence I\'d dismissed individually. Within a week, I had my answer.',
                author: 'Anonymous — used Vigil for 2 weeks',
              },
              {
                text: 'I was genuinely afraid I was being paranoid. Vigil told me honestly that most of what I\'d found was explainable. That clarity alone was worth the $10.',
                author: 'Anonymous — used Vigil for 3 days',
              },
              {
                text: 'The confrontation prep was everything. I knew exactly what to say, how to handle denial, and what to do after. I wasn\'t blindsided by anything.',
                author: 'Anonymous — used Vigil for 6 weeks',
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-[#1e1c18] rounded-2xl border border-[#2e2b25]"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-[#c9a84c] fill-[#c9a84c]" />
                  ))}
                </div>
                <p className="text-[#b8a98a] text-sm leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                <p className="text-xs text-[#6e6050]">{t.author}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <section className="px-5 py-20 bg-[#0f0e0c]">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#f0ebe0] mb-10">
            Common questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is this legal?',
                a: 'Yes. Vigil only guides you through legal evidence-gathering methods. It will never advise accessing someone\'s phone, accounts, or installing spy software. All guidance is ethical and legal.',
              },
              {
                q: 'Who can see my conversations?',
                a: 'No one. Your conversations are private and encrypted. We don\'t read them, we don\'t share them, and we never will. You can also delete your account and all data at any time.',
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
                a: 'Yes. Cancel from your account settings at any moment. No questions asked, no hassle.',
              },
              {
                q: 'Is there a human on the other end?',
                a: 'No — Vigil is an AI powered by Claude. It\'s not a human therapist or PI. It won\'t replace professional help, but it\'s available when they aren\'t.',
              },
            ].map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-[#1e1c18] border border-[#2e2b25] rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-[#f0ebe0] list-none">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-[#b8a98a] group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-4 text-sm text-[#b8a98a] leading-relaxed border-t border-[#2e2b25] pt-3">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Privacy section */}
      <section className="px-5 py-16 bg-[#0a0908]">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-[#c9a84c]" />
            <span className="text-[#c9a84c] font-medium text-sm uppercase tracking-wider">Privacy First</span>
          </div>
          <h2 className="text-2xl font-bold text-[#f0ebe0] mb-4">
            Your secret is safe here.
          </h2>
          <p className="text-[#b8a98a] leading-relaxed max-w-lg mx-auto mb-8">
            We handle your situation with the same discretion a trusted friend would. No real name needed. No data sold — ever. Delete everything instantly at any time.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Lock className="w-4 h-4" />, label: 'Encrypted data' },
              { icon: <Eye className="w-4 h-4" />, label: 'Zero analytics on content' },
              { icon: <Shield className="w-4 h-4" />, label: 'Anonymous option' },
              { icon: <FileText className="w-4 h-4" />, label: 'Instant deletion' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-3 bg-[#1e1c18] rounded-xl border border-[#2e2b25]">
                <div className="text-[#c9a84c]">{item.icon}</div>
                <span className="text-xs text-[#b8a98a] text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-24 bg-[#0f0e0c]">
        <AnimatedSection className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0ebe0] mb-4 leading-tight">
            You deserve to know the truth.
          </h2>
          <p className="text-[#b8a98a] mb-8 text-lg leading-relaxed">
            Start your investigation free — no credit card, no commitment. Just answers.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f0e0c] px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#e0c070] transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.3)] active:scale-95"
          >
            Start your investigation
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-xs text-[#6e6050]">
            10 free messages. No credit card. Cancel anytime.
          </p>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 border-t border-[#2e2b25] bg-[#0a0908]">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-sm font-medium text-[#b8a98a]">VIGIL</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#6e6050]">
            <Link href="/pricing" className="hover:text-[#b8a98a] transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-[#b8a98a] transition-colors">Sign in</Link>
            <span>© 2026 Vigil</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
