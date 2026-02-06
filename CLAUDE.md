# Instructions pour Claude Code

## Projet "Où Va l'Argent"

**Site web** : Analyses et visualisations sur les finances publiques françaises.

**Réseaux sociaux** : Média économique au sens large couvrant :
- Finances publiques (dette, impôts, dépenses)
- Macro-économie (inflation, PIB, chômage, croissance)
- Investissement (bourse, immobilier, crypto, or...)
- Actualité économique (entreprises, secteurs)
- Comparaisons internationales
- Finance personnelle

---

## Équipe d'agents (OBLIGATOIRE)

**CRITIQUE** : Avant toute production de contenu (infographie, modification du site, rapport, article), les agents **doivent être systématiquement consultés** pour garantir l'exactitude et la fiabilité des informations.

### Agents disponibles

Les agents sont situés dans `.claude/agents/` :

1. **social-media-manager** (`.claude/agents/social-media-manager.md`) ⭐ PRINCIPAL
   - Orchestre la stratégie de publication réseaux sociaux
   - Planifie la semaine (21 infographies = 3/jour)
   - Coordonne les autres agents
   - Rédige les textes pour LinkedIn, Twitter, Instagram, Facebook
   - Prépare les briefs pour les Réels/TikTok
   - **Usage** : "Planifie la semaine du [date]"

2. **infographic-creator** (`.claude/agents/infographic-creator.md`)
   - Crée des infographies pour les réseaux sociaux
   - Coordonne recherche + fact-checking + génération
   - Utilise les templates HTML et exporte en PNG haute qualité
   - **Usage** : "Crée une infographie sur [sujet]"

3. **fact-checker** (`.claude/agents/fact-checker.md`)
   - Vérifie l'exactitude des faits et des chiffres
   - Identifie les sources primaires
   - Détecte les erreurs ou approximations

4. **search-specialist** (`.claude/agents/search-specialist.md`)
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

### Formats disponibles (Multi-format)

Chaque infographie peut être générée en **3 formats** pour différentes plateformes :

| Format | Dimensions | Ratio | Usage |
|--------|------------|-------|-------|
| **Instagram** | 1080×1080 → 2160×2160 (retina) | 1:1 | Posts Instagram, LinkedIn, Facebook |
| **TikTok** | 1080×1920 → 2160×3840 (retina) | 9:16 | Fond plein écran pour vidéos TikTok |
| **Rectangle** | 1080×600 → 2160×1200 (retina) | ~16:9 | ~1/3 bas d'écran pour commentaire vidéo |

### Format de sortie : PNG uniquement

**IMPORTANT** : Lorsque l'utilisateur demande de créer une ou plusieurs infographies, chaque infographie doit être générée comme un **fichier PNG individuel**.

**Ne jamais** :
- Créer un fichier HTML contenant plusieurs infographies
- Regrouper plusieurs infographies dans un seul fichier

**Toujours** :
- Créer un fichier PNG séparé pour chaque infographie
- **Numéroter** chaque infographie avec le prochain numéro disponible en préfixe
- Nommer les fichiers : `{numéro}-nom-descriptif-{format}.png`
  - Ex : `16-dette-5350-euros-seconde-instagram.png`
- **Ranger par format** dans `Production interne/Réseaux Sociaux /` :
  - `Insta & Autres/` : PNG au format Instagram (carré 1:1)
  - `Tiktok/` : PNG aux formats TikTok (9:16) et Rectangle (~16:9)
  - `Sources HTML/` : Fichiers HTML sources

### Méthode de création (HTML → PNG)

**Méthode recommandée** : Utiliser le template multi-format + Puppeteer.

#### Templates disponibles

- **Multi-format** : `/Templates/Réseaux sociaux/template-multiformat.html`
  - Génère automatiquement les 3 formats (Instagram, TikTok, Rectangle)
  - Classes CSS : `.format-instagram`, `.format-tiktok`, `.format-rectangle`
  - Attribut `data-name="nom-descriptif"` pour nommer les fichiers

- **Instagram uniquement** : `/Templates/Réseaux sociaux/template-instagram.html`
  - Format carré 1080×1080 uniquement
  - 6 types de visualisations prêts à l'emploi

#### Export batch (méthode principale)

Le script `batch-export-all.js` exporte **toutes** les infographies en 3 formats (Instagram, TikTok Vertical, TikTok Horizontal) avec des CSS overrides adaptés à chaque format.

```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"

# Exporter toutes les infographies en 3 formats
node scripts/batch-export-all.js
```

**Important** : Après avoir créé un nouveau HTML dans `Sources HTML/`, ajouter l'entrée correspondante dans le tableau `INFOGRAPHICS` de `batch-export-all.js` puis relancer l'export.

Le script applique automatiquement :
- **TikTok Vertical** : titres 6rem, éléments agrandis ~50-80%, bar charts transformés en affichage texte
- **TikTok Horizontal** : tout compacté pour 600px, rankings très condensés

#### Export multi-format (un seul fichier)

```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"
node scripts/html-to-png-multiformat.js "../Templates/Réseaux sociaux/mon-infographie.html"
```

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
  - Titres : Instrument Serif (italique pour les accents) — **minimum 4rem pour Instagram**
  - Corps : Syne (sans-serif)
  - Données/chiffres : JetBrains Mono (monospace)
  - **Tailles Instagram** : titre 4-4.5rem, valeurs 1.6-2.2rem, labels 0.85-1.15rem
  - Les tailles TikTok sont gérées automatiquement par le script d'export
- **Logo** : Carré cyan avec "€" + texte "Où Va l'Argent"
- **Footer** : Source à gauche, "ouvalargent.fr" à droite

### Structure type d'une infographie

1. Header : Logo + Tag thématique
2. Contenu principal : Statistique ou visualisation
3. Footer : Source + URL du site

---

## Intégration Notion

Le calendrier de publication est géré dans Notion.

### Configuration
- **Base de données** : "Calendrier Publications"
- **ID** : `0b730033-5a9c-48fb-9395-41198de626cc`
- **Config** : `/Site/scripts/notion-config.json`

### Script d'ajout
```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site"
node scripts/notion-add-post.js '{"titre": "...", "date": "2025-02-10", "theme": "Dette", ...}'
```

### Propriétés disponibles
| Champ | Type | Valeurs possibles |
|-------|------|-------------------|
| titre | Titre | Texte libre |
| date | Date | YYYY-MM-DD |
| theme | Select | Finances publiques, Macro-economie, Investissement, Actualite eco, International, Finance perso, Dette, Impots, Immobilier, Bourse |
| type | Select | Stat choc, Comparaison, Classement, Timeline, Citation |
| statut | Select | Idee, A creer, En cours, Pret, Publie |
| reel | Checkbox | true/false |
| linkedin | Texte | Max 2000 car. |
| twitter | Texte | Max 280 car. |
| instagram | Texte | Max 2000 car. |
| facebook | Texte | Max 2000 car. |
| source | Texte | Source officielle |
| briefReel | Texte | Brief pour vidéo |
