'use client'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { useTheme } from '@/context/ThemeContext'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { t } = useTheme()
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 22, fontWeight: 500, color: t.text, marginBottom: 14, letterSpacing: '-0.01em' }}>{title}</h2>
      <div style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.85 }}>{children}</div>
    </div>
  )
}

export default function DatenschutzPage() {
  const { t } = useTheme()

  return (
    <>
      <Nav />
      <div className="page-padding" style={{ maxWidth: 720, margin: '0 auto', padding: '100px 28px 100px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 42, fontWeight: 400, color: t.text, letterSpacing: '-0.02em', marginBottom: 12 }}>Datenschutzerklärung</h1>
        <p style={{ fontSize: 13, color: t.textLight, marginBottom: 56 }}>Stand: September 2026 · gemäß DSGVO und BDSG</p>

        <Section title="1. Verantwortliche">
          <p>Ronja Menzel<br />Einsteinstraße 129<br />81675 München<br />E-Mail: <a href="mailto:info@nullachtdrei.de" style={{ color: t.accent, textDecoration: 'none' }}>info@nullachtdrei.de</a></p>
        </Section>

        <Section title="2. Allgemeines zur Datenverarbeitung">
          <p style={{ marginBottom: 12 }}>Wir verarbeiten personenbezogene Daten unserer Nutzerinnen und Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.</p>
          <p>Die Rechtsgrundlage für die Verarbeitung personenbezogener Daten ergibt sich aus Art. 6 Abs. 1 DSGVO.</p>
        </Section>

        <Section title="3. Hosting & technischer Betrieb">
          <p style={{ marginBottom: 12 }}>Diese Website wird bei <strong style={{ color: t.text, fontWeight: 500 }}>Vercel Inc.</strong>, 340 Pine Street, Suite 701, San Francisco, CA 94104, USA gehostet. Beim Besuch der Website werden automatisch Verbindungsdaten (IP-Adresse, Datum/Uhrzeit, aufgerufene Seite) in Server-Logfiles gespeichert.</p>
          <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb der Website).</p>
        </Section>

        <Section title="4. Externe Inhalte & Bilder">
          <p>Diese Website verwendet Bilder von <strong style={{ color: t.text, fontWeight: 500 }}>Unsplash</strong> (Unsplash Inc., 500 rue Notre-Dame Ouest, Montréal, QC, Kanada). Beim Laden dieser Bilder kann Ihre IP-Adresse an die Server von Unsplash übermittelt werden. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
        </Section>

        <Section title="5. Schriftarten (Google Fonts)">
          <p>Diese Website lädt Schriftarten von den Servern von Google (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Dabei wird Ihre IP-Adresse übermittelt. Google Fonts wird auf Basis von Art. 6 Abs. 1 lit. f DSGVO eingebunden (berechtigtes Interesse an einheitlicher Darstellung).</p>
        </Section>

        <Section title="6. Webanalyse mit Google Analytics">
          <p style={{ marginBottom: 12 }}>Sofern Sie eingewilligt haben, nutzen wir <strong style={{ color: t.text, fontWeight: 500 }}>Google Analytics 4</strong>, einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Google Analytics setzt Cookies und erfasst Informationen über die Nutzung dieser Website, etwa aufgerufene Seiten, Verweildauer, ungefähre Region, Gerät und Browser. IP-Adressen werden in Google Analytics 4 nicht gespeichert.</p>
          <p style={{ marginBottom: 12 }}>Die Daten können an Server der Google LLC in den USA übermittelt werden. Google LLC ist unter dem EU-US Data Privacy Framework zertifiziert, auf dessen Grundlage die Übermittlung erfolgt. Die Daten werden nach 14 Monaten gelöscht.</p>
          <p style={{ marginBottom: 12 }}>Google Analytics wird erst geladen, nachdem Sie im Cookie-Banner zugestimmt haben. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Sie können Ihre Einwilligung jederzeit über den Link „Cookie-Einstellungen“ am Ende jeder Seite widerrufen.</p>
          <p>Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: t.accent, textDecoration: 'none' }}>policies.google.com/privacy</a></p>
        </Section>

        <Section title="7. Ihre Rechte">
          <p style={{ marginBottom: 12 }}>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            {[
              'Recht auf Auskunft (Art. 15 DSGVO)',
              'Recht auf Berichtigung (Art. 16 DSGVO)',
              'Recht auf Löschung (Art. 17 DSGVO)',
              'Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)',
              'Recht auf Datenübertragbarkeit (Art. 20 DSGVO)',
              'Recht auf Widerspruch (Art. 21 DSGVO)',
              'Recht auf Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)',
            ].map((r) => (
              <li key={r} style={{ marginBottom: 6 }}>{r}</li>
            ))}
          </ul>
          <p>Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: <a href="mailto:info@nullachtdrei.de" style={{ color: t.accent, textDecoration: 'none' }}>info@nullachtdrei.de</a></p>
        </Section>

        <Section title="8. Beschwerderecht">
          <p>Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren. In Bayern ist dies das Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach.</p>
        </Section>

        <Section title="9. Aktualität dieser Erklärung">
          <p>Diese Datenschutzerklärung ist aktuell gültig und hat den Stand September 2026. Durch die Weiterentwicklung unserer Website kann eine Anpassung notwendig werden.</p>
        </Section>
      </div>
      <Footer />
    </>
  )
}
