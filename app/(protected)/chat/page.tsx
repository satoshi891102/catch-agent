'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Eye, Lock, ArrowRight, Plus, Paperclip } from 'lucide-react'
import Link from 'next/link'
import type { ChatMessage } from '@/lib/types'
import { FREE_MESSAGE_LIMIT } from '@/lib/types'

interface ConversationState {
  id: string | null
  messages: ChatMessage[]
  messageCount: number
  isPaid: boolean
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 message-enter">
      <div className="w-7 h-7 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
        <Eye className="w-3.5 h-3.5 text-[#c9a84c]" />
      </div>
      <div className="bg-[#272420] rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#b8a98a] typing-dot" />
          <div className="w-2 h-2 rounded-full bg-[#b8a98a] typing-dot" />
          <div className="w-2 h-2 rounded-full bg-[#b8a98a] typing-dot" />
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex items-end gap-2 message-enter ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center shrink-0 mb-0.5">
          <Eye className="w-3.5 h-3.5 text-[#c9a84c]" />
        </div>
      )}
      <div
        className={`max-w-[82%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-[#c9a84c]/12 border border-[#c9a84c]/20 rounded-tr-sm text-[#f0ebe0]'
            : 'bg-[#272420] rounded-bl-sm text-[#f0ebe0]'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p className="text-[10px] mt-1 text-[#6e6050]">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

function UpgradePrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-4 p-5 bg-[#c9a84c]/8 border border-[#c9a84c]/25 rounded-2xl text-center"
    >
      <div className="w-10 h-10 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-3">
        <Lock className="w-5 h-5 text-[#c9a84c]" />
      </div>
      <h3 className="font-semibold text-[#f0ebe0] mb-1">Your investigation continues</h3>
      <p className="text-sm text-[#b8a98a] mb-4">
        You&apos;ve used your 10 free messages. To continue, choose a plan — starting at $9.99/week.
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f0e0c] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e0c070] transition-all"
      >
        View plans
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  )
}

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: "I'm here, and I'm listening.\n\nTell me what's been happening. What first made you feel like something was off? Start wherever feels right — there's no wrong answer, and nothing you share will be judged.",
  timestamp: new Date().toISOString(),
}

export default function ChatPage() {
  const [state, setState] = useState<ConversationState>({
    id: null,
    messages: [WELCOME_MESSAGE],
    messageCount: 0,
    isPaid: false,
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Load existing conversation on mount
  useEffect(() => {
    const loadConversation = async () => {
      try {
        const res = await fetch('/api/conversation')
        if (res.ok) {
          const data = await res.json()
          if (data.messages?.length > 0) {
            setState(prev => ({
              ...prev,
              id: data.id,
              messages: data.messages,
              messageCount: data.messageCount,
              isPaid: data.isPaid,
            }))
          } else {
            setState(prev => ({
              ...prev,
              messageCount: data.messageCount || 0,
              isPaid: data.isPaid || false,
            }))
          }
        }
      } catch {
        // Start fresh
      } finally {
        setInitialLoading(false)
      }
    }
    loadConversation()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [state.messages, loading, scrollToBottom])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const canSend = state.isPaid || state.messageCount < FREE_MESSAGE_LIMIT
  const isLimitReached = !state.isPaid && state.messageCount >= FREE_MESSAGE_LIMIT

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading || !canSend) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }))
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversation_id: state.id,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: err.error || 'Something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        }
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
        }))
        return
      }

      const data = await res.json()
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      }

      setState(prev => ({
        ...prev,
        id: data.conversation_id || prev.id,
        messages: [...prev.messages, assistantMessage],
        messageCount: data.message_count,
        isPaid: !data.requires_subscription,
      }))
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I\'m having trouble connecting. Please check your connection and try again.',
        timestamp: new Date().toISOString(),
      }
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (initialLoading) {
    return (
      <div className="md:pl-56 h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
          <p className="text-sm text-[#6e6050]">Loading your case...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="md:pl-56 flex flex-col h-screen">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1814]/95 backdrop-blur-md border-b border-[#2e2b25] mt-12 md:mt-0 shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center">
          <Eye className="w-4 h-4 text-[#c9a84c]" />
        </div>
        <div>
          <div className="text-sm font-semibold text-[#f0ebe0]">Vigil</div>
          <div className="text-xs text-[#4ade80] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block" />
            Active — your conversation is private
          </div>
        </div>
        {!state.isPaid && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-[#6e6050]">
              {Math.max(0, FREE_MESSAGE_LIMIT - state.messageCount)} free left
            </span>
            <Link
              href="/pricing"
              className="text-xs bg-[#c9a84c]/10 border border-[#c9a84c]/25 text-[#c9a84c] px-2.5 py-1 rounded-full hover:bg-[#c9a84c]/20 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-4">
        <AnimatePresence initial={false}>
          {state.messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <MessageBubble message={msg} />
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TypingIndicator />
          </motion.div>
        )}

        {isLimitReached && !loading && <UpgradePrompt />}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-[#2e2b25] bg-[#1a1814]/95 backdrop-blur-md px-4 py-3 mb-14 md:mb-0">
        {isLimitReached ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Lock className="w-4 h-4 text-[#6e6050]" />
            <span className="text-sm text-[#6e6050]">Upgrade to continue</span>
            <Link href="/pricing" className="text-sm text-[#c9a84c] hover:text-[#e0c070] font-medium">
              View plans
            </Link>
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-[#272420] border border-[#2e2b25] rounded-2xl px-4 py-3 flex items-end gap-2 focus-within:border-[#c9a84c]/30 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell Vigil what you've noticed..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#f0ebe0] placeholder:text-[#6e6050] resize-none focus:outline-none leading-relaxed max-h-[120px] min-h-[20px]"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading || !canSend}
              className="w-10 h-10 rounded-full bg-[#c9a84c] flex items-center justify-center hover:bg-[#e0c070] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4 text-[#0f0e0c]" />
            </button>
          </div>
        )}
        <p className="text-[10px] text-[#6e6050] text-center mt-2">
          Vigil provides guidance only. Always consult a professional for legal or mental health matters.
        </p>
      </div>
    </div>
  )
}
