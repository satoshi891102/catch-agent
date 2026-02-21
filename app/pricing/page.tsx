'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Eye, ArrowLeft, Shield, Lock, Zap, Star } from 'lucide-react'

const plans = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 9.99,
    period: '/week',
    badge: 'Start Immediately',
    badgeColor: 'text-[#b8a98a] bg-[#272420] border-[#2e2b25]',
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
    badgeColor: 'text-[#0f0e0c] bg-[#c9a84c] border-[#c9a84c]',
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
    badgeColor: 'text-[#b8a98a] bg-[#272420] border-[#2e2b25]',
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
    <div className="min-h-screen bg-[#0f0e0c] px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#6e6050] hover:text-[#b8a98a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-[#c9a84c]" />
            <span className="font-semibold text-[#f0ebe0] tracking-wide">VIGIL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#f0ebe0] mb-3">
            Your investigation starts here.
          </h1>
          <p className="text-[#b8a98a] max-w-lg mx-auto">
            A private investigator costs $2,000–5,000. Vigil starts at $9.99/week.
            No judgment, no appointment, available at 2am.
          </p>
        </motion.div>

        {error && (
          <div className="max-w-lg mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Comparison */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-10 text-center">
          {[
            { label: 'Private Investigator', cost: '$2,000–5,000', icon: '👤' },
            { label: 'Vigil Monthly', cost: '$29.99', icon: '🔮', highlight: true },
            { label: 'Vigil Weekly', cost: '$9.99', icon: '⚡' },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border text-center ${
                item.highlight
                  ? 'bg-[#c9a84c]/8 border-[#c9a84c]/30'
                  : 'bg-[#1e1c18] border-[#2e2b25]'
              }`}
            >
              <div className="text-lg mb-1">{item.icon}</div>
              <div className={`text-sm font-bold ${item.highlight ? 'text-[#c9a84c]' : 'text-[#f0ebe0]'}`}>
                {item.cost}
              </div>
              <div className="text-[10px] text-[#6e6050]">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-6 rounded-2xl border ${
                plan.highlighted
                  ? 'bg-[#c9a84c]/6 border-[#c9a84c]/40 shadow-[0_0_40px_rgba(201,168,76,0.1)]'
                  : 'bg-[#1e1c18] border-[#2e2b25]'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c9a84c] text-[#0f0e0c] text-xs font-bold px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border mb-3 ${plan.badgeColor}`}>
                  {plan.badge}
                </span>
                <div className="text-2xl font-bold text-[#f0ebe0]">
                  ${plan.price}
                  <span className="text-sm font-normal text-[#b8a98a]">{plan.period}</span>
                </div>
                <div className="text-base font-semibold text-[#f0ebe0] mt-0.5">{plan.name}</div>
                <p className="text-sm text-[#b8a98a] mt-2 leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${
                      plan.highlighted ? 'text-[#c9a84c]' : 'text-[#6e6050]'
                    }`} />
                    <span className="text-[#b8a98a]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'bg-[#c9a84c] text-[#0f0e0c] hover:bg-[#e0c070] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]'
                    : 'bg-[#272420] border border-[#3e3830] text-[#f0ebe0] hover:bg-[#2e2b25]'
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
              </button>
            </motion.div>
          ))}
        </div>

        {/* Free tier reminder */}
        <div className="max-w-lg mx-auto text-center mb-10">
          <p className="text-sm text-[#6e6050]">
            Not ready? You still have free messages available.{' '}
            <Link href="/chat" className="text-[#c9a84c] hover:text-[#e0c070]">
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
            <div key={i} className="flex flex-col items-center gap-1 p-3 bg-[#1e1c18] border border-[#2e2b25] rounded-xl text-center">
              <div className="text-[#c9a84c]">{item.icon}</div>
              <div className="text-xs font-medium text-[#f0ebe0]">{item.title}</div>
              <div className="text-[10px] text-[#6e6050]">{item.desc}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#6e6050] mt-8 max-w-md mx-auto">
          By subscribing, you agree to our Terms of Service. Vigil provides guidance only — not legal, medical, or professional investigative advice. Users are responsible for compliance with local laws.
        </p>
      </div>
    </div>
  )
}
