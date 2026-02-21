'use client'

import { useState, useRef, useEffect } from 'react'
import { Eye, Send, ArrowLeft, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SEEDED_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: "I'm Vigil. I'm here, and I'm listening.\n\nBefore we begin — everything you share stays between us. I don't judge, I don't take sides, and I won't tell you what to feel. My job is to help you see clearly.\n\nTell me: what made you reach out today? Start from wherever feels right.",
    timestamp: new Date(Date.now() - 45 * 60000),
  },
  {
    role: 'user',
    content: "Something's been off with my husband for about 3 weeks now. He's coming home late, always says it's work meetings. But he never used to work late. And he changed his phone password without saying anything.",
    timestamp: new Date(Date.now() - 43 * 60000),
  },
  {
    role: 'assistant',
    content: "Three weeks — that's a specific starting point, and specificity matters in these situations. Let me ask a few things to build the picture:\n\n**The late nights:** Is it random, or the same days each week? And roughly how late — an hour, two hours, more?\n\n**The phone password:** Did he mention it at all, or did you just discover it was different? Had he ever changed it before without telling you?\n\n**Your gut feeling:** On a scale of 1-10, where 1 is \"I'm probably overreacting\" and 10 is \"I'm almost certain something is happening\" — where are you right now?",
    timestamp: new Date(Date.now() - 41 * 60000),
  },
  {
    role: 'user',
    content: "It's mostly Tuesdays and Thursdays. He gets home around 9pm instead of 6. The phone thing — I tried to use his phone to look something up and it didn't work. He said he \"updated it for security.\" He's never done that before in 3 years.\n\nMy gut? I'd say 7.",
    timestamp: new Date(Date.now() - 38 * 60000),
  },
  {
    role: 'assistant',
    content: "A 7 is significant. That's not paranoia — that's pattern recognition.\n\nLet me tell you what stands out to me:\n\n**🔴 The schedule pattern.** Tuesdays and Thursdays specifically — not random. Consistent recurring \"late nights\" on the same days suggests a recurring commitment, not unpredictable work demands.\n\n**🔴 The phone behavior.** The timing of the password change alongside the schedule change is notable. \"Updated it for security\" is a common deflection — most people don't spontaneously upgrade phone security during an otherwise normal month.\n\n**🟡 Three weeks ago.** Something may have started approximately 3 weeks ago. Think back — did anything else change around that time? New gym routine? New colleague mentioned? Mood shift?\n\nI'm going to open your case file now. Based on what you've told me, here's my initial assessment:\n\n**Suspicion Level: Moderate**\nYou have two correlated behavioral changes with a clear timeline. That's worth investigating further.\n\n**Recommended next step:** I'd like to walk you through Module A — Digital Behavior. There are specific things to look for that don't require touching his phone. Want to start there?",
    timestamp: new Date(Date.now() - 35 * 60000),
  },
]

const FREE_LIMIT = 10
const DEMO_MESSAGE_COUNT = 3 // user has sent 3 messages already

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[var(--vigil-gold)]/12 border border-[var(--vigil-gold)]/25 flex items-center justify-center shrink-0 mb-0.5">
          <Eye className="w-3.5 h-3.5 text-[var(--vigil-gold)]" />
        </div>
      )}
      <div
        className={`max-w-[82%] px-4 py-3 ${
          isUser
            ? 'bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/20 rounded-2xl rounded-br-sm text-[var(--text-primary)]'
            : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl rounded-bl-sm text-[var(--text-primary)]'
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap prose-vigil" dangerouslySetInnerHTML={{
          __html: message.content
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)] font-semibold">$1</strong>')
            .replace(/\n/g, '<br />')
        }} />
        <p className="text-[10px] mt-1.5 text-[var(--text-dim)]">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-7 h-7 rounded-full bg-[var(--vigil-gold)]/12 border border-[var(--vigil-gold)]/25 flex items-center justify-center shrink-0">
        <Eye className="w-3.5 h-3.5 text-[var(--vigil-gold)]" />
      </div>
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] typing-dot" />
          <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] typing-dot" />
          <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] typing-dot" />
        </div>
      </div>
    </div>
  )
}

export default function DemoChatPage() {
  const [messages, setMessages] = useState<Message[]>(SEEDED_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userMsgCount, setUserMsgCount] = useState(DEMO_MESSAGE_COUNT)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    if (userMsgCount >= FREE_LIMIT) return

    const userMsg: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setUserMsgCount(prev => prev + 1)
    setIsTyping(true)

    // Call the real AI backend
    try {
      const response = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.content || data.message || "I'm sorry, I had trouble processing that. Could you rephrase?",
          timestamp: new Date(),
        }])
      } else {
        // Fallback response if API fails
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Thank you for sharing that. Let me think about what you've described and how it connects to the other patterns we've identified.\n\nIn my experience, the combination of behavioral changes you're seeing — especially the consistency of the timing — is worth paying attention to. Can you tell me more about how he acts when he gets home on those late nights? Is he distant, overly cheerful, or does he go straight to shower?",
          timestamp: new Date(),
        }])
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "That's an important detail. Let me add it to your case file.\n\nHere's what I'd suggest as a next step: over the next few days, pay attention to his phone behavior specifically around the times he's about to leave for these \"late meetings.\" Does he check it more often? Does he take it to the bathroom? Does he angle the screen away?\n\nThese small signals often form a pattern that's hard to see day-by-day but becomes clear when you track it. Want me to walk you through what to look for?",
        timestamp: new Date(),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const remainingMsgs = FREE_LIMIT - userMsgCount
  const hitPaywall = userMsgCount >= FREE_LIMIT

  return (
    <div className="flex flex-col h-[100dvh] md:h-screen">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] shrink-0">
        <Link href="/demo" className="md:hidden text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-[var(--vigil-gold)]/12 border border-[var(--vigil-gold)]/25 flex items-center justify-center">
          <Eye className="w-4 h-4 text-[var(--vigil-gold)]" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-[var(--text-primary)]">Vigil</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Active · Investigating
          </div>
        </div>
        <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-card)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)]">
          {remainingMsgs > 0 ? `${remainingMsgs} msgs left` : 'Limit reached'}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}

        {/* Paywall overlay */}
        {hitPaywall && (
          <div className="mx-auto max-w-sm p-6 bg-[var(--vigil-gold)]/[0.06] border border-[var(--vigil-gold)]/25 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--vigil-gold)]/12 border border-[var(--vigil-gold)]/25 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-[var(--vigil-gold)]" />
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">Your investigation continues</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              You&apos;ve used your 10 free messages. Upgrade to continue working with Vigil — starting at $9.99/week.
            </p>
            <Link
              href="/pricing"
              className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 text-sm"
            >
              View plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
        {hitPaywall ? (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-[var(--text-muted)]">
            <Lock className="w-3.5 h-3.5" />
            <Link href="/pricing" className="text-[var(--vigil-gold)] hover:text-[var(--vigil-gold-light)] font-medium">
              Upgrade to continue
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Tell Vigil what you've noticed..."
              disabled={isTyping}
              className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-full px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--vigil-gold)]/40 focus:ring-1 focus:ring-[var(--vigil-gold)]/15 transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="btn-gold w-10 h-10 flex items-center justify-center rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
