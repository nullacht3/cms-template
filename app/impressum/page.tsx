'use client'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { useTheme } from '@/context/ThemeContext'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { t } = useTheme()
  return (
    <div style={{ marginBottom: 36 }}>
      <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: t.textLight, marginBottom: 10, fontWeight: 500 }}>{title}</p>
      <div style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.8 }}>{children}</div>
    </div>
  )
}

export default function ImpressumPage() {
  const { t } = useTheme()

  return (
    <>
      <Nav />
      <div className="page-padding" style={{ maxWidth: 720, margin: '0 auto', padding: '100px 28px 100px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 42, fontWeight: 400, color: t.text, letterSpacing: '-0.02em', marginBottom: 12 }}>Impressum</h1>
        <p style={{ fontSize: 13, color: t.textLight, marginBottom: 56 }}>Angaben gemäß § 5 TMG</p>

        <Section title="Herausgeber">
          <p>Ronja Menzel</p>
          <p>Einsteinstraße 129</p>
          <p>81675 München</p>
        </Section>

        <Section title="Kontakt">
          <p>E-Mail: <a href="mailto:info@nullachtdrei.de" style={{ color: t.accent, textDecoration: 'none' }}>info@nullachtdrei.de</a></p>
        </Section>

        <Section title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
          <p>Ronja Menzel</p>
          <p>Einsteinstraße 129</p>
          <p>81675 München</p>
        </Section>

        <div style={{ borderTop: `1px solid ${t.separator}`, paddingTop: 36, marginTop: 8 }}>
          <Section title="Haftungsausschluss">
            <p style={{ marginBottom: 16 }}>
              <strong style={{ color: t.text, fontWeight: 500 }}>Haftung für Inhalte</strong><br />
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Die Inhalte dienen ausschließlich der allgemeinen Information und ersetzen keine medizinische Beratung durch einen approbierten Arzt.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong style={{ color: t.text, fontWeight: 500 }}>Haftung für Links</strong><br />
              Diese Website enthält Links zu externen Webseiten Dritter. Auf deren Inhalte haben wir keinen Einfluss und übernehmen daher keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
            </p>
            <p>
              <strong style={{ color: t.text, fontWeight: 500 }}>Urheberrecht</strong><br />
              Die durch die Seitenbetreiberin erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung der jeweiligen Autorin.
            </p>
          </Section>
        </div>
      </div>
      <Footer />
    </>
  )
}
