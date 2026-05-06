'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { NewsletterForm } from '@/components/NewsletterForm'
import { useTheme } from '@/context/ThemeContext'
import { POSTS } from '@/lib/themes'
import { getArticles } from '@/lib/getArticles'
import { createClient } from '@/lib/supabase/client'
import type { Theme, Post } from '@/lib/types'

function Chip({ label, t }: { label: string; t: Theme }) {
  return <span style={{ background: t.tag.bg, color: t.tag.color, fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 10px', borderRadius: 4, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
}

function PostImage({ src, ratio = '16/9', t }: { src: string; ratio?: string; t: Theme }) {
  const [w, h] = ratio.split('/').map(Number)
  return (
    <div style={{ width: '100%', paddingBottom: `${h / w * 100}%`, position: 'relative', borderRadius: 8, overflow: 'hidden', background: t.surfaceHover, marginBottom: 40 }}>
      {src && <img src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
    </div>
  )
}

function ArticleBody({ t, type }: { t: Theme; type: string }) {
  const prose = { fontSize: 15, lineHeight: 1.85, color: t.textMuted, marginBottom: 24 }
  const h2Style = { fontFamily: "'Cormorant Garant', serif", fontSize: 26, fontWeight: 500, color: t.text, marginBottom: 16, marginTop: 40, letterSpacing: '-0.01em' }
  const blockquote = { borderLeft: `3px solid ${t.accent}`, paddingLeft: 24, marginBottom: 24, marginTop: 8, fontFamily: "'Cormorant Garant', serif", fontStyle: 'italic' as const, fontSize: 18, lineHeight: 1.6, color: t.text }

  if (type === 'liste') {
    return (
      <div>
        <p style={prose}>Die Anwendungsmöglichkeiten von Botulinum-Toxin Typ A haben sich in den letzten Jahren erheblich erweitert. Neben der bekannten kosmetischen Indikation gibt es zahlreiche evidenzbasierte therapeutische Einsatzgebiete, die oft unterschätzt werden.</p>
        <h2 style={h2Style}>Die wichtigsten Indikationen im Überblick</h2>
        {[
          ['01', 'Glabellafalten & Stirnfalten', 'Die klassische Indikation mit höchster Evidenz. Standarddosierung: 20–40 IE für die Glabellaregion.'],
          ['02', 'Primäre Hyperhidrose', 'Axilläre, palmäre und plantare Hyperhidrose sprechen exzellent auf intradermale Injektionen an. Wirkdauer 6–12 Monate.'],
          ['03', 'Bruxismus & TMJ-Dysfunktion', 'Masseter-Injektion reduziert Kaukraft, mildert Schmerzen und kann ästhetisch das Gesichtsoval verschmälern.'],
          ['04', 'Chronische Migräne', 'Seit 2010 von der FDA zugelassen. Protokoll: 31 Injektionen, 155–195 IE, alle 12 Wochen.'],
          ['05', 'Platysma-Bänder', 'Die »Nefertiti-Lift« Technik behandelt Halsbänder und gibt dem unteren Gesichtsdrittel eine definierte Kontur.'],
        ].map(([nr, title, desc]) => (
          <div key={nr} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '0 20px', marginBottom: 20, padding: '20px 0', borderBottom: `1px solid ${t.borderLight}` }}>
            <span style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 28, fontWeight: 300, color: t.accent, lineHeight: 1 }}>{nr}</span>
            <div>
              <p style={{ fontWeight: 500, fontSize: 15, color: t.text, marginBottom: 6 }}>{title}</p>
              <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.65 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'interview') {
    return (
      <div>
        <p style={prose}>Dr. Elena Voss ist seit über 15 Jahren in der plastischen und ästhetischen Chirurgie tätig. Im Gespräch mit Der Ästhet reflektiert sie über ethische Grenzen, Patientenerwartungen und die Frage, wann ein Nein das ehrlichste Ja sein kann.</p>
        {[
          ['Frau Dr. Voss, wo beginnt für Sie die Grenze zwischen ästhetischem Wunsch und medizinischer Verantwortung?', 'Diese Grenze ist fließend und kontextabhängig. Was ich über die Jahre gelernt habe: Oft ist das eigentliche Problem hinter einem Operationswunsch kein morphologisches. Wenn jemand zum dritten Mal die Nase operieren möchte, dann ist meine erste Pflicht, zuzuhören — nicht zu schneiden.'],
          ['Wie reagieren Patienten, wenn Sie ablehnen?', 'Zunächst oft mit Unverständnis, manchmal mit Ärger. Aber in vielen Fällen kommt nach Wochen oder Monaten eine Nachricht des Dankes. Wir sehen nur einen Moment im Leben eines Menschen — aber dieser Moment kann langfristige Konsequenzen haben.'],
          ['Welche Entwicklung beobachten Sie mit Sorge?', 'Die Demokratisierung der Behandlungen an sich ist nicht das Problem. Aber die Entkoppelung von medizinischem Fachwissen und der Anwendung schon. Filler-Injektionen werden als niedrigschwellig wahrgenommen — dabei haben wir es mit einem anatomisch komplexen Gebiet zu tun.'],
        ].map(([q, a], i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 19, fontWeight: 500, color: t.text, marginBottom: 12, fontFamily: "'Cormorant Garant', serif" }}>— {q}</p>
            <p style={{ ...prose, marginBottom: 0 }}>»{a}«</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <p style={prose}>Die Rhinoplastik gilt als eine der anspruchsvollsten Operationen in der ästhetischen Chirurgie. Nicht nur aufgrund ihrer anatomischen Komplexität, sondern wegen der engen Verschränkung von Funktion, Ästhetik und individueller Wahrnehmung.</p>
      <h2 style={h2Style}>Strukturelle vs. komponenten-basierte Rhinoplastik</h2>
      <p style={prose}>Während die klassische Resektion langer Zeit Standard war, setzt sich die Erhaltungs-Rhinoplastik zunehmend durch. Sie bewahrt das Dorsum als anatomische Einheit und reduziert postoperative Vernarbungen signifikant.</p>
      <blockquote style={blockquote}>»Das Ziel ist nicht die perfekte Nase, sondern die richtige Nase für dieses Gesicht.«</blockquote>
      <h2 style={h2Style}>Klinische Evidenz & Langzeitergebnisse</h2>
      <p style={prose}>Mehrere prospektive Studien belegen, dass Preservation-Techniken zu höheren Patientenzufriedenheitswerten führen — besonders in der 5-Jahres-Nachbeobachtung. Die Lernkurve ist jedoch steil und setzt anatomisches Detailwissen voraus.</p>
      <div style={{ background: t.accentLight, borderRadius: 10, padding: '24px 28px', marginBottom: 28 }}>
        <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' as const, fontWeight: 500 }}>Klinische Daten</p>
        {[['Patientenzufriedenheit', '94%'], ['Revisionsrate (5 Jahre)', '3.2%'], ['Komplikationsrate', '1.8%']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 14, color: t.textMuted }}>{k}</span>
            <span style={{ fontSize: 16, fontFamily: "'Cormorant Garant', serif", fontWeight: 500, color: t.accent }}>{v}</span>
          </div>
        ))}
      </div>
      <h2 style={h2Style}>Fazit & klinische Empfehlung</h2>
      <p style={prose}>Die strukturelle Rhinoplastik nach Preservation-Prinzip bietet für geeignete Kandidaten klare Vorteile. Entscheidend bleibt die sorgfältige Patientenselektion und eine ehrliche präoperative Kommunikation.</p>
    </div>
  )
}

export function ArticlePageClient({ slug }: { slug: string }) {
  const { t } = useTheme()
  const router = useRouter()
  const [allPosts, setAllPosts] = useState<Post[]>(POSTS)
  const [htmlContent, setHtmlContent] = useState<string | null>(null)

  useEffect(() => { getArticles().then(setAllPosts) }, [])

  useEffect(() => {
    async function loadContent() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('articles').select('content').eq('slug', slug).single()
        if (data?.content) setHtmlContent(data.content)
      } catch { /* fallback */ }
    }
    loadContent()
  }, [slug])

  const p = allPosts.find((x) => x.slug === slug) || allPosts[0]
  const related = allPosts.filter((x) => x.id !== p.id).slice(0, 3)

  return (
    <>
      <Nav />
      <div className="page-padding" style={{ maxWidth: 1140, margin: '0 auto', padding: '88px 28px 80px' }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: 13, marginBottom: 40, fontFamily: "'DM Sans', sans-serif" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3 L5 8 L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Zurück zum Blog
        </button>

        <div className="article-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 64 }}>
          <article>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24 }}>
              <Chip label={p.tag} t={t} />
              <span style={{ fontSize: 12, color: t.textLight }}>{p.category}</span>
              <span style={{ fontSize: 12, color: t.textLight }}>·</span>
              <span style={{ fontSize: 12, color: t.textLight }}>{p.date}</span>
              <span style={{ fontSize: 12, color: t.textLight }}>·</span>
              <span style={{ fontSize: 12, color: t.textLight }}>{p.readTime} Lesezeit</span>
            </div>

            <h1 className="article-title" style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 40, fontWeight: 500, lineHeight: 1.2, color: t.text, marginBottom: 28, letterSpacing: '-0.02em' }}>{p.title}</h1>

            <p style={{ fontSize: 18, lineHeight: 1.8, color: t.textMuted, marginBottom: 32, paddingBottom: 32, borderBottom: `1px solid ${t.separator}`, fontFamily: "'Cormorant Garant', serif", fontStyle: 'italic' }}>{p.excerpt}</p>

            <PostImage src={p.photo} ratio="16/7" t={t} />

            {htmlContent ? (
              <div className="article-html-content" style={{ fontSize: 15, lineHeight: 1.85, color: t.textMuted }}
                dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
              <ArticleBody t={t} type={p.type} />
            )}

            <div style={{ marginTop: 60 }}>
              <NewsletterForm />
            </div>
          </article>

          <aside className="article-sidebar" style={{ paddingTop: 8 }}>
            <div style={{ position: 'sticky', top: 90 }}>
              <div style={{ background: t.surface, borderRadius: 10, padding: 24, boxShadow: t.shadow, marginBottom: 24 }}>
                <p style={{ fontSize: 11, color: t.textLight, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Inhalt</p>
                {['Einleitung', 'Methodik & Technik', 'Klinische Evidenz', 'Fallbeispiele', 'Fazit'].map((s, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${t.borderLight}`, fontSize: 13, color: i === 0 ? t.accent : t.textMuted, cursor: 'pointer', display: 'flex', gap: 10 }}>
                    <span style={{ color: t.textLight, fontSize: 11, marginTop: 2 }}>0{i + 1}</span>
                    {s}
                  </div>
                ))}
              </div>
              <div style={{ background: t.surface, borderRadius: 10, padding: 24, boxShadow: t.shadow }}>
                <p style={{ fontSize: 11, color: t.textLight, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Ähnliche Artikel</p>
                {related.map((r) => (
                  <div key={r.id} onClick={() => router.push(`/artikel/${r.slug}`)}
                    style={{ paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${t.borderLight}`, cursor: 'pointer' }}>
                    <Chip label={r.tag} t={t} />
                    <p style={{ fontSize: 13, color: t.text, lineHeight: 1.4, marginTop: 8 }}>{r.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  )
}
