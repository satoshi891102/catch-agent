'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const passwordStrength = () => {
    if (password.length === 0) return null
    if (password.length < 6) return 'weak'
    if (password.length < 10) return 'fair'
    return 'strong'
  }

  const strength = passwordStrength()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      setSuccess(true)
      // Auto-redirect after email confirmation would be handled by the callback
      // For now, redirect to dashboard (Supabase handles email verification)
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnonymous = async () => {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInAnonymously()
      if (authError) {
        setError(authError.message)
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[var(--vigil-gold)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Account created</h2>
          <p className="text-sm text-[var(--text-secondary)]">Taking you to your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <Eye className="w-5 h-5 text-[var(--vigil-gold)]" />
          <span className="font-semibold text-[var(--text-primary)] tracking-wide">VIGIL</span>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6">
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">Start your investigation</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-2">10 free messages, no credit card required.</p>

          <div className="flex items-center gap-1.5 mb-6 p-2.5 bg-[var(--vigil-gold)]/5 border border-[var(--vigil-gold)]/15 rounded-xl">
            <Lock className="w-3.5 h-3.5 text-[var(--vigil-gold)] shrink-0" />
            <p className="text-xs text-[var(--text-secondary)]">No real name required. 100% private.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--vigil-gold)]/50 focus:ring-1 focus:ring-[var(--vigil-gold)]/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-3 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--vigil-gold)]/50 focus:ring-1 focus:ring-[var(--vigil-gold)]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {strength && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 flex-1">
                    {['weak', 'fair', 'strong'].map((level, i) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          (strength === 'weak' && i === 0) ||
                          (strength === 'fair' && i <= 1) ||
                          (strength === 'strong' && i <= 2)
                            ? strength === 'weak'
                              ? 'bg-red-400'
                              : strength === 'fair'
                              ? 'bg-amber-400'
                              : 'bg-green-400'
                            : 'bg-[var(--border-default)]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${
                    strength === 'weak' ? 'text-red-400' :
                    strength === 'fair' ? 'text-amber-400' : 'text-green-400'
                  }`}>
                    {strength}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--vigil-gold)] text-[var(--bg-primary)] py-3 rounded-xl font-semibold text-sm hover:bg-[var(--vigil-gold-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[var(--bg-primary)]/30 border-t-[var(--bg-primary)] rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[var(--border-default)]" />
            <span className="text-xs text-[var(--text-muted)]">or start without an account</span>
            <div className="flex-1 h-px bg-[var(--border-default)]" />
          </div>

          <button
            onClick={handleAnonymous}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] py-3 rounded-xl text-sm font-medium hover:bg-[var(--border-default)] hover:text-[var(--text-primary)] transition-all disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            Continue anonymously
          </button>
          <p className="text-xs text-[var(--text-muted)] text-center mt-2">
            No email, no name. Completely private.
          </p>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6 px-4">
          By creating an account, you agree that you will only use Vigil for lawful purposes.
        </p>
        <p className="text-center text-sm text-[var(--text-muted)] mt-3">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--vigil-gold)] hover:text-[var(--vigil-gold-light)] transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
