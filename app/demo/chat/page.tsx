'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Eye, Send, ArrowLeft, Lock, ArrowRight, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import {
  getDemoUser,
  getDemoConversation,
  addMessageToConversation,
  incrementMessageCount,
  getDemoCaseFile,
  createDemoCaseFile,
  getDemoEvidence,
  addDemoEvidence,
  updateCaseFromState,
  resetDemoData,
} from '@/lib/demo-store'
import type { ChatMessage, EvidenceType, SignificanceLevel } from '@/lib/types'
import { FREE_MESSAGE_LIMIT } from '@/lib/types'

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  // Simple markdown-like formatting
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[var(--text-primary)]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<span class="block pl-3 border-l-2 border-[var(--vigil-gold)]/20 my-1">$1</span>')
      .replace(/\n/g, '<br />')
  }

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
            ? 'bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/20 rounded-2xl rounded-br-sm'
            : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl rounded-bl-sm'
        }`}
      >
        <div
          className="text-sm leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />
        <p className="text-[10px] mt-1.5 text-[var(--text-dim)]">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

function CrisisBanner({ type, onDismiss }: { type: 'suicide' | 'dv' | 'harm'; onDismiss: () => void }) {
  const resources = {
    suicide: {
      title: 'You matter. Help is available right now.',
      lines: [
        '988 Suicide & Crisis Lifeline — call or text 988 (US)',
        'Crisis Text Line — text HOME to 741741',
        'SADAG (South Africa) — 0800 567 567',
        'International Association for Suicide Prevention — https://www.iasp.info/resources/Crisis_Centres/',
      ],
      color: 'red',
    },
    dv: {
      title: 'Your safety comes first.',
      lines: [
        'National DV Hotline — 1-800-799-7233 (text START to 88788)',
        'People Opposing Women Abuse (SA) — 011 642 4345',
        'If you\'re in immediate danger, call emergency services.',
      ],
      color: 'orange',
    },
    harm: {
      title: 'Let\'s pause here.',
      lines: [
        'Vigil helps you find the truth — not plan revenge or harm.',
        'If you\'re feeling overwhelmed, talking to a professional can help.',
        'BetterHelp / Talkspace offer immediate online therapy.',
      ],
      color: 'amber',
    },
  }

  const r = resources[type]
  const borderColor = type === 'suicide' ? 'border-red-500/30 bg-red-500/8' : type === 'dv' ? 'border-orange-500/30 bg-orange-500/8' : 'border-amber-500/30 bg-amber-500/8'
  const titleColor = type === 'suicide' ? 'text-red-400' : type === 'dv' ? 'text-orange-400' : 'text-amber-400'

  return (
    <div className={`mx-2 p-4 border rounded-xl ${borderColor}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={`text-sm font-semibold ${titleColor}`}>{r.title}</p>
        <button onClick={onDismiss} className="text-[var(--text-muted)] text-xs shrink-0 hover:text-[var(--text-secondary)]">✕</button>
      </div>
      <ul className="space-y-1.5">
        {r.lines.map((line, i) => (
          <li key={i} className="text-xs text-[var(--text-secondary)] leading-relaxed">• {line}</li>
        ))}
      </ul>
    </div>
  )
}

function EvidencePrompt({ evidence, onAccept, onDismiss }: {
  evidence: { type: EvidenceType; description: string; significance_level: SignificanceLevel }
  onAccept: () => void
  onDismiss: () => void
}) {
  return (
    <div className="mx-2 p-3 bg-[var(--vigil-gold)]/[0.06] border border-[var(--vigil-gold)]/20 rounded-xl">
      <p className="text-xs text-[var(--vigil-gold)] font-medium mb-1.5">Evidence detected — add to case file?</p>
      <p className="text-sm text-[var(--text-secondary)] mb-3">{evidence.description}</p>
      <div className="flex gap-2">
        <button onClick={onAccept} className="btn-gold text-xs px-3 py-1.5">Add to evidence</button>
        <button onClick={onDismiss} className="text-xs text-[var(--text-muted)] px-3 py-1.5">Dismiss</button>
      </div>
    </div>
  )
}

