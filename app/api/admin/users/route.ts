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

async function sendInviteEmail(email: string, link: string) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'Der Ästhet <admin@deraesthet.de>',
      to: [email],
      subject: 'Einladung: Zugang zum Der Ästhet Backend',
      html: `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f2f5f8;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 20px rgba(15,30,46,0.08);">
    <div style="background:#0f1e2e;padding:28px 36px;">
      <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:#e8e4de;">Der Ästhet</p>
      <p style="margin:4px 0 0;font-size:11px;color:rgba(232,228,222,0.5);letter-spacing:0.08em;text-transform:uppercase;">Backend-Zugang</p>
    </div>
    <div style="padding:36px;">
      <h2 style="margin:0 0 14px;font-family:Georgia,serif;font-size:22px;font-weight:400;color:#0f1e2e;">Du wurdest eingeladen</h2>
      <p style="margin:0 0 8px;font-size:14px;color:#4a6278;line-height:1.7;">
        Du hast Zugang zum Backend von <strong>Der Ästhet</strong> erhalten.
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:#4a6278;">
        Account: <strong>${email}</strong>
      </p>
      <a href="${link}" style="display:inline-block;background:#1a5a8a;color:#fff;text-decoration:none;padding:13px 26px;border-radius:8px;font-size:14px;font-weight:500;">
        Passwort setzen &amp; einloggen
      </a>
      <p style="margin:24px 0 0;font-size:11px;color:#8aa0b8;line-height:1.6;">
        Dieser Link ist 24 Stunden gültig. Falls du keine Einladung erwartet hast, ignoriere diese E-Mail.
      </p>
    </div>
  </div>
</body></html>`,
    }),
  })
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })

  const { data: { users }, error } = await adminClient().auth.admin.listUsers({ perPage: 1000 })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const formatted = users.map(u => ({
    id: u.id,
    email: u.email,
    role: u.user_metadata?.role || 'admin',
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    confirmed: !!u.email_confirmed_at,
  }))

  return NextResponse.json(formatted)
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })

  const { email, role } = await req.json()
  if (!email || !['admin', 'redakteur'].includes(role)) {
    return NextResponse.json({ error: 'Ungültige Eingabe' }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deraesthet.de'
  const admin = adminClient()

  // Prüfen ob Nutzer schon existiert
  const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const existing = users.find(u => u.email === email)

  let userId: string
  let link: string

  if (existing) {
    // Nutzer existiert — Rolle updaten und neuen Link generieren
    await admin.auth.admin.updateUserById(existing.id, { user_metadata: { role } })
    userId = existing.id
  } else {
    // Neuen Nutzer anlegen (ohne E-Mail von Supabase)
    const { data, error } = await admin.auth.admin.createUser({
      email,
      email_confirm: false,
      user_metadata: { role },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    userId = data.user.id
  }

  // Einladungslink generieren und E-Mail via Resend schicken
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: { redirectTo: `${siteUrl}/auth/callback` },
  })

  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 400 })

  link = linkData.properties?.action_link || ''
  await sendInviteEmail(email, link)

  return NextResponse.json({ id: userId })
}
