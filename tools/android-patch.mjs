// LOOT JUMPER – passt das von Capacitor erzeugte Android-Projekt an (läuft in GitHub Actions)
// - festes Hochformat
// - kein Neuladen bei Dichte-/Größenänderungen
// - Versionsnummer automatisch: versionCode = Build-Nummer, versionName = GAME_VER aus dem Spiel
import fs from 'node:fs';

const manifestPath = 'android/app/src/main/AndroidManifest.xml';
let m = fs.readFileSync(manifestPath, 'utf8');
if (!m.includes('android:screenOrientation')) {
  m = m.replace(/<activity\b/, '<activity android:screenOrientation="portrait"');
}
m = m.replace(/android:configChanges="([^"]*)"/, (all, v) => v.includes('density') ? all : `android:configChanges="${v}|density"`);
fs.writeFileSync(manifestPath, m);

const html = fs.readFileSync('www/index.html', 'utf8');
const ver = (html.match(/GAME_VER='([0-9.]+)'/) || [])[1] || '1.0.0';
const code = parseInt(process.env.GITHUB_RUN_NUMBER || '1', 10) + 10;

const gradlePath = 'android/app/build.gradle';
let g = fs.readFileSync(gradlePath, 'utf8');
g = g.replace(/versionCode\s+\d+/, `versionCode ${code}`).replace(/versionName\s+"[^"]*"/, `versionName "${ver}"`);
fs.writeFileSync(gradlePath, g);
console.log(`Android: Version ${ver} (Code ${code}), Hochformat aktiv`);
