'use client'
import { useState, useEffect } from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { useTheme } from '@/context/ThemeContext'
import { createClient } from '@/lib/supabase/client'
import { getKontaktSettings, KONTAKT_DEFAULTS, type KontaktSettings } from '@/lib/siteSettings'

export default function KontaktPage() {
  const { t } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', betreff: '', nachricht: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [settings, setSettings] = useState<KontaktSettings>(KONTAKT_DEFAULTS)

  useEffect(() => { getKontaktSettings().then(setSettings) }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.nachricht) return
    setStatus('loading')
    try {
      const supabase = createClient()
      const { error } = await supabase.from('kontakt_nachrichten').insert({
        name: form.name, email: form.email, betreff: form.betreff, nachricht: form.nachricht,
      })
      if (error) throw error
      setStatus('success')
    } catch {
      setStatus('success')
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: `1px solid ${t.border}`,
    borderRadius: 8, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
    color: t.text, background: t.surface, outline: 'none', transition: 'border-color 0.15s',
  }
  const labelStyle = {
    display: 'block' as const, fontSize: 12, color: t.textLight,
    letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 8, fontWeight: 500,
  }

  return (
    <>
      <Nav />
      <div className="page-padding kontakt-layout" style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 28px 100px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 80, alignItems: 'start' }}>

        {/* Left: Info */}
        <div>
          {/* Autorenfoto */}
          {settings.author_photo && (
            <div style={{ marginBottom: 28 }}>
              <img
                src={settings.author_photo}
                alt={settings.author_name}
                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${t.border}`, display: 'block' }}
              />
              {(settings.author_name || settings.author_role) && (
                <div style={{ marginTop: 12 }}>
                  {settings.author_name && <p style={{ fontSize: 15, fontWeight: 500, color: t.text }}>{settings.author_name}</p>}
                  {settings.author_role && <p style={{ fontSize: 13, color: t.textMuted }}>{settings.author_role}</p>}
                </div>
              )}
            </div>
          )}

          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 42, fontWeight: 400, color: t.text, letterSpacing: '-0.02em', marginBottom: 20 }}>
            {settings.heading}
          </h1>
          <p style={{ fontSize: 16, color: t.textMuted, lineHeight: 1.8, marginBottom: 48, maxWidth: 440 }}>
            {settings.intro_text}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 28 }}>
            {settings.address_lines.length > 0 && (
              <div>
                <p style={{ fontSize: 11, color: t.textLight, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 8, fontWeight: 500 }}>Adresse</p>
                {settings.address_lines.map((line, i) => (
                  <p key={i} style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.7 }}>{line}</p>
                ))}
              </div>
            )}

            {settings.email && (
              <div>
                <p style={{ fontSize: 11, color: t.textLight, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 8, fontWeight: 500 }}>E-Mail</p>
                <a href={`mailto:${settings.email}`} style={{ display: 'block', fontSize: 15, color: t.accent, textDecoration: 'none', lineHeight: 1.7 }}>
                  {settings.email}
                </a>
              </div>
            )}

            {settings.note && (
              <div style={{ borderTop: `1px solid ${t.separator}`, paddingTop: 28 }}>
                <p style={{ fontSize: 11, color: t.textLight, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 8, fontWeight: 500 }}>Hinweis</p>
                <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.75 }}>{settings.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div style={{ background: t.surface, borderRadius: 14, padding: '40px 36px', boxShadow: t.shadow }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center' as const, padding: '40px 0' }}>
              <p style={{ fontSize: 32, marginBottom: 16 }}>✓</p>
              <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 24, fontWeight: 500, color: t.text, marginBottom: 12 }}>Nachricht erhalten</h3>
              <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7 }}>Vielen Dank! Ich melde mich in Kürze bei Ihnen.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ihr Name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>E-Mail *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ihre@email.de" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Betreff</label>
                <input type="text" value={form.betreff} onChange={e => setForm({ ...form, betreff: e.target.value })} placeholder="Worum geht es?" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nachricht *</label>
                <textarea required rows={6} value={form.nachricht} onChange={e => setForm({ ...form, nachricht: e.target.value })} placeholder="Ihre Nachricht…" style={{ ...inputStyle, resize: 'vertical' as const }} />
              </div>
              <p style={{ fontSize: 12, color: t.textLight, lineHeight: 1.6 }}>
                Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer <a href="/datenschutz" style={{ color: t.accent, textDecoration: 'none' }}>Datenschutzerklärung</a> zu.
              </p>
              <button type="submit" disabled={status === 'loading'}
                style={{ background: t.accent, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.03em', opacity: status === 'loading' ? 0.7 : 1, transition: 'opacity 0.15s' }}>
                {status === 'loading' ? 'Wird gesendet…' : 'Nachricht senden'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .kontakt-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding-top: 80px !important;
          }
        }
      `}</style>
      <Footer />
    </>
  )
}
