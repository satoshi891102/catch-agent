import Link from 'next/link'
import { Eye, MessageSquare, LayoutDashboard, FileText, CreditCard, LogOut } from 'lucide-react'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Mobile top bar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/30 flex items-center justify-center">
            <Eye className="w-3.5 h-3.5 text-[var(--vigil-gold)]" />
          </div>
          <span className="font-semibold text-[var(--text-primary)] tracking-[0.1em] text-sm">VIGIL</span>
        </div>
        <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-medium">DEMO</span>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 bg-[var(--bg-primary)]/95 backdrop-blur-xl border-t border-[var(--border-subtle)]">
        {[
          { href: '/demo', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
          { href: '/demo/chat', icon: <MessageSquare className="w-5 h-5" />, label: 'Chat' },
          { href: '/demo/evidence', icon: <FileText className="w-5 h-5" />, label: 'Evidence' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-[var(--text-muted)] hover:text-[var(--vigil-gold)] transition-colors"
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 flex-col bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)] z-40">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="w-8 h-8 rounded-lg bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/30 flex items-center justify-center">
            <Eye className="w-4 h-4 text-[var(--vigil-gold)]" />
          </div>
          <span className="font-semibold text-[var(--text-primary)] tracking-[0.12em] text-sm">VIGIL</span>
          <span className="text-[10px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium ml-auto">DEMO</span>
        </div>

        <div className="flex-1 px-3 space-y-1">
          {[
            { href: '/demo', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
            { href: '/demo/chat', icon: <MessageSquare className="w-4 h-4" />, label: 'Investigation Chat' },
            { href: '/demo/evidence', icon: <FileText className="w-4 h-4" />, label: 'Evidence Log' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="px-3 pb-4 space-y-1">
          <Link
            href="/pricing"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--vigil-gold)] hover:bg-[var(--vigil-gold)]/5 transition-all font-medium"
          >
            <CreditCard className="w-4 h-4" />
            Upgrade Plan
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </aside>

      <main className="flex-1 md:pl-56 pt-14 md:pt-0 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
