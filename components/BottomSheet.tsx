'use client'

import { useEffect, useState } from 'react'
import { Project } from '@/types/database'

type ProjectWithProfile = Project & {
  profiles?: { username: string; display_name: string } | null
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return url }
}

function getScreenshotUrl(url: string) {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=640&h=400`
}

function thumbnailColor(str: string) {
  const colors = [
    ['#1e3a5f', '#3b82f6'],
    ['#1e3b2f', '#22c55e'],
    ['#3b1e2f', '#f43f5e'],
    ['#3b2e1e', '#f59e0b'],
    ['#2e1e3b', '#a855f7'],
    ['#1e2e3b', '#06b6d4'],
    ['#3b3b1e', '#eab308'],
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function BottomSheet({
  project,
  open,
  onClose,
}: {
  project: ProjectWithProfile
  open: boolean
  onClose: () => void
}) {
  const domain = getDomain(project.url)
  const [bg, accent] = thumbnailColor(project.url)
  const isClaimed = !!project.owner_id
  const [imgFailed, setImgFailed] = useState(false)
  const screenshotUrl = project.screenshot_url || getScreenshotUrl(project.url)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative bg-[#0f1117] rounded-t-2xl border border-white/[0.1] border-b-0 max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideUp 0.25s cubic-bezier(0.32,0.72,0,1)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Preview area */}
        <div
          className="mx-4 mt-2 rounded-xl h-48 flex items-center justify-center overflow-hidden relative"
          style={{ background: `linear-gradient(135deg, ${bg} 0%, ${bg}66 100%)` }}
        >
          {!imgFailed ? (
            <img
              src={screenshotUrl}
              alt={project.name}
              className="w-full h-full object-cover object-top"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <span className="text-5xl font-bold opacity-20" style={{ color: accent }}>
                {domain.slice(0, 2).toUpperCase()}
              </span>
              <span className="text-xs text-white/30">{domain}</span>
            </div>
          )}
          {/* PDPA disclaimer for scraped */}
          {project.source === 'scraped' && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-2">
              <p className="text-[10px] text-amber-400/80 leading-tight">
                ข้อมูลนี้รวบรวมจากคอมเมนต์สาธารณะใน Facebook
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white leading-tight">{project.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{domain}</p>
            </div>
            {!isClaimed && (
              <span className="shrink-0 text-xs px-2 py-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 font-medium">
                unclaimed
              </span>
            )}
          </div>

          {project.description && project.description !== domain && (
            <p className="text-sm text-gray-400 mt-3 leading-relaxed line-clamp-3">{project.description}</p>
          )}

          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs px-2 py-1 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.06]">
              {project.category}
            </span>
            {project.scraped_by && (
              <span className="text-xs text-gray-500">by {project.scraped_by}</span>
            )}
            {isClaimed && project.profiles && (
              <a href={`/u/${project.profiles.username}`} className="text-xs text-blue-400 hover:underline">
                @{project.profiles.username}
              </a>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className="px-4 py-4 flex flex-col gap-3">
          {!project.is_active ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-sm text-red-400">site unavailable</span>
            </div>
          ) : (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fetch(`/api/projects/${project.id}/view`, { method: 'POST' })}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white font-medium text-sm hover:bg-white/[0.1] transition-colors"
            >
              เปิดเว็บ
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          {isClaimed && project.profiles ? (
            <a
              href={`/u/${project.profiles.username}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-medium text-sm hover:bg-blue-500/20 transition-colors"
            >
              ดูโปรไฟล์
            </a>
          ) : (
            <a
              href={`/claim?url=${encodeURIComponent(project.url)}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-medium text-sm hover:bg-amber-400/20 transition-colors"
            >
              นี่คือโปรเจกต์ของคุณ? Claim it →
            </a>
          )}
        </div>

        {/* Safe area */}
        <div className="h-6" />
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
