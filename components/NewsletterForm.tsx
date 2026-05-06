'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/context/ThemeContext'

export function NewsletterForm() {
  const { t } = useTheme()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.from('newsletter_subscribers').insert({ email })
    setStatus(error ? 'error' : 'success')
  }

  return (
    <div style={{ background: t.accentLight, borderRadius: 12, padding: '32px 36px', marginTop: 60 }}>
      <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 22, fontWeight: 500, color: t.text, marginBottom: 8 }}>Newsletter</h3>
      <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 20, lineHeight: 1.6 }}>Neue Artikel, kuratierte Inhalte und Fachwissen — direkt in dein Postfach.</p>
      {status === 'success' ? (
        <p style={{ fontSize: 14, color: t.accent, fontWeight: 500 }}>✓ Danke! Du bist jetzt eingetragen.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de" required
            style={{ flex: 1, padding: '10px 14px', border: `1px solid ${t.border}`, borderRadius: 7, fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: t.text, background: t.surface, outline: 'none' }}
          />
          <button type="submit" disabled={status === 'loading'} style={{ background: t.accent, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: status === 'loading' ? 0.7 : 1 }}>
            {status === 'loading' ? '…' : 'Anmelden'}
          </button>
        </form>
      )}
      {status === 'error' && <p style={{ fontSize: 12, color: '#c0392b', marginTop: 8 }}>Diese E-Mail ist bereits eingetragen oder ein Fehler ist aufgetreten.</p>}
    </div>
  )
}
