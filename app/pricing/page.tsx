'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { CheckCircle, Eye, ArrowLeft, Shield, Lock, Zap, Star } from 'lucide-react'

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const plans = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 9.99,
    period: '/week',
    badge: 'Start Immediately',
    description: 'For when you need answers NOW. Cancel any week.',
    features: [
      'Unlimited conversations with Vigil',
      'Full case file system',
      'Module A: Digital Behavior analysis',
      'Module B: Schedule & Routine',
      'Evidence tracking & timeline',
      'Pattern analysis',
      'Daily check-in prompts',
    ],
    cta: 'Start Weekly — $9.99',
    highlighted: false,
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 29.99,
    period: '/month',
    badge: 'Best Value',
    description: 'For thorough investigations. Saves $10 vs weekly.',
    features: [
      'Everything in Weekly',
      'Module C: Financial Red Flags',
      'Module D: Communication Patterns',
      'Module E: Emotional & Physical Changes',
      'Confrontation Toolkit',
      'Legal Preparation Guide',
      'Exit Planning Module',
    ],
    cta: 'Start Monthly — $29.99',
    highlighted: true,
  },
  {
    id: 'confrontation',
    name: 'Confrontation Pack',
    price: 49.99,
    period: 'one-time',
    badge: 'When You\'re Ready',
    description: 'The complete playbook. Lifetime access.',
    features: [
      'Complete confrontation scripts',
      'Recording laws by state & country',
      'Evidence organization for legal use',
      'Safety planning template',
      'Attorney consultation prep guide',
      'Aftermath framework',
      'Lifetime access — no subscription',
    ],
    cta: 'Get Confrontation Pack — $49.99',
    highlighted: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleCheckout = async (planId: string) => {
    setLoading(planId)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          success_url: `${window.location.origin}/dashboard?upgraded=true`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (res.status === 401) {
          window.location.href = `/login?redirect=/pricing`
          return
        }
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch {
      setError('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-6 py-16">
      <div className="max-w-4xl mx-auto">

        <Link
          href="/demo"
          className="inline-flex items-center gap-2 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--vigil-gold)]/8 border border-[var(--vigil-gold)]/15 flex items-center justify-center">
              <Eye className="w-4 h-4 text-[var(--vigil-gold)]" />
            </div>
            <span className="label-sm text-[var(--text-primary)] tracking-[0.15em]">VIGIL</span>
          </div>
          <h1 className="display-lg text-[var(--text-primary)] mb-4">
            Your investigation starts here.
          </h1>
          <p className="text-[15px] text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
            A private investigator costs $2,000–5,000. Vigil starts at $9.99/week.
            No judgment, no appointment, available at 2am.
          </p>
        </motion.div>

        {error && (
          <div className="max-w-lg mx-auto mb-8 p-4 bg-red-500/8 border border-red-500/15 rounded-xl">
            <p className="text-[13px] text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {plans.map((plan, i) => (
            <FadeIn key={plan.id} delay={i * 0.08}>
              <div
                className={`relative flex flex-col p-7 rounded-2xl border h-full ${
                  plan.highlighted
                    ? 'bg-[var(--vigil-gold)]/[0.04] border-2 border-[var(--vigil-gold)]/30 shadow-glow md:scale-[1.03]'
                    : 'vigil-card'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--vigil-gold)] text-[var(--bg-primary)] label-xs px-4 py-1.5 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <span className={`inline-block label-xs px-2.5 py-1 rounded-md border mb-3 ${
                    plan.highlighted
                      ? 'text-[var(--vigil-gold)] bg-[var(--vigil-gold)]/8 border-[var(--vigil-gold)]/15'
                      : 'text-[var(--text-muted)] bg-[var(--bg-elevated)] border-[var(--border-subtle)]'
                  }`}>
                    {plan.badge}
                  </span>
                  <div className="text-3xl font-bold text-[var(--text-primary)]">
                    ${plan.price}
                    <span className="text-[13px] font-normal text-[var(--text-muted)]">{plan.period}</span>
                  </div>
                  <div className="text-[15px] font-semibold text-[var(--text-primary)] mt-1">{plan.name}</div>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-2 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[13px]">
                      <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        plan.highlighted ? 'text-[var(--vigil-gold)]' : 'text-[var(--vigil-gold)]/60'
                      }`} />
                      <span className="text-[var(--text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 rounded-xl font-semibold text-[13px] transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'btn-gold'
                      : 'bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {loading === plan.id ? (
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      {plan.cta}
                    </>
                  )}
                </motion.button>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Free tier reminder */}
        <div className="max-w-lg mx-auto text-center mb-12">
          <p className="text-[13px] text-[var(--text-muted)]">
            Not ready? You still have free messages available.{' '}
            <Link href="/demo/chat" className="text-[var(--vigil-gold)] hover:text-[var(--vigil-gold-light)] transition-colors">
              Continue for free →
            </Link>
          </p>
        </div>

        {/* Trust */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { icon: <Lock className="w-4 h-4" />, title: 'Secure checkout', desc: 'Powered by Stripe' },
            { icon: <Shield className="w-4 h-4" />, title: 'Cancel anytime', desc: 'No lock-in' },
            { icon: <Eye className="w-4 h-4" />, title: '100% private', desc: 'Your data is yours' },
            { icon: <Star className="w-4 h-4" />, title: 'Instant access', desc: 'Start right away' },
          ].map((item, i) => (
            <div key={i} className="vigil-card flex flex-col items-center gap-1.5 p-5 text-center">
              <div className="text-[var(--vigil-gold)]">{item.icon}</div>
              <div className="text-[12px] font-medium text-[var(--text-primary)]">{item.title}</div>
              <div className="text-[11px] text-[var(--text-muted)]">{item.desc}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-[var(--text-muted)] mt-10 max-w-md mx-auto leading-relaxed">
          By subscribing, you agree to our <Link href="/terms" className="text-[var(--vigil-gold)] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[var(--vigil-gold)] hover:underline">Privacy Policy</Link>. Vigil provides guidance only — not legal, medical, or professional investigative advice.
        </p>
      </div>
    </div>
  )
}
