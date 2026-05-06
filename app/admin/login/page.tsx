'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setStatus('error')
      setMsg(error.message === 'Invalid login credentials' ? 'E-Mail oder Passwort falsch.' : error.message)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f2f5f8', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '48px 44px', width: '100%', maxWidth: 400, boxShadow: '0 6px 32px rgba(15,30,46,0.10)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <svg width="28" height="24" viewBox="0 0 46 40" fill="none">
            <ellipse cx="23" cy="20" rx="21" ry="13" stroke="#3A9BA4" strokeWidth="1.3" fill="none"/>
            <circle cx="23" cy="20" r="5.5" stroke="#3A9BA4" strokeWidth="1.3" fill="none"/>
            <circle cx="23" cy="20" r="2" fill="#3A9BA4"/>
            <path d="M7 15 Q23 6 39 15" stroke="#3A9BA4" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 20, fontWeight: 500, color: '#0f1e2e' }}>Der Ästhet · Admin</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 7, fontWeight: 500 }}>E-Mail</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccd5de', borderRadius: 8, fontSize: 14, color: '#0f1e2e', outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 7, fontWeight: 500 }}>Passwort</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #ccd5de', borderRadius: 8, fontSize: 14, color: '#0f1e2e', outline: 'none', fontFamily: 'inherit' }} />
          </div>

          {status === 'error' && <p style={{ fontSize: 13, color: '#c0392b', marginTop: -4 }}>{msg}</p>}

          <button type="submit" disabled={status === 'loading'}
            style={{ background: '#1a5a8a', color: '#fff', border: 'none', padding: '13px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4, opacity: status === 'loading' ? 0.7 : 1, fontFamily: 'inherit' }}>
            {status === 'loading' ? 'Einloggen…' : 'Einloggen'}
          </button>
        </form>
      </div>
    </div>
  )
}
