import Link from 'next/link'
import { Eye, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/25 flex items-center justify-center mx-auto mb-5">
          <Eye className="w-7 h-7 text-[var(--vigil-gold)]" />
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">404</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          This page doesn&apos;t exist. But Vigil does.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-ghost inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            Back to home
          </Link>
          <Link
            href="/demo/chat"
            className="btn-gold inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            Start investigation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
