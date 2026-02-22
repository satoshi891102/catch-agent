'use client'

import Link from 'next/link'
import { ArrowLeft, Heart, ChevronRight } from 'lucide-react'

const sections = [
  {
    title: 'Before the Conversation',
    items: [
      {
        heading: 'Ground yourself first',
        content: 'Before confronting your partner, make sure you\'re not in crisis mode. Eat something. Sleep on it for at least one night. If you\'re shaking, crying uncontrollably, or rage-filled — wait. The truth will still be there tomorrow.',
      },
      {
        heading: 'Write down what you know',
        content: 'Put your evidence on paper (or in your evidence log here). Seeing it written out helps separate facts from feelings. You\'ll need this clarity during the conversation, because emotions WILL cloud your thinking.',
      },
      {
        heading: 'Decide your goal',
        content: 'What do you actually want from this conversation? The truth? An apology? To leave? To understand why? Know your goal before you start. If you don\'t, you\'ll get pulled into their narrative instead of pursuing yours.',
      },
      {
        heading: 'Prepare for every outcome',
        content: 'They might confess. They might deny everything. They might cry. They might get angry. They might blame you. They might leave. Sit with each scenario for 5 minutes. Feel what you\'d feel. Then you won\'t be blindsided.',
      },
    ],
  },
  {
    title: 'During the Conversation',
    items: [
      {
        heading: 'Breathe. Literally.',
        content: 'When your heart rate goes above 100bpm, your prefrontal cortex (rational brain) starts shutting down. You\'ll say things you regret. If you feel yourself escalating: pause, breathe 4 counts in, 7 counts out. Repeat until you can think clearly.',
      },
      {
        heading: 'Stay on your evidence',
        content: 'Don\'t let the conversation drift to "you never..." or "you always..." Keep coming back to specific evidence. "On Tuesday the 4th, there was a hotel charge. I need to understand that." Specific. Factual. Calm.',
      },
      {
        heading: 'Don\'t reveal everything at once',
        content: 'Present one piece of evidence at a time. Let them respond. Their explanation (or lack thereof) for one thing often contradicts their story about another. This is how investigators work — and it\'s how you\'ll get to the truth.',
      },
      {
        heading: 'Their reaction IS information',
        content: 'Pay attention to HOW they react, not just WHAT they say. Defensive escalation, turning it around on you, crying to avoid the question, anger at being "accused" — these are all data points. Note them.',
      },
    ],
  },
  {
    title: 'After the Conversation',
    items: [
      {
        heading: 'You don\'t need to decide now',
        content: 'Whatever they said — confession or denial — you don\'t owe an immediate decision. "I need time to process this" is a complete sentence. Don\'t let anyone rush you.',
      },
      {
        heading: 'Write down what happened',
        content: 'Within an hour of the conversation, write down everything that was said. Your memory of it will change with time. The version you write down tonight is the most accurate one you\'ll ever have.',
      },
      {
        heading: 'Call your person',
        content: 'You need someone who is fully on your side. Not someone who\'ll judge you for staying or leaving. Not someone with opinions about your partner. Someone who will just listen and say "I\'m here." Call them.',
      },
      {
        heading: 'Be gentle with yourself',
        content: 'You\'re going through something genuinely hard. You might not sleep. You might cry for hours. You might feel numb. All of these are normal. You are not broken. You are processing a painful truth.',
      },
    ],
  },
  {
    title: 'Regardless of Outcome',
    items: [
      {
        heading: 'Your feelings are valid',
        content: 'Whether they cheated or not — the fact that you got here means something isn\'t right. That deserves attention. Don\'t let anyone minimize what you\'ve been through.',
      },
      {
        heading: 'Consider professional support',
        content: 'A therapist who specializes in relationship trauma can help you process this in ways that friends and family can\'t. This isn\'t weakness — it\'s the smartest thing you can do for your recovery. BetterHelp and Talkspace offer same-day sessions.',
      },
      {
        heading: 'You will get through this',
        content: 'It doesn\'t feel like it right now. But people get through this every day. You found the courage to investigate. You found the courage to confront. You will find the courage to rebuild — whatever that looks like for you.',
      },
    ],
  },
]

export default function EmotionalPrepPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-8 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/demo/toolkit" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Emotional Preparation</h1>
          <p className="text-sm text-[var(--text-muted)]">Managing your emotions before, during, and after</p>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section, si) => (
          <div key={si}>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-[var(--vigil-gold)]" />
              <h2 className="text-sm font-semibold text-[var(--vigil-gold)] uppercase tracking-wider">{section.title}</h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item, ii) => (
                <div key={ii} className="vigil-card p-4">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{item.heading}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 bg-[var(--vigil-gold)]/[0.04] border border-[var(--vigil-gold)]/20 rounded-2xl text-center">
        <p className="text-sm text-[var(--text-secondary)] mb-3">Need to talk through your specific situation?</p>
        <Link href="/demo/chat" className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-sm">
          Talk to Vigil <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
