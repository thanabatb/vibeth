import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if user has completed consent
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: consent } = await supabase
          .from('user_consents')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!consent) {
          return NextResponse.redirect(`${origin}/auth/consent`)
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=callback_error`)
}
