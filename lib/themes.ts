import type { Theme } from './types'

export const THEMES: Record<string, Theme> = {
  beige: {
    bg: '#faf8f5', surface: '#ffffff', surfaceHover: '#f4f0ea',
    border: '#e8e2da', borderLight: '#f0ece6',
    text: '#1a1410', textMuted: '#5a4e46', textLight: '#a8998e',
    accent: '#1a1410', accentLight: 'rgba(26,20,16,0.05)',
    navBg: 'rgba(250,248,245,0.97)',
    shadow: '0 2px 16px rgba(26,20,16,0.07)', shadowHover: '0 8px 32px rgba(26,20,16,0.13)',
    tag: { bg: '#edeae4', color: '#5a4e46' },
    pill: { bg: '#edeae4', color: '#5a4e46', activeBg: '#1a1410', activeColor: '#fff' },
    separator: '#e8e2da', bodyClass: 'v-beige',
  },
  blau: {
    bg: '#f0f4f8', surface: '#ffffff', surfaceHover: '#e6edf4',
    border: '#c8d6e5', borderLight: '#d8e4ef',
    text: '#0f1e2e', textMuted: '#4a6278', textLight: '#8aa0b8',
    accent: '#1a5a8a', accentLight: 'rgba(26,90,138,0.07)',
    navBg: 'rgba(240,244,248,0.93)',
    shadow: '0 2px 20px rgba(15,30,46,0.07)', shadowHover: '0 6px 32px rgba(15,30,46,0.12)',
    tag: { bg: '#dce8f4', color: '#1a5a8a' },
    pill: { bg: '#dce8f4', color: '#1a5a8a', activeBg: '#1a5a8a', activeColor: '#fff' },
    separator: '#c8d6e5', bodyClass: 'v-blau',
  },
  rosa: {
    bg: '#faf4f4', surface: '#ffffff', surfaceHover: '#f5ecec',
    border: '#e8d4d4', borderLight: '#f0e0e0',
    text: '#1e1014', textMuted: '#7a5560', textLight: '#b89aa0',
    accent: '#a03050', accentLight: 'rgba(160,48,80,0.07)',
    navBg: 'rgba(250,244,244,0.93)',
    shadow: '0 2px 20px rgba(30,16,20,0.07)', shadowHover: '0 6px 32px rgba(30,16,20,0.12)',
    tag: { bg: '#f5dde4', color: '#a03050' },
    pill: { bg: '#f5dde4', color: '#a03050', activeBg: '#a03050', activeColor: '#fff' },
    separator: '#e8d4d4', bodyClass: 'v-rosa',
  },
  nacht: {
    bg: '#121418', surface: '#1a1e24', surfaceHover: '#202630',
    border: '#2c3440', borderLight: '#222830',
    text: '#e8e4de', textMuted: '#7a8a84', textLight: '#4a5a54',
    accent: '#c9a97a', accentLight: 'rgba(201,169,122,0.10)',
    navBg: 'rgba(18,20,24,0.94)',
    shadow: '0 2px 20px rgba(0,0,0,0.28)', shadowHover: '0 6px 32px rgba(0,0,0,0.40)',
    tag: { bg: 'rgba(201,169,122,0.15)', color: '#c9a97a' },
    pill: { bg: 'rgba(201,169,122,0.12)', color: '#c9a97a', activeBg: '#c9a97a', activeColor: '#121418' },
    separator: '#2c3440', bodyClass: 'v-nacht',
  },
}

export const CATEGORIES = ['Alle', 'Behandlungen', 'Trends', 'Wissen & Forschung', 'Ärzte & Kliniken']

// Display names for the 4 nav categories
export const CATEGORY_DISPLAY: Record<string, string> = {
  'Behandlungen': 'Treatments',
  'Trends': 'Beauty Trends',
  'Wissen & Forschung': 'Wissen & Forschung',
  'Ärzte & Kliniken': 'Sprechstunde',
}

// URL slug → DB category name
export const CATEGORY_SLUG_MAP: Record<string, string> = {
  'treatments': 'Behandlungen',
  'trends': 'Trends',
  'wissen': 'Wissen & Forschung',
  'sprechstunde': 'Ärzte & Kliniken',
}

export const CATEGORY_ORDER = ['Behandlungen', 'Trends', 'Wissen & Forschung', 'Ärzte & Kliniken']

