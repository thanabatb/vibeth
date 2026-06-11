// Daily stats cache update — Phase 2
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [{ count: totalProjects }, { count: totalBuilders }, { count: totalCategories }] =
    await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
    ])

  const now = new Date().toISOString()
  await Promise.all([
    supabase.from('stats_cache').upsert({ key: 'total_projects', value: totalProjects ?? 0, updated_at: now }),
    supabase.from('stats_cache').upsert({ key: 'total_builders', value: totalBuilders ?? 0, updated_at: now }),
    supabase.from('stats_cache').upsert({ key: 'total_categories', value: totalCategories ?? 0, updated_at: now }),
  ])

  return NextResponse.json({ ok: true })
}
