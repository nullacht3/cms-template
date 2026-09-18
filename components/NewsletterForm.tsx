'use client'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

export function NewsletterForm() {
  const { t } = useTheme()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'exists'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.status === 409) { setStatus('exists'); return }
    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <div style={{ background: t.surfaceHover, borderTop: `3px solid ${t.text}`, padding: '36px 0 32px', marginTop: 72 }}>
      <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 22, fontWeight: 500, color: t.text, marginBottom: 8 }}>Newsletter</h3>
      <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
        Neue Artikel, kuratierte Inhalte und Fachwissen — direkt in dein Postfach.
      </p>

      {status === 'success' ? (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 20, marginTop: 2 }}>📬</span>
          <div>
            <p style={{ fontSize: 14, color: t.text, fontWeight: 500, marginBottom: 4 }}>Fast geschafft!</p>
            <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>
              Wir haben eine Bestätigungs-E-Mail an <strong>{email}</strong> gesendet. Bitte klicken Sie auf den Link darin, um die Anmeldung abzuschließen.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            required
            style={{ flex: 1, padding: '11px 16px', border: `1px solid ${status === 'error' ? '#c0392b' : t.border}`, borderRadius: 0, fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: t.text, background: t.surface, outline: 'none' }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{ background: t.text, color: '#ffffff', border: 'none', padding: '11px 28px', borderRadius: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: status === 'loading' ? 0.7 : 1, whiteSpace: 'nowrap' }}>
            {status === 'loading' ? '…' : 'Anmelden'}
          </button>
        </form>
      )}

      {status === 'exists' && (
        <p style={{ fontSize: 12, color: t.accent, marginTop: 8 }}>✓ Diese E-Mail ist bereits angemeldet.</p>
      )}
      {status === 'error' && (
        <p style={{ fontSize: 12, color: '#c0392b', marginTop: 8 }}>Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.</p>
      )}
    </div>
  )
}
