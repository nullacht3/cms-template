@AGENTS.md

# Der Ästhet — Projektstand

Deutsches Magazin für ästhetische Medizin. Domain: **deraesthet.de**  
Vercel-Deploy via `vercel deploy --prod` (kein git push → Vercel, da große Binärdateien in der History waren).

---

## Stack

| Schicht | Technologie |
|---|---|
| Framework | Next.js App Router (Server + Client Components) |
| Datenbank | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (Bucket: `images`) |
| Styling | Inline-Styles + globals.css (kein Tailwind) |
| Fonts | DM Sans (Headlines + Fließtext), Cormorant Garant (nur noch H1-Titel) |
| Deploy | Vercel (`vercel deploy --prod`) |
| Repo | github.com/nullacht3/cms-template (privat) |

---

## Architektur

```
app/
  [slug]/page.tsx          ← Artikel-Detail (slug direkt auf Root: /polynukleotide-erfahrungen)
  kategorien/page.tsx      ← Kategorie-Übersicht mit Filter + Suche
  admin/                   ← CMS (Auth-geschützt via middleware.ts)
  api/                     ← Newsletter subscribe/confirm, Media, Users
  layout.tsx               ← ThemeProvider, Google Fonts

components/
  Nav.tsx                  ← Hamburger (Mobile), localStorage-Cache gegen Logo-Flash, Suspense
  HomeClient.tsx           ← Elle-Stil: Kategorie-Sections mit gemischtem Grid
  PostCard.tsx             ← size: 'large'|'medium'|'small'|'featured'
  ArticlePageClient.tsx    ← Artikel-Seite, lädt HTML-Content aus Supabase
  ArticleEditor.tsx        ← Admin-CMS-Editor

lib/
  themes.ts                ← 4 Themes (beige/blau/rosa/nacht) + CATEGORY_SLUG_MAP + CATEGORY_ORDER
  siteSettings.ts          ← getHeaderSettings(), nav_items immer aus Code (nicht aus DB)
  getArticles.ts           ← Supabase-Fetch + Fallback auf POSTS
```

---

## Design-Entscheidungen

- **Elle-Stil**: Große Kategorie-Überschriften (DM Sans 800 uppercase), gemischtes Grid (1 groß + n klein)
- **Keine Rundungen**: `borderRadius: 0` überall (Chips, Buttons, Inputs, Cards)
- **Keine Schatten**: `border: 1px solid t.border` statt `box-shadow`
- **Keine ThemeSwitcher**: Farben-Umschalter wurde entfernt
- **Artikel-Seite**: DM Sans 17px / lineHeight 1.9 / schwarze Schrift (`t.text`), H2 700 weight
- **Mobile Nav**: Hamburger-Menü, logo immer sichtbar

### Kategorie-Mapping (URL-Slug → DB-Wert)
```ts
treatments  → Behandlungen
trends      → Trends
wissen      → Wissen & Forschung
sprechstunde → Ärzte & Kliniken
```

---

## Supabase — Tabellen & RLS

RLS ist auf allen Tabellen aktiviert.

| Tabelle | RLS | Policies |
|---|---|---|
| `articles` | ✓ | SELECT: `published = true` (public) · ALL: `auth.uid() IS NOT NULL` |
| `pages` | ✓ | SELECT: alle (public) · ALL: authenticated |
| `site_settings` | ✓ | SELECT: alle (public) · ALL: authenticated |
| `newsletter_subscribers` | ✓ | INSERT: alle · SELECT + DELETE: authenticated |
| `kontakt_nachrichten` | ✓ | INSERT: alle · SELECT + UPDATE + DELETE: authenticated |
| `media` | ✓ | SELECT: public · ALL: authenticated (empirisch geprüft; Policies in `004_media_rls.sql` dokumentiert) |
| `storage.objects` (images) | ✓ | SELECT: public · INSERT + DELETE: authenticated |

> Die `media`-Tabelle-Policies wurden manuell im Supabase-Dashboard gesetzt und sind in `scripts/sql/004_media_rls.sql` dokumentiert. Migration muss bei DB-Neuerstellung manuell im SQL-Editor ausgeführt werden (kein REST-Zugang für Raw SQL).

---

## Secrets & Umgebungsvariablen

`.env.local` liegt **nur lokal** und ist per `.gitignore` ausgeschlossen.  
Die Datei war in alten Commits enthalten (nur `NEXT_PUBLIC_`-Werte, nicht der Service-Role-Key) — wurde mit `git filter-repo` vollständig aus der History entfernt.

| Variable | Geheim? | Zweck |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Nein | Supabase-Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Nein | Client-seitiger Zugriff (RLS greift) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Ja** | Server-seitiger Admin-Zugriff (umgeht RLS) |

Auf Vercel müssen alle drei als Environment Variables hinterlegt sein.

---

## Deploy

```bash
cd next-app
vercel deploy --prod
```

Kein `git push → Vercel`-Integration, weil Binärdateien in der Git-History stören.  
GitHub-Repo dient als reines Code-Backup.

---

## Offene To-dos

- [x] **RLS für `media`-Tabelle** — aktiv und korrekt (SELECT public, schreiben nur auth)
- [ ] **Titelbild für Polynukleotide-Artikel** — User liefert es nach, dann im Admin hochladen
- [ ] **Artikel-URL-Routing testen**: Sicherstellen dass `/[slug]` nicht mit anderen Top-Level-Routen kollidiert (z.B. `/kategorien`, `/impressum`)
- [ ] **Vercel Environment Variables** kontrollieren: alle drei `.env.local`-Werte müssen dort hinterlegt sein
- [ ] **`media`-Tabelle im Schema dokumentieren**: fehlt in `001_schema.sql`
- [ ] **Admin-Auth testen**: middleware.ts schützt `/admin` — prüfen ob Redirect auf `/admin/login` korrekt funktioniert
- [ ] **Newsletter-Bestätigungs-E-Mail**: `/api/newsletter/confirm` vorhanden, aber E-Mail-Template in Supabase konfiguriert?
