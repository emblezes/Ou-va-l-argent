# Musiques de fond pour le pipeline vidéo

Dépose ici des fichiers MP3/M4A/WAV libres de droits. Le pipeline `video-journalist.js`
en choisit un au hasard à chaque vidéo (volume par défaut : 8 %).

## Sources recommandées (libres de droits, usage commercial OK)

- [Pixabay Music](https://pixabay.com/music/) — gratuit, pas d'attribution requise
- [YouTube Audio Library](https://studio.youtube.com/channel/UC/music) — gratuit, filtrable par humeur
- [Uppbeat](https://uppbeat.io/) — gratuit avec crédit, payant sans
- [Incompetech (Kevin MacLeod)](https://incompetech.com/music/royalty-free/) — CC-BY (attribution nécessaire)

## Recommandations OVLA

Pour le ton journalistique punchy qu'on vise, cherche :
- **Cinematic news** / **documentary tension**
- **Corporate upbeat** / **business news**
- **Dark trailer** (pour les sujets chauds type guerre, dette)
- BPM 100-130, pas trop fort, instrumentale

## Forcer un morceau précis

```bash
node scripts/video-journalist.js --topic="..." --music="path/vers/morceau.mp3"
```

## Désactiver la musique

```bash
node scripts/video-journalist.js --topic="..." --no-music
```
