// PDPA 30-day deletion cron — Phase 5
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .not('deletion_requested_at', 'is', null)
    .lt('deletion_requested_at', thirtyDaysAgo)

  const profileList = (profiles ?? []) as { id: string }[]
  if (!profileList.length) {
    return NextResponse.json({ ok: true, deleted: 0 })
  }

  for (const profile of profileList) {
    await supabase.auth.admin.deleteUser(profile.id)
  }

  return NextResponse.json({ ok: true, deleted: profileList.length })
}
