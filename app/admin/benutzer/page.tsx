'use client'
import { useEffect, useState } from 'react'

type User = {
  id: string
  email: string
  role: 'admin' | 'redakteur'
  created_at: string
  last_sign_in_at: string | null
  confirmed: boolean
}

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  admin: { bg: 'rgba(26,90,138,0.1)', color: '#1a5a8a' },
  redakteur: { bg: 'rgba(26,138,80,0.1)', color: '#1a8a50' },
}

export default function BenutzerPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'redakteur'>('redakteur')
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [inviteMsg, setInviteMsg] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copyingId, setCopyingId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    if (res.ok) setUsers(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    setInviteStatus('loading')
    setInviteMsg('')
    setInviteLink('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    })
    const data = await res.json()
    if (res.ok) {
      // Einladungslink direkt holen und anzeigen
      const linkRes = await fetch('/api/admin/users/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      })
      const linkData = await linkRes.json()
      setInviteLink(linkData.link || '')
      setInviteStatus('success')
      setInviteMsg(`E-Mail an ${inviteEmail} verschickt.`)
      setInviteEmail('')
      load()
    } else {
      setInviteStatus('error')
      setInviteMsg(data.error || 'Fehler beim Einladen.')
    }
  }

  async function copyLink(email: string) {
    setCopyingId(email)
    const res = await fetch('/api/admin/users/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (data.link) {
      await navigator.clipboard.writeText(data.link)
    }
    setTimeout(() => setCopyingId(null), 2000)
  }

  async function changeRole(id: string, role: string) {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: role as 'admin' | 'redakteur' } : u))
  }

  async function deleteUser(id: string, email: string) {
    if (!confirm(`${email} wirklich entfernen?`)) return
    setDeletingId(id)
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== id))
    } else {
      const d = await res.json()
      alert(d.error || 'Fehler beim Löschen.')
    }
    setDeletingId(null)
  }

  function formatDate(iso: string | null) {
    if (!iso) return '–'
    return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1a2e3d', marginBottom: 4 }}>Benutzer</h1>
        <p style={{ fontSize: 13, color: '#6b8499' }}>
          <strong style={{ color: '#1a5a8a' }}>{users.length}</strong> Benutzer · Admin (voller Zugriff) oder Redakteur (nur Artikel & Seiten)
        </p>
      </div>

      {/* Einladungsformular */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #d8e0e8', padding: '24px 28px', marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1a2e3d', marginBottom: 16 }}>Neuen Benutzer einladen</h2>
        <form onSubmit={invite} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 240px' }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>E-Mail-Adresse</label>
            <input type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
              placeholder="name@beispiel.de"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #d0dce8', borderRadius: 7, fontSize: 14, fontFamily: 'inherit', color: '#1a2e3d', outline: 'none' }} />
          </div>
          <div style={{ flex: '0 0 160px' }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>Rolle</label>
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value as 'admin' | 'redakteur')}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #d0dce8', borderRadius: 7, fontSize: 14, fontFamily: 'inherit', color: '#1a2e3d', outline: 'none', background: '#fff' }}>
              <option value="redakteur">Redakteur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={inviteStatus === 'loading'}
            style={{ padding: '10px 20px', background: '#1a5a8a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: inviteStatus === 'loading' ? 0.7 : 1, whiteSpace: 'nowrap' }}>
            {inviteStatus === 'loading' ? 'Sende…' : '✉️ Einladung senden'}
          </button>
        </form>

        {inviteMsg && (
          <p style={{ marginTop: 12, fontSize: 13, color: inviteStatus === 'error' ? '#c0392b' : '#1a8a50', fontWeight: 500 }}>
            {inviteStatus === 'success' ? '✓ ' : '✕ '}{inviteMsg}
          </p>
        )}

        {/* Link anzeigen falls E-Mail-Probleme */}
        {inviteLink && (
          <div style={{ marginTop: 14, background: '#f7fafd', border: '1px solid #d8e0e8', borderRadius: 8, padding: '14px 16px' }}>
            <p style={{ fontSize: 12, color: '#4a6278', marginBottom: 10 }}>
              📋 <strong>E-Mail nicht angekommen?</strong> Link direkt kopieren und per WhatsApp/Slack schicken:
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input readOnly value={inviteLink}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #d0dce8', borderRadius: 6, fontSize: 11, color: '#6b8499', fontFamily: 'monospace', background: '#fff', minWidth: 0 }} />
              <button onClick={() => { navigator.clipboard.writeText(inviteLink); }}
                style={{ padding: '8px 14px', background: '#1a5a8a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Kopieren
              </button>
            </div>
          </div>
        )}

        <p style={{ marginTop: 12, fontSize: 12, color: '#8aa0b8', lineHeight: 1.5 }}>
          Der Benutzer erhält eine E-Mail mit einem Einladungslink und setzt sein Passwort selbst. Links sind 24 Stunden gültig.
        </p>
      </div>

      {/* Benutzerliste */}
      {loading ? (
        <p style={{ color: '#8aa0b8', fontSize: 14 }}>Lädt…</p>
      ) : users.length === 0 ? (
        <p style={{ color: '#8aa0b8', fontSize: 14 }}>Keine Benutzer gefunden.</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #d8e0e8', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 100px 48px', borderBottom: '2px solid #e8eff5', padding: '10px 20px', background: '#f7fafd' }}>
            {['E-Mail', 'Rolle', 'Registriert', 'Letzter Login', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
            ))}
          </div>

          {users.map((u, i) => (
            <div key={u.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 120px 100px 48px',
              padding: '14px 20px', alignItems: 'center',
              borderBottom: i < users.length - 1 ? '1px solid #f0f4f8' : 'none',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f7fafd')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <span style={{ fontSize: 14, color: '#1a2e3d' }}>{u.email}</span>
                {!u.confirmed && (
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#e67e22', background: 'rgba(230,126,34,0.1)', padding: '2px 7px', borderRadius: 10, fontWeight: 500 }}>⏳ Ausstehend</span>
                    <button onClick={() => copyLink(u.email!)}
                      style={{ fontSize: 10, color: '#1a5a8a', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontWeight: 500 }}>
                      {copyingId === u.email ? '✓ Kopiert!' : '🔗 Link kopieren'}
                    </button>
                  </div>
                )}
              </div>

              <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                style={{ padding: '4px 10px', borderRadius: 12, border: 'none', background: ROLE_COLORS[u.role]?.bg || '#f0f4f8', color: ROLE_COLORS[u.role]?.color || '#4a6278', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
                <option value="admin">Admin</option>
                <option value="redakteur">Redakteur</option>
              </select>

              <span style={{ fontSize: 12, color: '#6b8499' }}>{formatDate(u.created_at)}</span>
              <span style={{ fontSize: 12, color: '#6b8499' }}>{formatDate(u.last_sign_in_at)}</span>

              <button onClick={() => deleteUser(u.id, u.email!)} disabled={deletingId === u.id}
                style={{ background: 'none', border: 'none', color: '#c8d8e4', fontSize: 16, cursor: 'pointer', padding: 4, borderRadius: 4, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                onMouseLeave={e => (e.currentTarget.style.color = '#c8d8e4')}
                title="Entfernen">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
