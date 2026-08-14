---
name: video-photo-reel
description: Produit un Reel vidéo narré (1080×1920, ~30 s) sur une personnalité ou un pays à partir de VRAIES photos (Wikimedia), avec voix off ElevenLabs et sous-titres karaoké. À utiliser quand le sujet est une PERSONNE RÉELLE identifiable (dirigeant, patron) ou un lieu précis, car le pipeline IA standard (video-journalist) génère un FAUX visage via Flux. Reprend les chiffres déjà fact-checkés d'un batch photo-stat. Déclencheurs : "vidéo sur [personnalité]", "reel Milei/Bukele/Musk/Arnault", "vidéo avec de vraies photos", "transforme ce bilan en vidéo", "vidéo voix off sur X".
---

# video-photo-reel

Reel vertical narré (**1080×1920, ~30 s**) construit à partir de **vraies photos** d'un sujet identifiable. Voix clonée ElevenLabs + sous-titres karaoké jaune + logo OVLA + écran final « Abonne-toi ». Coût ≈ 0,10 $ (ElevenLabs seul, pas de Kling/Flux).

## Pourquoi ce script et pas `video-journalist`
Le pipeline `video-journalist` (v24+) est **100 % IA générative** : chaque beat devient une image Flux ou une vidéo Kling **générée depuis un prompt**. Pour une personne réelle (Milei, Musk, Arnault…), Flux produit un **visage inventé** — inacceptable pour un média factuel. Ce skill injecte donc de **vraies photos** dans le moteur de montage Remotion existant.

## Script & moteur
- **Générateur** : `Site/scripts/video-photo-reel.js` (config JSON → voix → montage)
- **Réutilise** : `video-modules/voice-generator.js` (ElevenLabs + timings) et `video-modules/video-assembler.js` (Remotion, Ken Burns sur les photos)
- **Sortie** : `Production interne/Réseaux Sociaux /Articles/<date>/<slug>/video.mp4` (+ audio.mp3, script.md)

## Pipeline en 4 étapes

### 1. Réutiliser les chiffres fact-checkés
Repartir d'un batch `photo-stat-card` déjà fait (mêmes chiffres sourcés) ou lancer le fact-check d'abord. Aucun chiffre non vérifié.

### 2. Récupérer 8-10 VRAIES photos distinctes (Wikimedia Commons)
Le scraper Google est en panne. Utiliser l'API Commons (cf. skill `photo-stat-card`). Pour un Reel il faut **plus de variété** qu'un visuel fixe : viser **8-10 photos distinctes** du sujet (angles, contextes, objets emblématiques — ex. Milei + tronçonneuse, Musk + Tesla/SpaceX, Arnault + boutique Vuitton). Les **regarder** (Read) avant de choisir. Placer dans un dossier `photos/`.

### 3. Écrire la config (script + beats) et rendre
```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"
node scripts/video-photo-reel.js <config.json>
```
Config :
```json
{
  "date": "2026-06-18",
  "slug": "musk-empire-video",
  "accent": "#00d4ff",
  "photosDir": "../Production interne/Réseaux Sociaux /Actus chaudes/2026-06-18-musk-empire/photos",
  "beats": [
    { "text": "Phrase parlée courte.", "photo": "wave.jpg" }
  ]
}
```
Le **scriptText = concaténation des `text`** → alignement parfait des sous-titres sur la voix.

### 4. Vérifier puis publier
Extraire ~5 frames (`ffmpeg -ss`), contrôler variété d'images + sous-titres, ouvrir le MP4. Publier (Telegram/Notion) seulement après validation humaine.

## Règles éditoriales (CRITIQUE)
- **Durée ≈ 30 s** → **10-12 beats**, **~60-90 mots** (la voix clonée est lente : viser ~60 mots pour tenir 30 s).
- **Ligne OVLA pro-business / libérale** (cf. mémoire `feedback_ligne_editoriale_pro_business`) : réformes pro-marché = succès, critique de l'excès d'État, célébrer la réussite entrepreneuriale, inflation = impôt invisible.
- **Média d'info dense** (cf. mémoire `feedback_video_script_simple`) : 6-10 chiffres datés, mécanismes, « vous » journalistique, **chute factuelle** (« On peut détester l'homme. Les chiffres sont là. »). Pas de « toi » familier, pas de moralisation.
- **Structure** : hook (croyance/contre-pied) → chiffres clés → chute engagée.

## Photos — règles
- **Une photo distincte par beat**, **jamais deux fois la même d'affilée** (le générateur émet un warning sinon).
- **Visage / sujet dans le tiers haut** : le bas est occupé par les sous-titres.
- Photos emblématiques bienvenues (objet signature, lieu) pour le rythme.

## Réglages voix (verrouillés — validés 18/06/2026)
Dans `Site/scripts/video-config.json` (globaux, profitent à tout le pipeline vidéo) :
| Réglage | Valeur | Raison |
|---|---|---|
| `ELEVENLABS_SPEED` | **1.15** | la voix clonée était trop lente |
| `ELEVENLABS_STABILITY` | **0.85** | réduit les artefacts (« hum », hésitations) |
| `ELEVENLABS_STYLE` | **0.0** | supprime les fioritures vocales parasites |
Si des « hum » persistent : essayer `eleven_turbo_v2_5` ou `eleven_v3`, ou retravailler la ponctuation forte du script.

## Sous-titres
`video-modules/remotion/Subtitles.tsx` : **96 px**, retour à la ligne activé (`overflowWrap/wordBreak/hyphens`) — corrige le débordement des mots longs (ex. « TRONÇONNEUSE »). Tous les hooks React sont appelés avant tout `return` conditionnel (bug #300 corrigé).

## Erreurs fréquentes à éviter
- ❌ Laisser le pipeline IA générer un faux visage pour une personne réelle → utiliser ce skill.
- ❌ Script trop long → la voix lente dépasse 30 s. Viser ~60 mots.
- ❌ Trop peu de photos → on voit toujours les mêmes images. Viser 8-10 distinctes.
- ❌ Deux beats consécutifs avec la même photo.
- ❌ Chiffre non sourcé, ou angle non libéral.
- ❌ Publier sans validation humaine du rendu.

## Référence
Première vidéo : `Articles/2026-06-18/milei-bilan-video/` (bilan Milei, 22 s, 10 beats, 9 photos Wikimedia dont la tronçonneuse). Le driver historique `video-milei-render.js` est l'exemple d'origine ; `video-photo-reel.js` en est la version config-driven réutilisable.