export const POSTS = [
  { id: 1, category: 'Behandlungen', tag: 'Fachwissen', title: 'Fadenlifting: Wie funktioniert das minimalinvasive Lifting wirklich?', excerpt: 'Was genau passiert unter der Haut bei einem Fadenlifting — biologisch, mechanisch, langfristig? Ein Facharzt erklärt den Eingriff ohne Beschönigung.', readTime: '8 Min.', date: 'April 2026', featured: true, type: 'artikel' as const, photo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80', slug: 'fadenlifting' },
  { id: 2, category: 'Behandlungen', tag: 'Vergleich', title: 'Botox vs. Hyaluron: Zwei Wirkstoffe, zwei Philosophien — ein ehrlicher Vergleich', excerpt: 'Botulinumtoxin hemmt Muskeln, Hyaluronfiller füllt Volumen — doch die Entscheidung ist komplexer als sie scheint.', readTime: '6 Min.', date: 'April 2026', featured: false, type: 'liste' as const, photo: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80', slug: 'botox-vs-hyaluron' },
  { id: 3, category: 'Wissen & Forschung', tag: 'Studie', title: 'PRP Eigenbluttherapie: Was aktuelle klinische Studien zur Wirksamkeit sagen', excerpt: 'Plättchenreiches Plasma gilt als natürliche Alternative — doch was sagt die Forschung wirklich?', readTime: '10 Min.', date: 'März 2026', featured: false, type: 'artikel' as const, photo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', slug: 'prp-eigenbluttherapie' },
  { id: 4, category: 'Ärzte & Kliniken', tag: 'Interview', title: '»Diese OP hat die meisten unzufriedenen Patientinnen« — Dr. [Name], plastischer Chirurg München', excerpt: 'Ein erfahrener Münchner Facharzt spricht offen über Erwartungsmanagement, unrealistische Wünsche und die Eingriffe, bei denen er regelmäßig Nein sagt.', readTime: '12 Min.', date: 'März 2026', featured: false, type: 'interview' as const, photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80', slug: 'arzt-interview-erwartungsmanagement' },
  { id: 5, category: 'Trends', tag: 'Trend', title: 'Longevity trifft Ästhetik: Der Trend, der Schönheitsmedizin neu definiert', excerpt: 'Von Biomarker-Analysen bis Präventivästhetik — wie die Longevity-Bewegung die ästhetische Medizin verändert.', readTime: '7 Min.', date: 'Februar 2026', featured: false, type: 'artikel' as const, photo: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80', slug: 'longevity-aesthetik' },
  { id: 6, category: 'Ärzte & Kliniken', tag: 'Ratgeber', title: 'Woran erkenne ich einen seriösen Facharzt für ästhetische Medizin in München?', excerpt: 'Ausbildung, Zertifikate, Facharztbezeichnung — was wirklich zählt und welche Warnsignale Patientinnen kennen sollten.', readTime: '5 Min.', date: 'Januar 2026', featured: false, type: 'artikel' as const, photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80', slug: 'serioesen-facharzt-finden' },
  { id: 7, category: 'Behandlungen', tag: 'Kosten', title: 'Was kostet Botox in München 2026? Preise, Faktoren und worauf man achten sollte', excerpt: 'Zwischen 150 und 600 Euro — die Preisspanne bei Botulinumtoxin-Behandlungen in München ist enorm.', readTime: '6 Min.', date: 'Januar 2026', featured: false, type: 'liste' as const, photo: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80', slug: 'botox-kosten-muenchen' },
  { id: 8, category: 'Wissen & Forschung', tag: 'Mythen', title: '5 Botox-Mythen, die sich hartnäckig halten — und was Fachärzte wirklich sagen', excerpt: 'Eingefroren, süchtig machend, für immer? Die hartnäckigsten Missverständnisse rund um Botulinumtoxin.', readTime: '7 Min.', date: 'Dezember 2025', featured: false, type: 'liste' as const, photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80', slug: 'botox-mythen' },
  { id: 9, category: 'Trends', tag: 'Trend', title: 'Von Botox zu Biostimulatoren: Wohin entwickelt sich die minimalinvasive Medizin?', excerpt: 'Sculptra, Radiesse, Ellansé — eine neue Generation von Behandlungen setzt auf Geweberegeneration statt Volumenersatz.', readTime: '9 Min.', date: 'November 2025', featured: false, type: 'artikel' as const, photo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', slug: 'biostimulatoren-trend' },
]
