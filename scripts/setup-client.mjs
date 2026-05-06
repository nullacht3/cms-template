#!/usr/bin/env node
// ============================================================
// CMS Template – Kunden-Setup-Script
// Verwendung: node scripts/setup-client.mjs
// ============================================================

import { createInterface } from 'readline'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Farben ───────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m', bold: '\x1b[1m',
  green: '\x1b[32m', blue: '\x1b[34m',
  yellow: '\x1b[33m', red: '\x1b[31m', gray: '\x1b[90m',
  cyan: '\x1b[36m',
}
const ok   = (s) => console.log(`${c.green}✓${c.reset} ${s}`)
const info = (s) => console.log(`${c.blue}→${c.reset} ${s}`)
const warn = (s) => console.log(`${c.yellow}⚠${c.reset}  ${s}`)
const err  = (s) => console.log(`${c.red}✗${c.reset} ${s}`)
const h    = (s) => console.log(`\n${c.bold}${c.cyan}${s}${c.reset}`)
const sep  = ()  => console.log(`${c.gray}${'─'.repeat(56)}${c.reset}`)

// ── Readline ─────────────────────────────────────────────────
const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = (q, def = '') => new Promise(resolve => {
  const hint = def ? ` ${c.gray}(${def})${c.reset}` : ''
  rl.question(`  ${q}${hint}: `, answer => resolve(answer.trim() || def))
})

// ── Supabase API helpers ──────────────────────────────────────
async function runSQL(projectRef, managementToken, sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${managementToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || JSON.stringify(data))
  return data
}

async function createAdminUser(projectRef, serviceRoleKey, email, password) {
  const supabaseUrl = `https://${projectRef}.supabase.co`
  const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, email_confirm: true }),
  })
  const data = await res.json()
  if (!res.ok) {
    if (data.message?.includes('already been registered')) return { existing: true }
    throw new Error(data.message || JSON.stringify(data))
  }
  return data
}

