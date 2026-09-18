'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    async function handle() {
      const supabase = createClient()

      // 1) Hash parsen: #access_token=...&refresh_token=...
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (!error) {
          router.push('/admin/passwort-setzen')
          return
        }
        setError('Session konnte nicht gesetzt werden: ' + error.message)
        return
      }

      // 2) Fallback: code-Parameter (PKCE-Flow)
      const code = new URLSearchParams(window.location.search).get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
          router.push('/admin/passwort-setzen')
          return
        }
        setError('Code konnte nicht eingelöst werden: ' + error.message)
        return
      }

      setError('Kein gültiges Token gefunden. Bitte erneut einladen lassen.')
    }

    handle()
  }, [router])

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f2f5f8', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '40px', maxWidth: 400, textAlign: 'center', boxShadow: '0 4px 20px rgba(15,30,46,0.08)' }}>
          <p style={{ fontSize: 32, marginBottom: 16 }}>⚠️</p>
          <p style={{ color: '#c0392b', fontSize: 14, lineHeight: 1.6 }}>{error}</p>
          <a href="/admin/login" style={{ display: 'inline-block', marginTop: 20, color: '#1a5a8a', fontSize: 13 }}>Zur Anmeldung</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f2f5f8', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #d8e0e8', borderTopColor: '#1a5a8a', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#6b8499', fontSize: 14 }}>Anmeldung wird verarbeitet…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
