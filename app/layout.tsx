import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/ThemeContext'
import { SiteSettingsProvider } from '@/context/SiteSettingsContext'
import { getSiteSettingsServer } from '@/lib/siteSettingsServer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Der Ästhet — Ästhetische Medizin mit wissenschaftlichem Anspruch',
  description: 'Fundiertes Fachwissen, kuratierte Listen und Interviews für alle, die Ästhetik wirklich verstehen wollen.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettingsServer()

  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteSettingsProvider {...siteSettings}>
          <ThemeProvider>{children}</ThemeProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  )
}
