import { Eye } from 'lucide-react'

export default function DemoLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--vigil-gold)]/8 border border-[var(--vigil-gold)]/15 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Eye className="w-6 h-6 text-[var(--vigil-gold)]" />
        </div>
        <p className="label-xs text-[var(--text-muted)]">VIGIL</p>
      </div>
    </div>
  )
}
