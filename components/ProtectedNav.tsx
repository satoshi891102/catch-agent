'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Eye, MessageSquare, LayoutDashboard, FileText, CreditCard, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'Investigate', icon: MessageSquare },
  { href: '/evidence', label: 'Evidence', icon: FileText },
  { href: '/pricing', label: 'Upgrade', icon: CreditCard },
]

export default function ProtectedNav({ userId: _ }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar (hidden on mobile) */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 bg-[#1a1814] border-r border-[#2e2b25] flex-col z-40">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-[#2e2b25]">
          <Eye className="w-4 h-4 text-[#c9a84c]" />
          <span className="font-semibold text-[#f0ebe0] tracking-wide text-sm">VIGIL</span>
        </div>
        <div className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? 'bg-[#c9a84c]/10 text-[#c9a84c] font-medium'
                    : 'text-[#b8a98a] hover:bg-[#272420] hover:text-[#f0ebe0]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
        <div className="px-3 py-4 border-t border-[#2e2b25]">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6e6050] hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {loggingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#1a1814]/95 backdrop-blur-md border-b border-[#2e2b25]">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#c9a84c]" />
          <span className="font-semibold text-[#f0ebe0] tracking-wide text-sm">VIGIL</span>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 text-[#b8a98a] hover:text-[#f0ebe0] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative ml-auto w-64 bg-[#1a1814] border-l border-[#2e2b25] flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#2e2b25]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#c9a84c]" />
                <span className="font-semibold text-sm">VIGIL</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 text-[#6e6050] hover:text-[#f0ebe0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4 px-3 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                      active
                        ? 'bg-[#c9a84c]/10 text-[#c9a84c] font-medium'
                        : 'text-[#b8a98a] hover:bg-[#272420] hover:text-[#f0ebe0]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
            <div className="px-3 py-4 border-t border-[#2e2b25]">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-[#6e6050] hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                {loggingOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav (mobile only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a1814]/95 backdrop-blur-md border-t border-[#2e2b25] flex items-center justify-around px-2 py-2">
        {navItems.map(item => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                active ? 'text-[#c9a84c]' : 'text-[#6e6050]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
