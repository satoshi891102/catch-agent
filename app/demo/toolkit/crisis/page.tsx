'use client'

import Link from 'next/link'
import { ArrowLeft, Phone, Heart, Shield, AlertTriangle, ExternalLink } from 'lucide-react'

const hotlines = [
  {
    region: 'United States',
    resources: [
      { name: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988', available: '24/7', type: 'crisis' },
      { name: 'National Domestic Violence Hotline', contact: '1-800-799-7233 (text START to 88788)', available: '24/7', type: 'dv' },
      { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7', type: 'crisis' },
      { name: 'RAINN Sexual Assault Hotline', contact: '1-800-656-4673', available: '24/7', type: 'dv' },
    ],
  },
  {
    region: 'South Africa',
    resources: [
      { name: 'SADAG Depression & Anxiety', contact: '0800 567 567', available: '24/7', type: 'crisis' },
      { name: 'Lifeline SA', contact: '0861 322 322', available: '24/7', type: 'crisis' },
      { name: 'People Opposing Women Abuse (POWA)', contact: '011 642 4345', available: 'Office hours', type: 'dv' },
      { name: 'Childline SA', contact: '0800 055 555', available: '24/7', type: 'crisis' },
      { name: 'GBV Command Centre', contact: '0800 428 428', available: '24/7', type: 'dv' },
    ],
  },
  {
    region: 'United Kingdom',
    resources: [
      { name: 'Samaritans', contact: '116 123', available: '24/7', type: 'crisis' },
      { name: 'National Domestic Abuse Helpline', contact: '0808 2000 247', available: '24/7', type: 'dv' },
      { name: 'SHOUT Crisis Text Line', contact: 'Text SHOUT to 85258', available: '24/7', type: 'crisis' },
    ],
  },
  {
    region: 'International',
    resources: [
      { name: 'International Association for Suicide Prevention', contact: 'https://www.iasp.info/resources/Crisis_Centres/', available: 'Directory', type: 'crisis' },
      { name: 'Befrienders Worldwide', contact: 'https://www.befrienders.org', available: 'Directory', type: 'crisis' },
    ],
  },
]

const typeColors: Record<string, string> = {
  crisis: 'text-red-400 bg-red-400/10 border-red-400/20',
  dv: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
}

const supportTypes = [
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Therapy & Counseling',
    desc: 'Professional support for relationship trauma',
    items: [
      'BetterHelp — online therapy, same-day sessions available',
      'Talkspace — text, audio, or video therapy',
      'Psychology Today therapist finder — filter by "infidelity" specialty',
      'Ask your GP for a referral to a relationship counselor',
    ],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Support Groups',
    desc: 'You\'re not alone in this',
    items: [
      'r/survivinginfidelity — Reddit community (200K+ members)',
      'SurvivingInfidelity.com — moderated forums with structured support',
      'BAN (Beyond Affairs Network) — in-person groups internationally',
      'Local support groups — search "infidelity support group [your city]"',
    ],
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'If You\'re in Danger',
    desc: 'Safety first, always',
    items: [
      'Call your local emergency number (911 / 10111 / 999 / 112)',
      'Go to a friend, family member, or neighbor you trust',
      'If you can\'t call, text — most crisis lines accept texts',
      'Have a go-bag ready: ID, charger, cash, medication, important documents',
      'Tell someone you trust where you are',
    ],
  },
]

export default function CrisisResourcesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-8 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/demo/toolkit" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Crisis Resources</h1>
          <p className="text-sm text-[var(--text-muted)]">Hotlines, support, and professional help</p>
        </div>
      </div>

      {/* Emergency banner */}
      <div className="mb-6 p-4 bg-red-500/8 border border-red-500/25 rounded-xl">
        <p className="text-sm font-semibold text-red-400 mb-1">If you&apos;re in immediate danger</p>
        <p className="text-sm text-[var(--text-secondary)]">
          Call your local emergency number now. Your safety is more important than anything on this page.
        </p>
      </div>

      {/* Hotlines by region */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-[var(--vigil-gold)]" />
          Crisis Hotlines
        </h2>
        <div className="space-y-6">
          {hotlines.map((region, ri) => (
            <div key={ri}>
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{region.region}</h3>
              <div className="space-y-2">
                {region.resources.map((resource, rsi) => (
                  <div key={rsi} className="vigil-card p-3.5 flex items-start gap-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 mt-0.5 ${typeColors[resource.type]}`}>
                      {resource.type === 'crisis' ? 'CRISIS' : 'DV'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{resource.name}</p>
                      <p className="text-sm text-[var(--vigil-gold)] font-mono mt-0.5">
                        {resource.contact.startsWith('http') ? (
                          <a href={resource.contact} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                            Visit directory <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : resource.contact}
                      </p>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] shrink-0">{resource.available}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support types */}
      <div className="space-y-6">
        {supportTypes.map((type, ti) => (
          <div key={ti}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[var(--vigil-gold)]">{type.icon}</span>
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">{type.title}</h2>
                <p className="text-xs text-[var(--text-muted)]">{type.desc}</p>
              </div>
            </div>
            <div className="vigil-card p-4">
              <ul className="space-y-2.5">
                {type.items.map((item, ii) => (
                  <li key={ii} className="text-sm text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
                    <span className="text-[var(--vigil-gold)] mt-1.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 vigil-card text-center">
        <p className="text-sm text-[var(--text-secondary)] mb-1">Remember</p>
        <p className="text-sm text-[var(--text-primary)] font-medium">
          Asking for help is not weakness. It&apos;s the bravest thing you can do.
        </p>
      </div>
    </div>
  )
}
