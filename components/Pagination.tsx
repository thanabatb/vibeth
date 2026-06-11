'use client'

import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'

export default function Pagination({ total, pageSize }: { total: number; pageSize: number }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentPage = Number(searchParams.get('page') ?? 1)
  const totalPages = Math.ceil(total / pageSize)

  if (totalPages <= 1) return null

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) params.delete('page')
    else params.set('page', String(page))
    const qs = params.toString()
    return `${pathname}${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="flex items-center justify-center gap-4 py-10">
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.1] text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          prev
        </Link>
      ) : (
        <span className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 text-sm cursor-not-allowed select-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          prev
        </span>
      )}

      <span className="text-sm text-gray-500 tabular-nums">
        page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white font-medium">{totalPages}</span>
      </span>

      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.1] text-gray-300 text-sm hover:border-white/30 hover:text-white transition-colors"
        >
          next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 text-sm cursor-not-allowed select-none">
          next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </div>
  )
}