export default function DemoChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [isPaid] = useState(false) // Demo is always free tier
  const [isLoaded, setIsLoaded] = useState(false)
  const [pendingEvidence, setPendingEvidence] = useState<Array<{
    type: EvidenceType
    description: string
    significance_level: SignificanceLevel
  }>>([])
  const [crisisBanner, setCrisisBanner] = useState<'suicide' | 'dv' | 'harm' | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Hide the layout top bar on mobile — chat has its own header
  useEffect(() => {
    const topbar = document.getElementById('demo-topbar')
    if (topbar) topbar.style.display = 'none'
    return () => {
      if (topbar) topbar.style.display = ''
    }
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    const conv = getDemoConversation()
    const user = getDemoUser()
    setMessages(conv.messages)
    setMessageCount(user.message_count)
    setIsLoaded(true)

    // If no messages yet, send Vigil's opening message
    if (conv.messages.length === 0) {
      const openingMsg: ChatMessage = {
        role: 'assistant',
        content: "I'm Vigil. I'm here — and whatever brought you here at this hour, I want you to know: you're not crazy for looking.\n\nEverything you share stays between us. I won't judge you, I won't rush you, and I won't tell you what to feel. My job is to help you see clearly when everything feels foggy.\n\nTell me what's been happening. Start wherever feels right — there's no wrong place to begin.",
        timestamp: new Date().toISOString(),
      }
      addMessageToConversation(openingMsg)
      setMessages([openingMsg])
    }
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, pendingEvidence])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return
    if (!isPaid && messageCount >= FREE_MESSAGE_LIMIT) return

    const userMsg: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    // Add to local state + storage
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    addMessageToConversation(userMsg)
    setInput('')

    const newCount = incrementMessageCount()
    setMessageCount(newCount)

    // Create case file after first message if none exists
    if (!getDemoCaseFile()) {
      createDemoCaseFile()
    }

    setIsTyping(true)

    try {
      // Send to AI with full conversation context
      // Send case context so AI has full picture
      const currentCase = getDemoCaseFile()
      const currentEvidence = getDemoEvidence()

      const response = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          caseFile: currentCase,
          evidence: currentEvidence,
          messageCount: newCount,
        }),
      })

      let replyContent: string

      if (response.ok) {
        const data = await response.json()
        replyContent = data.content || "I'm sorry, I had trouble processing that. Could you try again?"
      } else {
        // Fallback response
        replyContent = "Thank you for sharing that. Let me think about what you've described.\n\nBased on what you've told me so far, I'd like to understand the timeline better. Can you walk me through when you first noticed something was different? The more specific you can be about dates and changes, the clearer the picture becomes."
      }

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, aiMsg])
      addMessageToConversation(aiMsg)

      // Update case file based on new state
      updateCaseFromState()

      // Check for crisis language
      detectCrisis(userMsg.content)

      // Check for evidence-like content in user message
      autoExtractEvidence(userMsg.content)

    } catch {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting right now, but I'm still here. Could you try sending that again?",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMsg])
      addMessageToConversation(errorMsg)
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }, [input, isTyping, isPaid, messageCount, messages])

  // Detect crisis language and show appropriate resources
  const detectCrisis = (text: string) => {
    const lower = text.toLowerCase()
    if (/\b(kill\s*(my)?self|suicid|end\s*(it|my\s*life)|don'?t\s*want\s*to\s*(live|be\s*alive|exist)|rather\s*(be\s*dead|die)|no\s*reason\s*to\s*live)\b/i.test(lower)) {
      setCrisisBanner('suicide')
    } else if (/\b(hit(s|ting)?\s*me|beat(s|ing)?\s*me|afraid\s*(of|he|she)|threaten|choke|strangle|violent|abuse|hurt(s|ing)?\s*me|scared\s*(of|for\s*my\s*life))\b/i.test(lower)) {
      setCrisisBanner('dv')
    } else if (/\b(kill\s*(him|her|them)|hurt\s*(him|her|them)|revenge|destroy\s*(him|her|their\s*life)|make\s*(him|her|them)\s*(pay|suffer)|ruin)\b/i.test(lower)) {
      setCrisisBanner('harm')
    }
  }

  // Auto-extract evidence from user messages
  // Requires compound signals — not single generic keywords
  const autoExtractEvidence = (text: string) => {
    const lower = text.toLowerCase()
    const words = lower.split(/\s+/).length
    const suggestions: Array<{ type: EvidenceType; description: string; significance_level: SignificanceLevel }> = []

    // Skip very short messages — not enough context
    if (words < 8) return

    // Digital evidence — require compound signals (action + subject)
    const digitalHigh = /changed?.{0,20}password|new.{0,15}lock|tinder|bumble|hinge|grindr|hidden.{0,15}app|deleted?.{0,15}message|secret.{0,15}(app|folder|account)|vault.{0,10}app|calculator\+|face.?down|screen.{0,10}(tilt|away|hide)/i
    const digitalMed = /(phone|device).{0,30}(never|always|won't let|doesn't let|protective|guarded)|(always|suddenly).{0,20}(face.?down|silent|airplane|bathroom)/i
    if (digitalHigh.test(lower)) {
      suggestions.push({ type: 'digital', description: text.slice(0, 200), significance_level: 'high' })
    } else if (digitalMed.test(lower)) {
      suggestions.push({ type: 'digital', description: text.slice(0, 200), significance_level: 'medium' })
    }

    // Schedule evidence — require pattern language, not just days of week
    const scheduleHigh = /(suddenly|recently|started|never.{0,10}before|didn't.{0,10}use.?to).{0,30}(overtime|late|work trip|business trip|gone|disappear|absent)/i
    const scheduleMed = /(unaccounted|can't.{0,10}explain|doesn't add up|story.{0,15}(change|different|match)|where.{0,15}(was|were|been))/i
    if (scheduleHigh.test(lower)) {
      suggestions.push({ type: 'schedule', description: text.slice(0, 200), significance_level: 'high' })
    } else if (scheduleMed.test(lower)) {
      suggestions.push({ type: 'schedule', description: text.slice(0, 200), significance_level: 'medium' })
    }

    // Financial evidence — require suspicious context, not just "credit card"
    const financialCritical = /hotel.{0,30}(charge|receipt|bill|reservation)|unknown.{0,20}(charge|transaction|withdrawal)|unexplained.{0,20}(expense|charge|purchase)|restaurant.{0,20}(didn't|never|wasn't)/i
    const financialHigh = /(secret|hidden|separate|new).{0,20}(account|credit.?card|bank)|cash.{0,20}(only|withdrawal|atm).{0,30}(unexplained|unusual|sudden)|venmo.{0,20}(unknown|don't.{0,10}know)/i
    if (financialCritical.test(lower)) {
      suggestions.push({ type: 'financial', description: text.slice(0, 200), significance_level: 'critical' })
    } else if (financialHigh.test(lower)) {
      suggestions.push({ type: 'financial', description: text.slice(0, 200), significance_level: 'high' })
    }

    // Communication evidence — require suspicious context
    const commHigh = /(whisper|leave.{0,10}room|hang.{0,5}up|step.{0,10}(outside|away)).{0,30}(call|phone|text)|(deleted?|erased?|cleared?).{0,20}(text|message|chat|thread|conversation|history)|second.{0,10}(phone|sim|device)/i
    const commMed = /(constant|always|excessive).{0,20}(text|message|dm|chat).{0,30}(stop|hide|when i)|(new|unfamiliar|generic).{0,20}(contact|name|number)/i
    if (commHigh.test(lower)) {
      suggestions.push({ type: 'communication', description: text.slice(0, 200), significance_level: 'high' })
    } else if (commMed.test(lower)) {
      suggestions.push({ type: 'communication', description: text.slice(0, 200), significance_level: 'medium' })
    }

    // Behavioral evidence — require change/pattern language
    const behavioralHigh = /(gaslight|guilt.{0,10}(trip|gift)|over.?compensat|accus.{0,10}(me|snooping)|turn.{0,10}(it|things).{0,10}(around|on me))/i
    const behavioralMed = /(suddenly|recently|started|never.{0,10}before).{0,30}(gym|cologne|perfume|clothes|grooming|appearance|weight|shower)|new.{0,20}(interest|music|show|restaurant).{0,30}(never|didn't|don't)/i
    if (behavioralHigh.test(lower)) {
      suggestions.push({ type: 'behavioral', description: text.slice(0, 200), significance_level: 'high' })
    } else if (behavioralMed.test(lower)) {
      suggestions.push({ type: 'behavioral', description: text.slice(0, 200), significance_level: 'medium' })
    }

    // Only show one suggestion at a time (the highest priority)
    if (suggestions.length > 0) {
      const sorted = suggestions.sort((a, b) => {
        const levels = { critical: 4, high: 3, medium: 2, low: 1 }
        return levels[b.significance_level] - levels[a.significance_level]
      })
      setPendingEvidence([sorted[0]])
    }
  }

  const handleAcceptEvidence = (idx: number) => {
    const item = pendingEvidence[idx]
    if (item) {
      addDemoEvidence(item)
      updateCaseFromState()
    }
    setPendingEvidence(prev => prev.filter((_, i) => i !== idx))
  }

  const handleDismissEvidence = (idx: number) => {
    setPendingEvidence(prev => prev.filter((_, i) => i !== idx))
  }

  const handleReset = () => {
    if (confirm('This will clear your entire investigation. Are you sure?')) {
      resetDemoData()
      window.location.reload()
    }
  }

  const remainingMsgs = FREE_MESSAGE_LIMIT - messageCount
  const hitPaywall = !isPaid && messageCount >= FREE_MESSAGE_LIMIT

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-[var(--vigil-gold)]/30 border-t-[var(--vigil-gold)] rounded-full animate-spin" />
      </div>
    )
  }

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
            Active · Phase {getDemoCaseFile()?.phase || 1}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-card)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)]">
            {remainingMsgs > 0 ? `${remainingMsgs} msgs left` : 'Limit reached'}
          </div>
          <button
            onClick={handleReset}
            className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1"
            title="Reset investigation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Crisis banner */}
        {crisisBanner && (
          <CrisisBanner type={crisisBanner} onDismiss={() => setCrisisBanner(null)} />
        )}

        {/* Evidence prompts */}
        {pendingEvidence.map((evidence, i) => (
          <EvidencePrompt
            key={i}
            evidence={evidence}
            onAccept={() => handleAcceptEvidence(i)}
            onDismiss={() => handleDismissEvidence(i)}
          />
        ))}

        {/* Paywall */}
        {hitPaywall && (
          <div className="mx-auto max-w-sm p-6 bg-[var(--vigil-gold)]/[0.06] border border-[var(--vigil-gold)]/25 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--vigil-gold)]/12 border border-[var(--vigil-gold)]/25 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-[var(--vigil-gold)]" />
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">Your investigation continues</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              You&apos;ve used your 10 free messages. Upgrade to continue — starting at $9.99/week.
            </p>
            <Link href="/pricing" className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 text-sm">
              View plans <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips — show when few messages and not typing */}
      {!isTyping && !hitPaywall && messages.length <= 3 && messages.length > 0 && (
        <div className="shrink-0 px-4 py-2 flex flex-wrap gap-2">
          {(messageCount === 0 ? [
            'My partner changed their phone password recently',
            'They\'ve been coming home late from work',
            'I found charges I don\'t recognize',
            'They\'re being defensive when I ask questions',
          ] : messageCount <= 2 ? [
            'It started about 2-3 weeks ago',
            'We\'ve been together for 5 years',
            'There are other things I\'ve noticed too',
            'Am I overreacting?',
          ] : []).map((suggestion, i) => (
            <button
              key={i}
              onClick={() => { setInput(suggestion); inputRef.current?.focus() }}
              className="text-xs px-3 py-1.5 rounded-full bg-[var(--vigil-gold)]/[0.06] border border-[var(--vigil-gold)]/15 text-[var(--text-secondary)] hover:bg-[var(--vigil-gold)]/10 hover:text-[var(--vigil-gold)] transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
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
