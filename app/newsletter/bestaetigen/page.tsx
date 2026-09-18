'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'

const STATES = {
  success: {
    icon: '✓',
    iconColor: '#1a8a50',
    iconBg: 'rgba(26,138,80,0.1)',
    title: 'Anmeldung bestätigt!',
    text: 'Willkommen beim Newsletter von Der Ästhet. Sie erhalten künftig neue Artikel und Inhalte direkt in Ihr Postfach.',
  },
  already: {
    icon: '✓',
    iconColor: '#1a5a8a',
    iconBg: 'rgba(26,90,138,0.1)',
    title: 'Bereits bestätigt',
    text: 'Diese E-Mail-Adresse ist bereits für den Newsletter angemeldet.',
  },
  expired: {
    icon: '⏱',
    iconColor: '#c0392b',
    iconBg: 'rgba(192,57,43,0.1)',
    title: 'Link abgelaufen',
    text: 'Der Bestätigungslink ist abgelaufen (24h Gültigkeit). Bitte melden Sie sich erneut an.',
  },
  invalid: {
    icon: '✕',
    iconColor: '#c0392b',
    iconBg: 'rgba(192,57,43,0.1)',
    title: 'Ungültiger Link',
    text: 'Dieser Bestätigungslink ist ungültig oder wurde bereits verwendet.',
  },
}

function ConfirmContent() {
  const params = useSearchParams()
  const { t } = useTheme()
  const status = (params.get('status') || 'invalid') as keyof typeof STATES
  const state = STATES[status] || STATES.invalid

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '120px 28px 80px', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: state.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28, color: state.iconColor }}>
        {state.icon}
      </div>
      <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 32, fontWeight: 400, color: t.text, marginBottom: 16 }}>
        {state.title}
      </h1>
      <p style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.8, marginBottom: 36 }}>
        {state.text}
      </p>
      <Link href="/" style={{ display: 'inline-block', background: t.accent, color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
        Zur Startseite
      </Link>
    </div>
  )
}

export default function BestaetigenPage() {
  const { t } = useTheme()
  return (
    <>
      <Nav />
      <div style={{ minHeight: '70vh', background: t.bg }}>
        <Suspense fallback={<div style={{ padding: '120px 28px', textAlign: 'center', color: '#8aa0b8' }}>Lädt…</div>}>
          <ConfirmContent />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}
