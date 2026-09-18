import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/newsletter/bestaetigen?status=invalid', req.url))

  const supabase = await createClient()

  const { data } = await supabase
    .from('newsletter_subscribers')
    .select('id, token_expires_at, confirmed')
    .eq('confirmation_token', token)
    .maybeSingle()

  if (!data) {
    return NextResponse.redirect(new URL('/newsletter/bestaetigen?status=invalid', req.url))
  }

  if (data.confirmed) {
    return NextResponse.redirect(new URL('/newsletter/bestaetigen?status=already', req.url))
  }

  if (data.token_expires_at && new Date(data.token_expires_at) < new Date()) {
    return NextResponse.redirect(new URL('/newsletter/bestaetigen?status=expired', req.url))
  }

  await supabase.from('newsletter_subscribers').update({
    confirmed: true,
    confirmation_token: null,
    token_expires_at: null,
  }).eq('id', data.id)

  return NextResponse.redirect(new URL('/newsletter/bestaetigen?status=success', req.url))
}
