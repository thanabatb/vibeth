'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'

const CATEGORIES = [
  { slug: '', label: 'ทั้งหมด' },
  { slug: 'tools', label: 'เครื่องมือ' },
  { slug: 'education', label: 'การศึกษา' },
  { slug: 'business', label: 'ธุรกิจ' },
  { slug: 'finance', label: 'การเงิน' },
  { slug: 'food', label: 'อาหาร' },
  { slug: 'health', label: 'สุขภาพ' },
  { slug: 'entertainment', label: 'บันเทิง' },
  { slug: 'productivity', label: 'ประสิทธิภาพ' },
  { slug: 'creative', label: 'ความคิดสร้างสรรค์' },
  { slug: 'ecommerce', label: 'อีคอมเมิร์ซ' },
  { slug: 'social', label: 'สังคม' },
  { slug: 'travel', label: 'ท่องเที่ยว' },
  { slug: 'real-estate', label: 'อสังหาริมทรัพย์' },
  { slug: 'hr', label: 'ทรัพยากรบุคคล' },
  { slug: 'other', label: 'อื่นๆ' },
]

const SORTS = [
  { value: 'hot', label: '🔥 hot' },
  { value: 'new', label: 'new' },
  { value: 'az', label: 'a–z' },
]

export default function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const q = searchParams.get('q') ?? ''
  const cat = searchParams.get('cat') ?? ''
  const sort = searchParams.get('sort') ?? 'hot'

  const push = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v)
        else params.delete(k)
      })
      params.delete('page')
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="sticky top-14 z-40 bg-[#07080f]/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">
        {/* Search + Sort row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={e => push({ q: e.target.value })}
              placeholder="ค้นหาโปรเจกต์หรือชื่อผู้สร้าง..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white/[0.05] border border-white/[0.08] rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07] transition-all"
            />
          </div>

          {/* Sort tabs */}
          <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1 ml-auto">
            {SORTS.map(s => (
              <button
                key={s.value}
                onClick={() => push({ sort: s.value })}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                  sort === s.value
                    ? 'bg-amber-400 text-gray-950'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pills-scroll pb-1">
          {CATEGORIES.map(c => (
            <button
              key={c.slug}
              onClick={() => push({ cat: c.slug })}
              className={`shrink-0 px-3 py-1 text-xs rounded-full border transition-all ${
                cat === c.slug
                  ? 'bg-amber-400 border-amber-400 text-gray-950 font-semibold'
                  : 'border-white/[0.1] text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
