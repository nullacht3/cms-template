'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Subscriber = {
  id: string
  email: string
  confirmed: boolean
  subscribed_at: string
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false })
      setSubscribers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function deleteSubscriber(id: string, email: string) {
    if (!confirm(`${email} wirklich aus dem Newsletter entfernen?`)) return
    const supabase = createClient()
    await supabase.from('newsletter_subscribers').delete().eq('id', id)
    setSubscribers(prev => prev.filter(s => s.id !== id))
  }

  function copyAll() {
    const emails = filtered.map(s => s.email).join('\n')
    navigator.clipboard.writeText(emails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  // Wachstum: Abos im letzten Monat
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const newLastMonth = subscribers.filter(s => new Date(s.subscribed_at) > lastMonth).length
  const confirmed = subscribers.filter(s => s.confirmed).length
  const pending = subscribers.filter(s => !s.confirmed).length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1a2e3d', marginBottom: 4 }}>Newsletter-Abonnenten</h1>
          <p style={{ fontSize: 13, color: '#6b8499' }}>
            <strong style={{ color: '#1a5a8a' }}>{subscribers.length}</strong> Abonnenten gesamt
            {newLastMonth > 0 && <span> · <strong style={{ color: '#27ae60' }}>+{newLastMonth}</strong> diesen Monat</span>}
          </p>
        </div>
        <button onClick={copyAll} disabled={filtered.length === 0}
          style={{ background: '#1a5a8a', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: filtered.length === 0 ? 'default' : 'pointer', fontFamily: 'inherit', opacity: filtered.length === 0 ? 0.5 : 1, transition: 'all 0.2s' }}>
          {copied ? '✓ Kopiert!' : `📋 Alle E-Mails kopieren${search ? ` (${filtered.length})` : ''}`}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Bestätigt', value: confirmed, color: '#1a8a50' },
          { label: 'Ausstehend', value: pending, color: '#e67e22' },
          { label: 'Letzter Monat', value: `+${newLastMonth}`, color: '#1a5a8a' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#fff', borderRadius: 8, border: '1px solid #d8e0e8', padding: '16px 20px' }}>
            <p style={{ fontSize: 11, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{stat.label}</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Suche */}
      <div style={{ marginBottom: 16 }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="E-Mail suchen…"
          style={{ width: '100%', maxWidth: 320, padding: '9px 14px', border: '1px solid #d0dce8', borderRadius: 7, fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: '#1a2e3d', outline: 'none', background: '#fff' }} />
      </div>

      {/* Tabelle */}
      {loading ? (
        <p style={{ color: '#8aa0b8', fontSize: 14 }}>Lädt…</p>
      ) : subscribers.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #d8e0e8', padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📧</div>
          <p style={{ color: '#6b8499', fontSize: 14 }}>Noch keine Newsletter-Abonnenten</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #d8e0e8', overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 160px 48px', gap: 0, borderBottom: '2px solid #e8eff5', padding: '10px 20px', background: '#f7fafd' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>E-Mail</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Angemeldet am</span>
            <span />
          </div>

          {filtered.length === 0 ? (
            <p style={{ padding: '20px', color: '#8aa0b8', fontSize: 14 }}>Keine Treffer für „{search}"</p>
          ) : filtered.map((s, i) => (
            <div key={s.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 160px 48px', gap: 0,
              padding: '12px 20px', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid #f0f4f8' : 'none',
              transition: 'background 0.1s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f7fafd')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 14, color: '#1a2e3d', fontWeight: 400 }}>{s.email}</span>
              <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 12, display: 'inline-block',
                background: s.confirmed ? 'rgba(26,138,80,0.1)' : 'rgba(230,126,34,0.1)',
                color: s.confirmed ? '#1a8a50' : '#e67e22' }}>
                {s.confirmed ? '✓ Bestätigt' : '⏳ Ausstehend'}
              </span>
              <span style={{ fontSize: 13, color: '#6b8499' }}>{formatDate(s.subscribed_at)}</span>
              <button onClick={() => deleteSubscriber(s.id, s.email)}
                style={{ background: 'none', border: 'none', color: '#c8d8e4', fontSize: 16, cursor: 'pointer', padding: 4, borderRadius: 4, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                onMouseLeave={e => (e.currentTarget.style.color = '#c8d8e4')}
                title="Entfernen">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && search && (
        <p style={{ marginTop: 12, fontSize: 12, color: '#8aa0b8' }}>{filtered.length} von {subscribers.length} angezeigt</p>
      )}
    </div>
  )
}
