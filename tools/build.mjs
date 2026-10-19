// LOOT JUMPER – Build-Skript (läuft automatisch in GitHub Actions)
// 1. Ersetzt die Google-Fonts-Links in index.html durch lokal mitgelieferte Schriften (Datenschutz)
// 2. Baut "dist/" (Website für GitHub Pages) und "www/" (Inhalt der Android-App)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// --- Schriften aus den @fontsource-Paketen einsammeln ---
const FONT_CSS = [
  'node_modules/@fontsource/bungee/400.css',
  'node_modules/@fontsource/chakra-petch/400.css',
  'node_modules/@fontsource/chakra-petch/500.css',
  'node_modules/@fontsource/chakra-petch/600.css',
  'node_modules/@fontsource/chakra-petch/700.css',
];
const fontFiles = new Map(); // Dateiname -> Quellpfad
let fontCss = '';
for (const rel of FONT_CSS) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { console.warn('Schrift-CSS fehlt:', rel); continue; }
  const dir = path.dirname(abs);
  let css = fs.readFileSync(abs, 'utf8');
  css = css.replace(/url\((['"]?)\.\/files\/([^'")]+)\1\)/g, (_, q, file) => {
    fontFiles.set(file, path.join(dir, 'files', file));
    return `url(fonts/${file})`;
  });
  fontCss += css + '\n';
}
console.log(`Schriften: ${fontFiles.size} Dateien`);

// --- index.html anpassen ---
let html = read('index.html');
html = html
  .replace(/<link[^>]+fonts\.googleapis\.com[^>]*>\s*/g, '')
  .replace(/<link[^>]+fonts\.gstatic\.com[^>]*>\s*/g, '');
if (fontCss) html = html.replace('</head>', `<style>\n${fontCss}</style>\n</head>`);
if (!/rel="icon"/.test(html)) html = html.replace('</head>', '<link rel="icon" type="image/png" href="icon-512.png">\n</head>');
if (/fonts\.googleapis\.com/.test(html)) throw new Error('Google-Fonts-Link konnte nicht entfernt werden');

// --- Ausgabeordner schreiben ---
const COPY = ['datenschutz.html', 'impressum.html', 'icon-512.png'];
for (const out of ['dist', 'www']) {
  const o = path.join(ROOT, out);
  fs.rmSync(o, { recursive: true, force: true });
  fs.mkdirSync(path.join(o, 'fonts'), { recursive: true });
  fs.writeFileSync(path.join(o, 'index.html'), html);
  for (const [name, src] of fontFiles) fs.copyFileSync(src, path.join(o, 'fonts', name));
  for (const f of COPY) if (fs.existsSync(path.join(ROOT, f))) fs.copyFileSync(path.join(ROOT, f), path.join(o, f));
  console.log(`${out}/ fertig`);
}
// GitHub Pages: keine Jekyll-Verarbeitung
fs.writeFileSync(path.join(ROOT, 'dist', '.nojekyll'), '');
