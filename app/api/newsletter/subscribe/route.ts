import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 })
  }

  const supabase = await createClient()

  // Prüfen ob E-Mail schon existiert
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id, confirmed')
    .eq('email', email)
    .maybeSingle()

  if (existing?.confirmed) {
    return NextResponse.json({ error: 'Diese E-Mail ist bereits angemeldet.' }, { status: 409 })
  }

  // Token generieren (24h gültig)
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deraesthet.de'
  const confirmUrl = `${siteUrl}/newsletter/bestaetigen?token=${token}`

  if (existing) {
    // Update token für unbestätigte E-Mail
    await supabase.from('newsletter_subscribers').update({
      confirmation_token: token,
      token_expires_at: expires,
    }).eq('id', existing.id)
  } else {
    // Neu eintragen (unbestätigt)
    await supabase.from('newsletter_subscribers').insert({
      email,
      confirmed: false,
      confirmation_token: token,
      token_expires_at: expires,
    })
  }

  // E-Mail senden mit Resend
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Der Ästhet <newsletter@deraesthet.de>',
        to: [email],
        subject: 'Bitte bestätigen Sie Ihre Newsletter-Anmeldung',
        html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f2f5f8;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 20px rgba(15,30,46,0.08);">
    <div style="background:#0f1e2e;padding:32px 40px;">
      <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:400;color:#e8e4de;letter-spacing:0.02em;">Der Ästhet</p>
      <p style="margin:4px 0 0;font-size:12px;color:rgba(232,228,222,0.5);letter-spacing:0.08em;text-transform:uppercase;">Newsletter</p>
    </div>
    <div style="padding:40px;">
      <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#0f1e2e;">Fast geschafft!</h2>
      <p style="margin:0 0 24px;font-size:15px;color:#4a6278;line-height:1.75;">
        Bitte bestätigen Sie Ihre Newsletter-Anmeldung mit einem Klick auf den Button:
      </p>
      <a href="${confirmUrl}" style="display:inline-block;background:#1a5a8a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:500;letter-spacing:0.03em;">
        E-Mail-Adresse bestätigen
      </a>
      <p style="margin:28px 0 0;font-size:12px;color:#8aa0b8;line-height:1.6;">
        Dieser Link ist 24 Stunden gültig. Wenn Sie sich nicht angemeldet haben, können Sie diese E-Mail ignorieren.
      </p>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #e8edf2;background:#f8fafc;">
      <p style="margin:0;font-size:11px;color:#8aa0b8;">
        © Der Ästhet · <a href="${siteUrl}/datenschutz" style="color:#8aa0b8;">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>`,
      }),
    })
  }

  return NextResponse.json({ ok: true })
}
