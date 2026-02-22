'use client'

import { Eye, RefreshCw } from 'lucide-react'

export default function DemoError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/25 flex items-center justify-center mx-auto mb-5">
          <Eye className="w-7 h-7 text-[var(--vigil-gold)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
          Vigil encountered an unexpected issue. Your investigation data is safe — it&apos;s stored locally on your device.
        </p>
        <button
          onClick={reset}
          className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </div>
  )
}
