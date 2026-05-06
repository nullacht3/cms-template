# Neues Kundenprojekt einrichten

So setzt du dieses CMS-Template für einen neuen Kunden auf — in ca. 10 Minuten.

---

## Was du vorher brauchst

- [ ] **Supabase-Projekt** erstellt (kostenlos unter supabase.com)
- [ ] **Vercel-Account** (kostenlos unter vercel.com) — oder du nutzt deinen bestehenden
- [ ] Dieses Repository als Kopie / neues GitHub-Repo für den Kunden

---

## Schritt-für-Schritt

### 1. Projekt kopieren

```bash
# Option A: GitHub Fork / neues Repo anlegen, dann:
git clone https://github.com/dein-account/cms-template kunden-name
cd kunden-name
npm install
```

### 2. Supabase-Zugangsdaten besorgen

Im Supabase Dashboard → **Settings → API**:
- `Project URL` → z.B. `https://abcdef.supabase.co`
- `anon public` Key
- `service_role` Key *(nur für Setup, danach nicht mehr nötig)*

Für den Management Token → **supabase.com/dashboard/account/tokens** → "Generate new token"

### 3. Setup-Script ausführen

```bash
npm run setup
```

Das Script fragt interaktiv:
- Seitenname & Tagline
- Supabase-Zugangsdaten
- Admin-E-Mail & Passwort

Dann richtet es automatisch ein:
- ✅ `.env.local` mit Supabase-Keys
- ✅ Alle Datenbanktabellen + RLS-Regeln
- ✅ Standard-Branding (Header, Footer) mit Kundennamen
- ✅ Admin-User in Supabase Auth

### 4. Lokal testen

```bash
npm run dev
# → http://localhost:3000
# → http://localhost:3000/admin/login
```

### 5. Auf Vercel deployen

```bash
npx vercel --prod
```

Bei der ersten Deployment-Frage nach den Umgebungsvariablen:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Diese stehen bereits in `.env.local` — einfach übernehmen.

### 6. Domain verbinden (optional)

```bash
npx vercel domains add kunde-domain.de
```

Dann A-Record beim DNS-Anbieter: `@` → `76.76.21.21`

---

## Was der Kunde im Admin bearbeiten kann

| Bereich | Pfad |
|---------|------|
| Artikel schreiben | `/admin` → „+ Neuer Artikel" |
| Seiten bearbeiten (Impressum etc.) | `/admin/seiten` |
| Header / Logo / Menü | `/admin/einstellungen/header` |
| Footer | `/admin/einstellungen/footer` |

---

## Für jedes neue Projekt checken

- [ ] `NEUES_PROJEKT.md` — du liest das gerade ✓
- [ ] `npm run setup` ausführen
- [ ] In `/admin/einstellungen/header` Farben & Logo anpassen
- [ ] Impressum mit echten Kundendaten befüllen (`/admin/seiten/impressum`)
- [ ] Datenschutz aktualisieren (`/admin/seiten/datenschutz`)
- [ ] Ersten Artikel erstellen

---

## Schnell-Referenz: Alle Env-Variablen

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Der `service_role` Key kommt **nicht** in die `.env.local` — nur einmalig im Setup verwendet.
