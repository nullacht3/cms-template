'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Nachricht = {
  id: string
  name: string | null
  email: string | null
  betreff: string | null
  nachricht: string | null
  gelesen: boolean
  created_at: string
}

export default function NachrichtenPage() {
  const [nachrichten, setNachrichten] = useState<Nachricht[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Nachricht | null>(null)
  const [filter, setFilter] = useState<'alle' | 'ungelesen'>('alle')

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('kontakt_nachrichten')
      .select('*')
      .order('created_at', { ascending: false })
    setNachrichten(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function markAsRead(id: string) {
    const supabase = createClient()
    await supabase.from('kontakt_nachrichten').update({ gelesen: true }).eq('id', id)
    setNachrichten(prev => prev.map(n => n.id === id ? { ...n, gelesen: true } : n))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, gelesen: true } : prev)
  }

  async function deleteNachricht(id: string) {
    if (!confirm('Nachricht wirklich löschen?')) return
    const supabase = createClient()
    await supabase.from('kontakt_nachrichten').delete().eq('id', id)
    setNachrichten(prev => prev.filter(n => n.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const ungelesene = nachrichten.filter(n => !n.gelesen).length
  const filtered = filter === 'ungelesen' ? nachrichten.filter(n => !n.gelesen) : nachrichten

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1a2e3d', marginBottom: 4 }}>Kontaktanfragen</h1>
          <p style={{ fontSize: 13, color: '#6b8499' }}>
            {ungelesene > 0 ? (
              <span><strong style={{ color: '#1a5a8a' }}>{ungelesene} ungelesen</strong> · {nachrichten.length} gesamt</span>
            ) : (
              <span>{nachrichten.length} Nachrichten gesamt</span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['alle', 'ungelesen'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                background: filter === f ? '#1a5a8a' : '#fff',
                color: filter === f ? '#fff' : '#4a6278',
                borderColor: filter === f ? '#1a5a8a' : '#d0dce8' }}>
              {f === 'alle' ? 'Alle' : `Ungelesen${ungelesene > 0 ? ` (${ungelesene})` : ''}`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#8aa0b8', fontSize: 14 }}>Lädt…</p>
      ) : nachrichten.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #d8e0e8', padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
          <p style={{ color: '#6b8499', fontSize: 14 }}>Noch keine Kontaktanfragen</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
          {/* Liste */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.length === 0 ? (
              <p style={{ color: '#8aa0b8', fontSize: 14, padding: 20 }}>Keine ungelesenen Nachrichten</p>
            ) : filtered.map(n => (
              <div key={n.id}
                onClick={() => { setSelected(n); if (!n.gelesen) markAsRead(n.id) }}
                style={{
                  background: '#fff', borderRadius: 8, border: `1px solid ${selected?.id === n.id ? '#1a5a8a' : '#d8e0e8'}`,
                  padding: '14px 16px', cursor: 'pointer',
                  borderLeft: `3px solid ${n.gelesen ? 'transparent' : '#1a5a8a'}`,
                  transition: 'all 0.15s',
                  boxShadow: selected?.id === n.id ? '0 2px 8px rgba(26,90,138,0.12)' : 'none',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {!n.gelesen && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a5a8a', display: 'inline-block', flexShrink: 0 }} />}
                    <span style={{ fontSize: 13, fontWeight: n.gelesen ? 400 : 600, color: '#1a2e3d' }}>
                      {n.name || 'Unbekannt'}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#8aa0b8', whiteSpace: 'nowrap' }}>{formatDate(n.created_at)}</span>
                </div>
                <p style={{ fontSize: 12, color: '#6b8499', marginBottom: 4, paddingLeft: n.gelesen ? 0 : 15 }}>
                  {n.email}
                </p>
                {n.betreff && (
                  <p style={{ fontSize: 13, color: '#4a6278', fontWeight: 500, paddingLeft: n.gelesen ? 0 : 15 }}>
                    {n.betreff}
                  </p>
                )}
                {n.nachricht && (
                  <p style={{ fontSize: 12, color: '#8aa0b8', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: n.gelesen ? 0 : 15 }}>
                    {n.nachricht}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Detail-Ansicht */}
          {selected && (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #d8e0e8', padding: '24px 28px', alignSelf: 'flex-start', position: 'sticky', top: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1a2e3d', marginBottom: 4 }}>
                    {selected.betreff || '(kein Betreff)'}
                  </h2>
                  <p style={{ fontSize: 13, color: '#6b8499' }}>{formatDate(selected.created_at)}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  style={{ background: 'none', border: 'none', fontSize: 18, color: '#8aa0b8', cursor: 'pointer', padding: 4 }}>×</button>
              </div>

              <div style={{ background: '#f2f5f8', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: '#8aa0b8', marginBottom: 2 }}>Von</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#1a2e3d' }}>{selected.name || '—'}</p>
                <a href={`mailto:${selected.email}`} style={{ fontSize: 13, color: '#1a5a8a', textDecoration: 'none' }}>
                  {selected.email}
                </a>
              </div>

              <div style={{ fontSize: 14, color: '#2c3e4f', lineHeight: 1.7, whiteSpace: 'pre-wrap', borderBottom: '1px solid #e8eff5', paddingBottom: 20, marginBottom: 16 }}>
                {selected.nachricht || '(keine Nachricht)'}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.betreff || '')}`}
                  style={{ flex: 1, background: '#1a5a8a', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', textDecoration: 'none', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                  ✉ Antworten
                </a>
                <button onClick={() => deleteNachricht(selected.id)}
                  style={{ background: 'none', border: '1px solid #fcc', color: '#c0392b', padding: '9px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Löschen
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
