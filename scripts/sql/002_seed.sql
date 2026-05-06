-- ============================================================
-- Seed-Daten – werden vom Setup-Script mit Kundendaten befüllt
-- Platzhalter {{SITE_NAME}}, {{TAGLINE}}, {{COPYRIGHT}} werden ersetzt
-- ============================================================

INSERT INTO public.site_settings (key, value) VALUES
('header', jsonb_build_object(
  'site_name',  '{{SITE_NAME}}',
  'logo_url',   '',
  'tagline',    '{{TAGLINE}}',
  'nav_items',  '[{"label":"Start","href":"/"},{"label":"Blog","href":"/"},{"label":"Kontakt","href":"/kontakt"}]'::jsonb
)),
('footer', jsonb_build_object(
  'copyright',    '{{COPYRIGHT}}',
  'tagline',      '{{TAGLINE}}',
  'legal_links',  '[{"label":"Impressum","href":"/impressum"},{"label":"Datenschutz","href":"/datenschutz"},{"label":"Kontakt","href":"/kontakt"}]'::jsonb
))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

INSERT INTO public.pages (slug, title) VALUES
('impressum',   'Impressum'),
('datenschutz', 'Datenschutzerklärung'),
('kontakt',     'Kontakt')
ON CONFLICT (slug) DO NOTHING;
