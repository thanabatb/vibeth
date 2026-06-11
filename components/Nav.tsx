'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function Nav() {
  const [user, setUser] = useState<null | { id: string }>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#07080f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-lg tracking-tight text-white">
            Vibe<span className="text-amber-400">TH</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <Link
              href="/dashboard"
              className="text-sm px-3 min-h-[44px] inline-flex items-center rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              dashboard
            </Link>
          ) : (
            <Link
              href="/auth"
              className="text-sm px-3 min-h-[44px] inline-flex items-center rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              sign in
            </Link>
          )}
          <Link
            href="/submit"
            className="text-sm px-3 min-h-[44px] inline-flex items-center rounded-lg bg-amber-400 text-gray-950 font-semibold hover:bg-amber-300 transition-colors"
          >
            + submit project
          </Link>
        </nav>
      </div>
    </header>
  )
}
