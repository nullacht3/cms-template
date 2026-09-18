'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PasswortSetzenPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setStatus('error')
      setMsg('Das Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }
    if (password !== confirm) {
      setStatus('error')
      setMsg('Die Passwörter stimmen nicht überein.')
      return
    }
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setStatus('error')
      setMsg(error.message)
    } else {
      setStatus('success')
      setMsg('Passwort gesetzt! Du wirst weitergeleitet…')
      setTimeout(() => router.push('/admin'), 1500)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f2f5f8', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '48px 44px', width: '100%', maxWidth: 400, boxShadow: '0 6px 32px rgba(15,30,46,0.10)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <svg width="28" height="24" viewBox="0 0 46 40" fill="none">
            <ellipse cx="23" cy="20" rx="21" ry="13" stroke="#3A9BA4" strokeWidth="1.3" fill="none"/>
            <circle cx="23" cy="20" r="5.5" stroke="#3A9BA4" strokeWidth="1.3" fill="none"/>
            <circle cx="23" cy="20" r="2" fill="#3A9BA4"/>
            <path d="M7 15 Q23 6 39 15" stroke="#3A9BA4" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 20, fontWeight: 500, color: '#0f1e2e' }}>Der Ästhet · Admin</span>
        </div>

        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#1a2e3d', marginBottom: 6, marginTop: 28 }}>Passwort setzen</h1>
        <p style={{ fontSize: 13, color: '#6b8499', marginBottom: email ? 12 : 28, lineHeight: 1.5 }}>
          Willkommen! Bitte wähle ein Passwort für deinen Account.
        </p>
        {email && (
          <div style={{ background: '#f0f4f8', borderRadius: 7, padding: '9px 14px', marginBottom: 24, fontSize: 13, color: '#1a2e3d' }}>
            Account: <strong>{email}</strong>
          </div>
        )}

        {status === 'success' ? (
          <div style={{ background: 'rgba(26,138,80,0.08)', border: '1px solid rgba(26,138,80,0.2)', borderRadius: 8, padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ color: '#1a8a50', fontWeight: 500, fontSize: 14 }}>✓ {msg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 7, fontWeight: 500 }}>
                Neues Passwort
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mindestens 8 Zeichen"
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccd5de', borderRadius: 8, fontSize: 14, color: '#0f1e2e', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 7, fontWeight: 500 }}>
                Passwort wiederholen
              </label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Passwort bestätigen"
                style={{ width: '100%', padding: '11px 14px', border: `1px solid ${status === 'error' && confirm && password !== confirm ? '#c0392b' : '#ccd5de'}`, borderRadius: 8, fontSize: 14, color: '#0f1e2e', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {status === 'error' && (
              <p style={{ fontSize: 13, color: '#c0392b', marginTop: -4 }}>✕ {msg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ background: '#1a5a8a', color: '#fff', border: 'none', padding: '13px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4, opacity: status === 'loading' ? 0.7 : 1, fontFamily: 'inherit' }}
            >
              {status === 'loading' ? 'Speichern…' : 'Passwort speichern & einloggen'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
