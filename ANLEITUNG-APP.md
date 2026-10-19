# LOOT JUMPER – Website + Android-App automatisch bauen

Ab jetzt baut GitHub bei jedem Hochladen automatisch:

- die **Website** (Spiel + Datenschutz + Impressum, Schriften lokal statt von Google)
- die **Android-App** für den Play Store

Du musst das hier **nur einmal** einrichten. Danach lädst du wie gewohnt nur die neue `index.html` hoch.

---

## Schritt 1: Datenschutz und Impressum ausfüllen

1. Öffne `datenschutz.html` und `impressum.html` mit einem Texteditor.
2. Ersetze alle Stellen in **[ECKIGEN KLAMMERN]**:
   - Name, Adresse, E-Mail
   - Datum in der Datenschutzerklärung
   - die Supabase-Region (steht in Supabase unter **Project Settings → General**, z. B. „Central EU (Frankfurt)“)
3. Speichern.

Hinweis: Das sind Vorlagen und keine Rechtsberatung. Wenn du unsicher bist, lass sie kurz prüfen.

## Schritt 2: Dateien ins GitHub-Repository hochladen

Lade den **gesamten Inhalt** des Ordners `loot-jumper-repo` hoch (nicht den Ordner selbst):

```
.github/workflows/build.yml
assets/icon-only.png
tools/build.mjs
tools/android-patch.mjs
capacitor.config.json
package.json
datenschutz.html
impressum.html
icon-512.png
index.html
```

So geht's: Im Repository **Add file → Upload files**, alles hineinziehen, **Commit changes**.

Falls der Ordner `.github` beim Hochladen fehlt (er ist „versteckt“):

1. **Add file → Create new file**
2. Als Dateiname tippen: `.github/workflows/build.yml` (die Schrägstriche legen die Ordner automatisch an)
3. Inhalt der Datei `build.yml` hineinkopieren → **Commit changes**

## Schritt 3: GitHub Pages auf „GitHub Actions“ umstellen

1. Repository → **Settings** → links **Pages**
2. Unter „Build and deployment“ → **Source**: **GitHub Actions** auswählen

Der Link zu deinem Spiel bleibt gleich.

## Schritt 4: Signatur-Schlüssel hinterlegen (für den Play Store)

Du hast von mir einen Ordner **loot-jumper-SCHLUESSEL** bekommen. **Diesen Ordner niemals ins Repository hochladen!**

1. Repository → **Settings** → links **Secrets and variables → Actions**
2. **New repository secret** – viermal, mit den Namen und Werten aus `GEHEIM-zugangsdaten.txt`:
   - `ANDROID_KEYSTORE_BASE64` (gesamter Inhalt von `upload.jks.base64.txt`)
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`
3. Bewahre den Schlüssel-Ordner sicher auf (z. B. USB-Stick und Passwort-Manager).

## Schritt 5: Build starten und App herunterladen

1. Repository → oben **Actions** → links **Build**
2. Rechts **Run workflow** → **Run workflow** (oder einfach eine Datei hochladen, dann startet er von selbst)
3. Nach ca. 5–10 Minuten haben alle drei Teile einen grünen Haken:
   - Website bauen
   - Website veröffentlichen
   - Android-App bauen
4. Den Lauf anklicken → ganz unten unter **Artifacts** → **loot-jumper-android** herunterladen (ZIP)

Darin sind:

- `app-release.aab` → diese Datei kommt in die **Google Play Console**
- `app-release.apk` → kannst du direkt auf dein Android-Handy kopieren und installieren, um die App zu testen

**Wenn etwas rot wird:** den roten Schritt anklicken, die letzten ~30 Zeilen der Fehlermeldung kopieren und mir schicken.

## Später: neue Version veröffentlichen

1. Neue `index.html` hochladen
2. Warten, bis der Build grün ist
3. Website ist automatisch aktuell
4. Für den Play Store: neue `app-release.aab` aus den Artifacts in der Play Console hochladen. Die Versionsnummer zählt automatisch hoch.
