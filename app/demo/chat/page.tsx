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
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
        content: "I'm Vigil. I'm here, and I'm listening.\n\nBefore we begin — everything you share stays between us. I don't judge, I don't take sides, and I won't tell you what to feel. My job is to help you see clearly.\n\nTell me: what made you reach out today? Start from wherever feels right.",
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

  // Auto-extract evidence from user messages
  const autoExtractEvidence = (text: string) => {
    const lower = text.toLowerCase()
    const suggestions: Array<{ type: EvidenceType; description: string; significance_level: SignificanceLevel }> = []

    // Phone/digital evidence
    if (/phone|password|lock|app|social media|instagram|snapchat|tinder|bumble|hidden|deleted|notification/i.test(lower)) {
      suggestions.push({
        type: 'digital',
        description: text.slice(0, 200),
        significance_level: /password|tinder|bumble|hidden|deleted/.test(lower) ? 'high' : 'medium',
      })
    }

    // Schedule evidence
    if (/late|overtime|work trip|meeting|gym|schedule|tuesday|thursday|weekend|absent|gone/i.test(lower)) {
      suggestions.push({
        type: 'schedule',
        description: text.slice(0, 200),
        significance_level: /every|always|never before|suddenly/.test(lower) ? 'high' : 'medium',
      })
    }

    // Financial evidence
    if (/charge|credit card|bank|withdrawal|cash|restaurant|hotel|receipt|purchase|subscription|venmo/i.test(lower)) {
      suggestions.push({
        type: 'financial',
        description: text.slice(0, 200),
        significance_level: /hotel|unknown|unexplained|didn.t recognize/.test(lower) ? 'critical' : 'high',
      })
    }

    // Communication evidence
    if (/text|call|whisper|hang up|leave room|contact|dm|message|deleted/i.test(lower)) {
      suggestions.push({
        type: 'communication',
        description: text.slice(0, 200),
        significance_level: /whisper|deleted|secret|hidden/.test(lower) ? 'high' : 'medium',
      })
    }

    // Behavioral evidence
    if (/gift|flower|guilt|defensive|angry|shower|cologne|perfume|gym|appearance|weight|clothes/i.test(lower)) {
      suggestions.push({
        type: 'behavioral',
        description: text.slice(0, 200),
        significance_level: /guilt|defensive|angry|gaslight/.test(lower) ? 'high' : 'medium',
      })
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
