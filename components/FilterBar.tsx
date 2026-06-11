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

function FlameIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline-block" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>
  )
}

const SORTS = [
  { value: 'hot', label: 'hot', icon: true },
  { value: 'new', label: 'new', icon: false },
  { value: 'az', label: 'a–z', icon: false },
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
                className={`flex items-center gap-1.5 px-3 min-h-[36px] text-xs rounded-md font-medium transition-all ${
                  sort === s.value
                    ? 'bg-amber-400 text-gray-950'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {s.icon && <FlameIcon />}
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
              className={`shrink-0 px-3 min-h-[36px] text-xs rounded-full border transition-all ${
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