// ── Env file ─────────────────────────────────────────────────
function writeEnvFile(supabaseUrl, anonKey) {
  const content = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}\n`
  const envPath = join(ROOT, '.env.local')
  writeFileSync(envPath, content)
}

// ── Projekt-Ref aus URL extrahieren ──────────────────────────
function extractRef(supabaseUrl) {
  const match = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)
  if (!match) throw new Error(`Ungültige Supabase-URL: ${supabaseUrl}`)
  return match[1]
}

// ── MAIN ─────────────────────────────────────────────────────
async function main() {
  console.clear()
  console.log(`\n${c.bold}${c.cyan}╔══════════════════════════════════════════════════════╗${c.reset}`)
  console.log(`${c.bold}${c.cyan}║       CMS Template – Neues Kundenprojekt einrichten   ║${c.reset}`)
  console.log(`${c.bold}${c.cyan}╚══════════════════════════════════════════════════════╝${c.reset}\n`)

  // ── Schritt 1: Kundeninfos ──────────────────────────────────
  h('Schritt 1 — Kundeninformationen')
  sep()
  const siteName   = await ask('Seitenname (z.B. "Zahnarztpraxis Müller")')
  const tagline    = await ask('Tagline / Kurzbeschreibung')
  const year       = new Date().getFullYear()
  const copyright  = await ask('Copyright-Text', `© ${year} ${siteName}`)

  // ── Schritt 2: Supabase ─────────────────────────────────────
  h('Schritt 2 — Supabase-Projekt')
  sep()
  info('Supabase-Zugangsdaten findest du unter:')
  info('  supabase.com/dashboard → Projekt → Settings → API')
  console.log()
  const supabaseUrl       = await ask('Supabase URL (https://xxx.supabase.co)')
  const anonKey           = await ask('Anon Key (public)')
  const serviceRoleKey    = await ask('Service Role Key (geheim, nur für Setup)')
  const managementToken   = await ask('Management API Token (supabase.com/dashboard/account/tokens)')

  // ── Schritt 3: Admin-Account ────────────────────────────────
  h('Schritt 3 — Admin-Zugangsdaten')
  sep()
  const adminEmail    = await ask('Admin E-Mail')
  const adminPassword = await ask('Admin Passwort (min. 8 Zeichen)')

  // ── Bestätigung ─────────────────────────────────────────────
  h('Zusammenfassung')
  sep()
  console.log(`  Seitenname:   ${c.bold}${siteName}${c.reset}`)
  console.log(`  Supabase:     ${c.bold}${supabaseUrl}${c.reset}`)
  console.log(`  Admin:        ${c.bold}${adminEmail}${c.reset}`)
  console.log()
  const confirm = await ask('Alles richtig? Setup starten? (j/n)', 'j')
  if (confirm.toLowerCase() !== 'j') {
    warn('Abgebrochen.')
    rl.close()
    process.exit(0)
  }

  console.log()
  let projectRef
  try {
    projectRef = extractRef(supabaseUrl)
  } catch (e) {
    err(e.message)
    rl.close()
    process.exit(1)
  }

  // ── .env.local schreiben ────────────────────────────────────
  info('.env.local schreiben…')
  try {
    writeEnvFile(supabaseUrl, anonKey)
    ok('.env.local erstellt')
  } catch (e) {
    err(`Fehler: ${e.message}`)
  }

  // ── Datenbankschema einrichten ──────────────────────────────
  info('Datenbankschema einrichten…')
  try {
    const schema = readFileSync(join(__dirname, 'sql/001_schema.sql'), 'utf8')
    await runSQL(projectRef, managementToken, schema)
    ok('Tabellen & RLS-Policies erstellt')
  } catch (e) {
    err(`Schema-Fehler: ${e.message}`)
    warn('Du kannst scripts/sql/001_schema.sql manuell im Supabase SQL-Editor ausführen.')
  }

  // ── Seed-Daten mit Kundennamen ──────────────────────────────
  info('Branding-Daten eintragen…')
  try {
    let seed = readFileSync(join(__dirname, 'sql/002_seed.sql'), 'utf8')
    seed = seed
      .replaceAll('{{SITE_NAME}}', siteName.replace(/'/g, "''"))
      .replaceAll('{{TAGLINE}}',   tagline.replace(/'/g, "''"))
      .replaceAll('{{COPYRIGHT}}', copyright.replace(/'/g, "''"))
    await runSQL(projectRef, managementToken, seed)
    ok(`Branding für "${siteName}" eingetragen`)
  } catch (e) {
    err(`Seed-Fehler: ${e.message}`)
  }

  // ── Admin-User erstellen ────────────────────────────────────
  info(`Admin-User erstellen (${adminEmail})…`)
  try {
    const result = await createAdminUser(projectRef, serviceRoleKey, adminEmail, adminPassword)
    if (result.existing) {
      warn(`User ${adminEmail} existiert bereits — Passwort wurde nicht geändert.`)
    } else {
      ok(`Admin-User ${adminEmail} erstellt`)
    }
  } catch (e) {
    err(`User-Fehler: ${e.message}`)
  }

  // ── Fertig ──────────────────────────────────────────────────
  console.log()
  sep()
  console.log(`\n${c.green}${c.bold}✓ Setup abgeschlossen!${c.reset}\n`)
  console.log(`  ${c.bold}Nächste Schritte:${c.reset}`)
  console.log(`  1. ${c.cyan}npm run dev${c.reset}  →  lokaler Entwicklungsserver`)
  console.log(`  2. ${c.cyan}npx vercel --prod${c.reset}  →  auf Vercel deployen`)
  console.log(`  3. Admin-Login: ${c.cyan}/admin/login${c.reset}`)
  console.log(`     E-Mail:    ${adminEmail}`)
  console.log(`     Passwort:  ${adminPassword}`)
  console.log()
  console.log(`  ${c.yellow}Hinweis:${c.reset} Service Role Key nicht in .env.local eintragen`)
  console.log(`  — dieser wurde nur einmalig für das Setup verwendet.\n`)

  rl.close()
}

main().catch(e => {
  err(`Unerwarteter Fehler: ${e.message}`)
  process.exit(1)
})
