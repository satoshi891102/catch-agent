'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, MessageSquare, LayoutDashboard, FileText, CreditCard, LogOut, Shield } from 'lucide-react'

const navItems = [
  { href: '/demo', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/demo/chat', icon: MessageSquare, label: 'Investigation Chat' },
  { href: '/demo/evidence', icon: FileText, label: 'Evidence Log' },
  { href: '/demo/toolkit', icon: Shield, label: 'Confrontation Toolkit' },
]

const mobileNavItems = [
  { href: '/demo', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/demo/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/demo/evidence', icon: FileText, label: 'Evidence' },
  { href: '/demo/toolkit', icon: Shield, label: 'Toolkit' },
]

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Mobile top bar — hidden on chat page via CSS (chat has own header) */}
      <nav id="demo-topbar" className="md:hidden flex items-center justify-between px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--vigil-gold)]/10 border border-[var(--vigil-gold)]/20 flex items-center justify-center">
            <Eye className="w-3.5 h-3.5 text-[var(--vigil-gold)]" />
          </div>
          <span className="label-sm text-[var(--text-primary)] tracking-[0.12em]">VIGIL</span>
        </div>
        <span className="label-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/15">DEMO</span>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 h-[60px] pb-[env(safe-area-inset-bottom)] bg-[var(--bg-primary)]/95 backdrop-blur-xl border-t border-[var(--border-subtle)]">
        {mobileNavItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive ? 'text-[var(--vigil-gold)]' : 'text-[var(--text-muted)] hover:text-[var(--vigil-gold)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-px left-2 right-2 h-[2px] bg-[var(--vigil-gold)] rounded-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 flex-col bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)] z-40">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="w-8 h-8 rounded-lg bg-[var(--vigil-gold)]/8 border border-[var(--vigil-gold)]/15 flex items-center justify-center">
            <Eye className="w-4 h-4 text-[var(--vigil-gold)]" />
          </div>
          <span className="label-sm text-[var(--text-primary)] tracking-[0.12em]">VIGIL</span>
          <span className="label-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/15 ml-auto">DEMO</span>
        </div>

        <div className="flex-1 px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                  isActive
                    ? 'text-[var(--vigil-gold)] bg-[var(--vigil-gold)]/6 font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[var(--vigil-gold)] rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="px-3 pb-5 space-y-1">
          <Link
            href="/pricing"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[var(--vigil-gold)] hover:bg-[var(--vigil-gold)]/5 transition-all font-medium"
          >
            <CreditCard className="w-4 h-4" />
            Upgrade Plan
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </aside>

      <main className="flex-1 md:pl-56 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
