'use client'

import { useState } from 'react'
import { Project } from '@/types/database'
import BottomSheet from './BottomSheet'

type ProjectWithProfile = Project & {
  profiles?: { username: string; display_name: string } | null
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

function getDomain(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return url }
}

// Desktop card (grid view)
function DesktopCard({ project, onClick }: { project: ProjectWithProfile; onClick: () => void }) {
  const [bg, accent] = thumbnailColor(project.url)
  const domain = getDomain(project.url)
  const isClaimed = !!project.owner_id
  const isUnavailable = !project.is_active
  const [imgFailed, setImgFailed] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const screenshotUrl = project.screenshot_url || getScreenshotUrl(project.url)

  return (
    <div
      onClick={onClick}
      className={`group relative bg-[#0f1117] rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 ${
        isClaimed ? 'border-blue-500/30 hover:border-blue-400/50' :
        isUnavailable ? 'border-white/[0.04] opacity-50' :
        'border-white/[0.07] hover:border-white/20'
      }`}
    >
      {/* Thumbnail */}
      <div
        className="h-[110px] flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${bg} 0%, ${bg}88 100%)` }}
      >
        {/* Skeleton shimmer while image loads */}
        {!imgLoaded && !imgFailed && (
          <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />
        )}

        {!imgFailed && (
          <img
            src={screenshotUrl}
            alt={project.name}
            loading="lazy"
            width={640}
            height={400}
            className={`w-full h-full object-cover object-top transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgFailed(true)}
          />
        )}

        {imgFailed && (
          <>
            <span className="text-3xl font-bold opacity-20 select-none" style={{ color: accent }}>
              {domain.slice(0, 2).toUpperCase()}
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] to-transparent opacity-60" />
          </>
        )}

        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <svg className="w-6 h-6 text-red-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        )}

        {/* Tap hint — desktop hover only */}
        <span className="absolute bottom-2 right-2 text-xs text-white/30 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
          tap to preview
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-1 mb-1">
          <p className="text-sm font-medium text-white leading-tight line-clamp-1">{project.name}</p>
          {!isClaimed && !isUnavailable && (
            <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-medium">
              unclaimed
            </span>
          )}
          {isClaimed && (
            <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              claimed
            </span>
          )}
          {isUnavailable && (
            <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
              unavailable
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 truncate">{domain}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-gray-400 border border-white/[0.06]">
            {project.category}
          </span>
          {isClaimed && project.profiles && (
            <span className="text-xs text-blue-400 truncate max-w-[80px]">@{project.profiles.username}</span>
          )}
        </div>
      </div>
    </div>
  )
}

// Mobile list row
function MobileRow({ project, onClick }: { project: ProjectWithProfile; onClick: () => void }) {
  const [bg, accent] = thumbnailColor(project.url)
  const domain = getDomain(project.url)
  const isClaimed = !!project.owner_id
  const isUnavailable = !project.is_active
  const [imgFailed, setImgFailed] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const screenshotUrl = project.screenshot_url || getScreenshotUrl(project.url)

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] active:bg-white/[0.08] cursor-pointer transition-colors ${isUnavailable ? 'opacity-50' : ''}`}
    >
      {/* Thumbnail */}
      <div
        className="w-14 h-14 rounded-lg shrink-0 flex items-center justify-center overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, ${bg}, ${bg}88)` }}
      >
        {/* Skeleton shimmer */}
        {!imgLoaded && !imgFailed && (
          <div className="absolute inset-0 animate-pulse bg-white/[0.05]" />
        )}

        {!imgFailed && (
          <img
            src={screenshotUrl}
            alt={project.name}
            loading="lazy"
            width={640}
            height={400}
            className={`w-full h-full object-cover object-top transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgFailed(true)}
          />
        )}

        {imgFailed && (
          <span className="text-lg font-bold opacity-30" style={{ color: accent }}>
            {domain.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white truncate">{project.name}</p>
          {!isClaimed && !isUnavailable && (
            <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
              unclaimed
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {project.scraped_by || (isClaimed && project.profiles?.display_name) || domain}
        </p>
        <span className="text-xs text-gray-400 mt-0.5 block">{project.category}</span>
      </div>

      {/* Chevron */}
      <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

export default function ProjectCard({ project }: { project: ProjectWithProfile }) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block">
        <DesktopCard project={project} onClick={() => setSheetOpen(true)} />
      </div>
      {/* Mobile */}
      <div className="sm:hidden">
        <MobileRow project={project} onClick={() => setSheetOpen(true)} />
      </div>

      <BottomSheet project={project} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  )
}
