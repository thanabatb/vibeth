/**
 * Seed script — imports 323 scraped projects from claudethweb.netlify.app
 * Run: npx tsx scripts/seed-projects.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env vars. Ensure .env.local is set with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Category mapping: Thai label from source → our slug
const CAT_MAP: Record<string, string> = {
  'เครื่องมือ': 'tools',
  'การศึกษา': 'education',
  'ธุรกิจ': 'business',
  'การเงิน': 'finance',
  'อาหาร': 'food',
  'สุขภาพ': 'health',
  'บันเทิง': 'entertainment',
  'ประสิทธิภาพ': 'productivity',
  'ความคิดสร้างสรรค์': 'creative',
  'อีคอมเมิร์ซ': 'ecommerce',
  'สังคม': 'social',
  'ท่องเที่ยว': 'travel',
  'อสังหาริมทรัพย์': 'real-estate',
  'ทรัพยากรบุคคล': 'hr',
  'อื่นๆ': 'other',
}

function mapCategory(raw: string): string {
  // Source uses "Primary / Secondary" format e.g. "เครื่องมือ / อื่นๆ"
  const parts = raw.split('/').map(s => s.trim())
  for (const part of parts) {
    if (CAT_MAP[part]) return CAT_MAP[part]
  }
  return 'other'
}

function slugify(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
  return `${base}-${index}`
}

function extractName(url: string, desc: string): string {
  // Use domain as project name if desc is just the URL repeated
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
      .replace(/^www\./, '')
    // If desc starts with the domain, use the domain as the name
    if (desc.toLowerCase().startsWith(domain.toLowerCase())) {
      return domain
    }
    // Otherwise use first ~50 chars of desc (strip the domain prefix if present)
    const cleaned = desc.replace(new RegExp(`^${domain}`, 'i'), '').trim()
    const name = (cleaned || domain).slice(0, 60).trim()
    return name || domain
  } catch {
    return desc.slice(0, 60)
  }
}

async function main() {
  console.log('Fetching data from claudethweb.netlify.app...')

  const res = await fetch('https://claudethweb.netlify.app')
  const html = await res.text()

  const match = html.match(/const DATA_INLINE = (\[[\s\S]*?\]);/)
  if (!match) throw new Error('Could not find DATA_INLINE in page source')

  const raw: { url: string; cat: string; desc: string; by: string }[] = JSON.parse(match[1])
  console.log(`Found ${raw.length} projects`)

  const projects = raw.map((item, i) => ({
    slug: slugify(item.url, i),
    name: extractName(item.url, item.desc),
    url: item.url.startsWith('http') ? item.url : `https://${item.url}`,
    description: item.desc.slice(0, 300),
    category: mapCategory(item.cat),
    scraped_by: item.by || null,
    source: 'scraped' as const,
    owner_id: null,
    is_active: true,
  }))

  // Upsert in batches of 50
  const BATCH = 50
  let inserted = 0
  for (let i = 0; i < projects.length; i += BATCH) {
    const batch = projects.slice(i, i + BATCH)
    const { error } = await supabase.from('projects').upsert(batch, { onConflict: 'slug' })
    if (error) {
      console.error(`Batch ${i / BATCH + 1} error:`, error.message)
    } else {
      inserted += batch.length
      console.log(`Inserted ${inserted}/${projects.length}...`)
    }
  }

  // Update stats cache
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  await supabase.from('stats_cache').upsert([
    { key: 'total_projects', value: count ?? 0, updated_at: new Date().toISOString() },
    { key: 'total_builders', value: 0, updated_at: new Date().toISOString() },
    { key: 'total_categories', value: 15, updated_at: new Date().toISOString() },
  ])

  console.log(`Done! ${inserted} projects seeded.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
