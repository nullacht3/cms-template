import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function checkAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const role = user.user_metadata?.role
  return !role || role === 'admin'
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })

  const { email } = await req.json()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deraesthet.de'

  const { data, error } = await adminClient().auth.admin.generateLink({
    type: 'invite',
    email,
    options: { redirectTo: `${siteUrl}/auth/callback` },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ link: data.properties?.action_link })
}
