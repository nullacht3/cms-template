'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { NewsletterForm } from '@/components/NewsletterForm'
import { useTheme } from '@/context/ThemeContext'
import { getArticles } from '@/lib/getArticles'
import { createClient } from '@/lib/supabase/client'
import type { Theme, Post } from '@/lib/types'

function TagLabel({ label, t }: { label: string; t: Theme }) {
  return <span style={{ background: t.tag.bg, color: t.tag.color, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 9px', borderRadius: 0, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
}

function PostImage({ src, t }: { src: string; t: Theme }) {
  return (
    <div style={{ width: '100%', paddingBottom: '52%', position: 'relative', overflow: 'hidden', background: t.surfaceHover, marginBottom: 48 }}>
      {src && <img src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
    </div>
  )
}

function ArticleBody({ t, type }: { t: Theme; type: string }) {
  const prose = { fontSize: 17, lineHeight: 1.9, color: t.text, marginBottom: 26, fontFamily: "'DM Sans', sans-serif" }
  const h2Style = { fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 16, marginTop: 48, letterSpacing: '-0.01em' }

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
          <div key={nr} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: '0 20px', marginBottom: 20, padding: '20px 0', borderBottom: `1px solid ${t.borderLight}` }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: t.textLight, lineHeight: 1.6, letterSpacing: '0.04em' }}>{nr}</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: 16, color: t.text, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{title}</p>
              <p style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
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
          <div key={i} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: `1px solid ${t.borderLight}` }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: t.text, marginBottom: 14, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>— {q}</p>
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
      <blockquote style={{ borderLeft: `3px solid ${t.text}`, paddingLeft: 24, margin: '32px 0', fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' as const, fontSize: 18, lineHeight: 1.7, color: t.text }}>»Das Ziel ist nicht die perfekte Nase, sondern die richtige Nase für dieses Gesicht.«</blockquote>
      <h2 style={h2Style}>Klinische Evidenz & Langzeitergebnisse</h2>
      <p style={prose}>Mehrere prospektive Studien belegen, dass Preservation-Techniken zu höheren Patientenzufriedenheitswerten führen — besonders in der 5-Jahres-Nachbeobachtung. Die Lernkurve ist jedoch steil und setzt anatomisches Detailwissen voraus.</p>
      <h2 style={h2Style}>Fazit & klinische Empfehlung</h2>
      <p style={prose}>Die strukturelle Rhinoplastik nach Preservation-Prinzip bietet für geeignete Kandidaten klare Vorteile. Entscheidend bleibt die sorgfältige Patientenselektion und eine ehrliche präoperative Kommunikation.</p>
    </div>
  )
}

export function ArticlePageClient({ slug, initialPost, initialHtml }: { slug: string; initialPost: Post; initialHtml?: string }) {
  const { t } = useTheme()
  const router = useRouter()
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [htmlContent, setHtmlContent] = useState<string | null>(initialHtml ?? null)

  useEffect(() => { getArticles().then(setAllPosts) }, [])

  useEffect(() => {
    if (initialHtml) return
    async function loadContent() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('articles').select('content').eq('slug', slug).single()
        if (data?.content) setHtmlContent(data.content)
      } catch { /* fallback */ }
    }
    loadContent()
  }, [slug, initialHtml])

  const p = initialPost
  const related = allPosts.filter((x) => x.slug !== p.slug).slice(0, 3)

  return (
    <>
      <Nav />
      <div className="page-padding" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 28px 80px', overflowX: 'hidden' }}>

        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: 13, marginBottom: 48, fontFamily: "'DM Sans', sans-serif" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3 L5 8 L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Zurück
        </button>

        <div className="article-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 72 }}>
          <article style={{ minWidth: 0, overflow: 'hidden' }}>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' as const }}>
              <TagLabel label={p.tag} t={t} />
              <span style={{ fontSize: 12, color: t.textLight, fontFamily: "'DM Sans', sans-serif" }}>{p.category}</span>
              <span style={{ fontSize: 12, color: t.borderLight }}>·</span>
              <span style={{ fontSize: 12, color: t.textLight, fontFamily: "'DM Sans', sans-serif" }}>{p.readTime} Lesezeit</span>
            </div>

            {/* Title */}
            <h1 className="article-title" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: t.text,
              marginBottom: 24,
              letterSpacing: '-0.03em',
              wordBreak: 'break-word',
            }}>{p.title}</h1>

            {/* Lead / excerpt */}
            <p className="article-excerpt" style={{
              fontSize: 19,
              lineHeight: 1.75,
              color: t.text,
              marginBottom: 36,
              paddingBottom: 36,
              borderBottom: `1px solid ${t.separator}`,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
            }}>{p.excerpt}</p>

            <PostImage src={p.photo} t={t} />

            {htmlContent ? (
              <div className="article-html-content" style={{ fontSize: 17, lineHeight: 1.9, color: t.text }}
                dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
              <ArticleBody t={t} type={p.type} />
            )}

            <div style={{ marginTop: 64 }}>
              <NewsletterForm />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="article-sidebar" style={{ paddingTop: 4 }}>
            <div style={{ position: 'sticky', top: 90 }}>
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, padding: '20px 20px', marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: t.textLight, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Ähnliche Artikel</p>
                {related.map((r) => (
                  <div key={r.id} onClick={() => router.push(`/${r.slug}`)}
                    style={{ paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid ${t.borderLight}`, cursor: 'pointer' }}>
                    <TagLabel label={r.tag} t={t} />
                    <p style={{ fontSize: 14, color: t.text, lineHeight: 1.45, marginTop: 8, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{r.title}</p>
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
