import { Suspense } from 'react'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Nav from '@/components/Nav'
import FilterBar from '@/components/FilterBar'
import ProjectCard from '@/components/ProjectCard'
import Pagination from '@/components/Pagination'
import { Project } from '@/types/database'

type ProjectWithProfile = Project & {
  profiles: { username: string; display_name: string } | null
}

const PAGE_SIZE = 24

type SearchParams = {
  q?: string
  cat?: string
  sort?: string
  page?: string
}

async function getStats() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('stats_cache').select('key, value')
  const map: Record<string, number> = {}
  ;(data as { key: string; value: number }[] | null)?.forEach(row => { map[row.key] = row.value })
  return map
}

async function getProjects(params: SearchParams) {
  const supabase = await createServerSupabaseClient()
  const page = Math.max(1, Number(params.page ?? 1))
  const offset = (page - 1) * PAGE_SIZE
  const q = params.q?.trim() ?? ''
  const cat = params.cat ?? ''
  const sort = params.sort ?? 'hot'

  let query = supabase
    .from('projects')
    .select('*, profiles(username, display_name)', { count: 'exact' })

  if (cat) query = query.eq('category', cat)

  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,scraped_by.ilike.%${q}%`)
  }

  if (sort === 'az') {
    query = query.order('name', { ascending: true })
  } else {
    query = query
      .order('owner_id', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
  }

  const { data, count } = await query.range(offset, offset + PAGE_SIZE - 1)
  return { projects: (data ?? []) as unknown as ProjectWithProfile[], total: count ?? 0 }
}

export default async function GalleryPage({ searchParams }: { searchParams: SearchParams }) {
  const [stats, { projects, total }] = await Promise.all([
    getStats(),
    getProjects(searchParams),
  ])

  const isEmpty = total === 0

  return (
    <div className="min-h-screen bg-[#07080f] text-white">
      <Nav />

      {/* Hero */}
      <section className="pt-28 pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            สิ่งที่คนไทย<br />
            <span className="text-amber-400">สร้างด้วย AI</span>
          </h1>
          <p className="mt-3 text-gray-400 text-sm sm:text-base leading-relaxed">
            พอร์ตโฟลิโอสำหรับ vibe coders ไทย · claim โปรเจกต์ของคุณ · แชร์ผลงาน
          </p>
          <div className="mt-6 flex gap-6">
            {[
              { key: 'total_projects', label: 'projects' },
              { key: 'total_builders', label: 'builders' },
              { key: 'total_categories', label: 'categories' },
            ].map(({ key, label }) => (
              <div key={key}>
                <div className="text-2xl sm:text-3xl font-bold tabular-nums">
                  {stats[key] ?? 0}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-700 mt-1">updated daily</p>
        </div>
      </section>

      {/* Filters */}
      <Suspense>
        <FilterBar />
      </Suspense>

      {/* Grid / List */}
      <main className="max-w-7xl mx-auto px-0 sm:px-6 pt-6 pb-4">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <svg className="w-12 h-12 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-medium text-gray-400">ไม่พบโปรเจกต์ที่ค้นหา</p>
            <p className="text-sm text-gray-600 mt-1">
              ลองค้นหาด้วยคำอื่น หรือโปรเจกต์ของคุณยังไม่ได้อยู่ในระบบ?
            </p>
            <Link
              href="/submit"
              className="mt-6 px-5 py-2.5 rounded-xl bg-amber-400 text-gray-950 font-semibold text-sm hover:bg-amber-300 transition-colors"
            >
              + submit โปรเจกต์ของคุณ
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop grid */}
            <div className="hidden sm:grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {/* Submit CTA card */}
              <Link
                href="/submit"
                className="rounded-xl border-2 border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-2 min-h-[180px] text-gray-600 hover:text-gray-400 hover:border-white/20 transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">+</span>
                <span className="text-xs text-center leading-tight px-4">submit your<br />project</span>
              </Link>
            </div>

            {/* Mobile list */}
            <div className="sm:hidden border-t border-white/[0.06]">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Pagination */}
      <Suspense>
        <Pagination total={total} pageSize={PAGE_SIZE} />
      </Suspense>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-700">
          <span>built with <span className="text-amber-400/70">Claude</span></span>
          <span>vibeth.app</span>
        </div>
      </footer>
    </div>
  )
}
