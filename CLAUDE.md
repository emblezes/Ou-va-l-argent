# Instructions pour Claude Code

## Projet "Où Va l'Argent"

Ce projet contient des analyses et visualisations sur les finances publiques françaises.

---

## Équipe Deep Research (OBLIGATOIRE)

**CRITIQUE** : Avant toute production de contenu (infographie, modification du site, rapport, article), les agents de l'équipe Deep Research **doivent être systématiquement consultés** pour garantir l'exactitude et la fiabilité des informations.

### Agents disponibles

Les agents sont situés dans `.claude/agents/` :

1. **fact-checker** (`.claude/agents/fact-checker.md`)
   - Vérifie l'exactitude des faits et des chiffres
   - Identifie les sources primaires
   - Détecte les erreurs ou approximations

2. **search-specialist** (`.claude/agents/search-specialist.md`)
   - Recherche les données les plus récentes
   - Trouve les sources officielles (INSEE, Eurostat, ministères, etc.)
   - Valide la fiabilité des sources

### Protocole de vérification

**Toujours** :
- Consulter ces agents AVANT de finaliser tout contenu
- Citer les sources officielles dans chaque production
- Vérifier que les chiffres sont à jour et exacts
- Croiser les informations avec plusieurs sources

**Ne jamais** :
- Publier un chiffre sans source vérifiée
- Utiliser des données obsolètes sans le mentionner
- Ignorer les alertes de fact-checking

### Importance

La crédibilité du projet "Où Va l'Argent" repose sur la **rigueur et l'exactitude** des informations diffusées. Toute erreur factuelle nuit à la confiance du public. Ces agents sont indispensables à la qualité de la production.

---

## Instructions pour les infographies

### Format de sortie : PNG uniquement

**IMPORTANT** : Lorsque l'utilisateur demande de créer une ou plusieurs infographies, chaque infographie doit être générée comme un **fichier PNG individuel** (1080x1080 pixels pour Instagram).

**Ne jamais** :
- Créer un fichier HTML contenant plusieurs infographies
- Regrouper plusieurs infographies dans un seul fichier

**Toujours** :
- Créer un fichier PNG séparé pour chaque infographie
- Nommer les fichiers de manière descriptive (ex: `depense-sociale-932-milliards.png`)
- Sauvegarder dans le dossier : `Production interne/Réseaux Sociaux /PNG/`

### Méthode de création

Utiliser le skill **canvas-design** installé dans `.claude/skills/canvas-design/` pour créer des PNG de haute qualité directement avec node-canvas. Les polices disponibles sont dans `.claude/skills/canvas-design/canvas-fonts/`.

### Charte graphique

Les infographies suivent une charte visuelle cohérente :
- **Fond** : Gradient sombre (#06080c à #0a1628)
- **Grille** : Subtile, cyan transparent
- **Couleurs principales** :
  - Cyan électrique : `#00d4ff`
  - Or : `#ffd700`
  - Rouge : `#ff4757`
  - Vert : `#00ff88`
  - Violet : `#a855f7`
  - Orange : `#ff9f43`
- **Typographie** :
  - Titres : Instrument Serif (italique pour les accents)
  - Corps : Syne (sans-serif)
  - Données/chiffres : JetBrains Mono (monospace)
- **Logo** : Carré cyan avec "€" + texte "Où Va l'Argent"
- **Footer** : Source à gauche, "ouvalargent.fr" à droite

### Structure type d'une infographie

1. Header : Logo + Tag thématique
2. Contenu principal : Statistique ou visualisation
3. Footer : Source + URL du site
