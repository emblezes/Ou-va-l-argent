---
name: factcheck-line-by-line
description: Fact-check exhaustif ligne par ligne d'un paragraphe précis d'un document (DOCX ou Markdown). Décompose phrase par phrase, isole CHAQUE affirmation factuelle (chiffres, dates, citations, attributions, faits historiques, orthographe des gentilés, métaphores qui posent un fait, quantifications rhétoriques), vérifie en source primaire via WebSearch/WebFetch, rend un tableau verdict (✅/⚠️/🔴) avec source ET une reformulation prête à coller pour chaque correction. Mode conversationnel paragraphe par paragraphe — pas rapport global. Déclencheurs : "fact-check ligne par ligne", "vérifie chaque ligne", "fact-check exhaustif", "fact check le paragraphe X", "vérification phrase par phrase", "ligne par ligne".
---

# factcheck-line-by-line

Skill pour fact-checker un manuscrit **paragraphe par paragraphe**, dans la conversation, avec un niveau de granularité **par phrase puis par affirmation factuelle isolée**. Pas de rapport en bloc — on traite un paragraphe à la fois, l'utilisateur valide les corrections, on enchaîne le suivant.

## Quand utiliser

- L'utilisateur dit « fact-check ligne par ligne », « vérifie chaque ligne », « ligne par ligne »
- L'utilisateur cible un paragraphe précis d'un manuscrit (livre, rapport, article)
- L'utilisateur a un DOCX avec markup/track-changes et veut vérifier la version finale acceptée
- L'utilisateur a déjà des sources et veut valider l'usage qui en est fait

## Quand NE PAS utiliser

- Rapport global de fact-check d'un chapitre entier → utiliser un agent dédié (ex `capitalisons-fact-checker`)
- Recherche initiale de sources → utiliser un agent researcher
- Réécriture de fond → utiliser un agent writer

## Workflow strict

### Étape 1 — Identifier le document source

Demander ou déduire :
- **Chemin** du document (DOCX ou MD). Si DOCX, convertir.
- **Section/chapitre** ciblé (titre H1 ou H2 dans le document).
- **Numéro de paragraphe** au sein de cette section (ex : `avant-propos §3`).

### Étape 2 — Convertir le DOCX (si nécessaire)

```bash
cd "<dossier du docx>"
pandoc "<fichier>.docx" -o /tmp/<nom>-current.md --wrap=preserve --track-changes=all
pandoc "<fichier>.docx" -o /tmp/<nom>-accepted.md --wrap=preserve --track-changes=accept
```

- **`-current`** : conserve toutes les marques de track-changes et les surlignages → permet de repérer où l'auteur a déjà annoté
- **`-accepted`** : intègre les modifications → c'est la version à fact-checker

Extraire en parallèle les surlignages depuis le XML pour comprendre les zones marquées :

```bash
unzip -o "<fichier>.docx" -d /tmp/<nom>-xml/
python3 -c "
import re
with open('/tmp/<nom>-xml/word/document.xml','r',encoding='utf-8') as f:
    xml = f.read()
print('Highlights:', len(re.findall(r'<w:highlight\\s+w:val=\"([^\"]+)\"', xml)))
print('Insertions:', len(re.findall(r'<w:ins[ >]', xml)))
print('Deletions:', len(re.findall(r'<w:del[ >]', xml)))
"
```

### Étape 3 — Localiser le paragraphe cible

Ouvrir le fichier `-accepted.md`. Trouver la section H1/H2 demandée. Compter les paragraphes vrais (ignorer les lignes vides, titres, notes de bas de page). Extraire le texte exact et toutes les notes de bas de page qui s'y rattachent (`[^N]:` en bas de fichier).

### Étape 4 — Décomposer phrase par phrase

Numéroter chaque phrase **P§.1, P§.2, …** dans l'ordre. Une phrase = une unité ponctuée par un point/point d'interrogation/point d'exclamation.

### Étape 5 — Isoler TOUTES les affirmations factuelles

Pour chaque phrase, lister exhaustivement (ordre de découverte) :

| Catégorie | Exemples à isoler |
|---|---|
| **Chiffres** | Montants, pourcentages, années, quantités, ratios |
| **Dates** | Année, mois, jour précis |
| **Citations** | Toute phrase entre guillemets attribuée à une personne |
| **Attributions** | Qui a fait/dit/décidé quoi |
| **Faits historiques** | Lois, événements, traités, dates de réformes |
| **Affirmations institutionnelles** | Statut, rôle, fonction d'une organisation |
| **Comparaisons internationales** | Chiffres pays par pays |
| **Orthographe de gentilés** | « Français » avec majuscule comme nom, minuscule comme adjectif |
| **Noms propres** | Personnes, marques, organisations, lieux (orthographe exacte) |
| **Métaphores qui posent un fait** | « sous pavillon étranger » suppose un déménagement ; vérifier la réalité |
| **Quantifications rhétoriques** | « personne », « jamais », « tous », « aucun » → vérifier l'absolu |
| **Causalités implicites** | Lien de cause à effet affirmé entre deux faits |
| **Définitions techniques** | Termes économiques/juridiques utilisés à bon ou mauvais escient |

Numéroter chaque affirmation : **§.P.lettre** (ex : `3.6.b` = paragraphe 3, phrase 6, affirmation b).

### Étape 6 — Vérifier chaque affirmation

Hiérarchie de vérification :
1. **Source primaire** déjà citée dans la note de bas de page → WebFetch sur l'URL exacte
2. **Source primaire institutionnelle** non citée mais évidente (OCDE, INSEE, Banque centrale, communiqué officiel) → WebSearch ciblée puis WebFetch
3. **Sources secondaires fiables** (presse économique de référence) si source primaire indisponible
4. **Sources web tertiaires** uniquement en dernier recours et avec mention explicite

**Ne JAMAIS** :
- Affirmer « confirmé » sans avoir au moins une source web concrète à l'appui
- Accepter sa propre connaissance interne comme suffisante pour un chiffre précis
- Présenter un résultat avant d'avoir vérifié

### Étape 7 — Rendre le verdict ligne par ligne

Format **strict** — un tableau par phrase :

```markdown
### Phrase N — « <texte exact de la phrase> »

| # | Affirmation | Verdict | Détail |
|---|---|---|---|
| §.N.a | <affirmation isolée> | ✅ / ⚠️ / 🔴 | <justification + source courte> |
| §.N.b | … | … | … |
```

**Conventions de verdict** :
- ✅ **Vert** : factuellement correct, source à jour, formulation rigoureuse
- ⚠️ **Orange** : imprécis, à reformuler pour plus de précision, mais pas faux
- 🔴 **Rouge** (ou ❌) : erreur factuelle à corriger absolument

### Étape 8 — Vérifier les notes de bas de page séparément

Au même niveau de détail. Numéroter `N1.a`, `N1.b`, … pour chaque affirmation de la note `[^1]`.

Vérifier :
- L'auteur, le titre, la date de l'article cités sont-ils exacts ?
- L'URL fonctionne-t-elle ?
- Les chiffres rapportés dans la note sont-ils cohérents avec ceux du corps du texte ?
- Y a-t-il **incohérence interne** entre corps du texte et note ?

### Étape 9 — Pour CHAQUE correction (orange OU rouge), fournir une reformulation prête à coller

C'est **non négociable**. L'utilisateur ne doit pas avoir à imaginer la réécriture.

Format :

```markdown
**🔴 N.P.X — <courte description du problème>**
- Actuel : « <citation exacte de la phrase ou du fragment problématique> »
- → « <reformulation prête à coller, intégrée dans la phrase, avec la correction en gras> »
```

Si plusieurs reformulations sont possibles, en proposer 2 (version longue précise + version courte qui garde le rythme).

### Étape 10 — Synthèse paragraphe

```markdown
### Synthèse §<N>

| Catégorie | Nombre |
|---|---|
| ✅ Verts | <X> |
| ⚠️ Orange (à reformuler) | <Y> |
| 🔴 Rouges (erreur à corriger) | <Z> |

**Rouges à corriger** : liste des points 🔴 avec n° de référence
**Orange à arbitrer** : liste des points ⚠️ avec n° de référence
```

### Étape 11 — Sources en fin de réponse

Lister toutes les URLs consultées en bas de réponse, format Markdown hyperliens :

```markdown
Sources :
- [<titre court>](URL)
- ...
```

### Étape 12 — Proposer la suite

Terminer par une question simple : « Tu veux qu'on enchaîne avec le §<N+1> ? » ou « Tu valides les corrections du §<N> avant qu'on passe au suivant ? »

## Anti-patterns à éviter

- ❌ Faire un rapport en bloc de tout un chapitre — c'est un autre skill
- ❌ Ne lister que les affirmations principales — on veut **chaque** affirmation factuelle, même mineure
- ❌ Sauter les notes de bas de page — elles doivent être traitées au même niveau
- ❌ Donner un verdict sans source web concrète à l'appui
- ❌ Donner une correction sans la reformulation prête à coller
- ❌ Surcharger l'utilisateur avec des paragraphes de prose — toujours en tableaux pour la partie verdict
- ❌ Oublier le compte de synthèse (V/O/R) en fin de paragraphe
- ❌ Ne pas conclure par une proposition de suite

## Format de réponse type

```markdown
---

### §<N> — Texte exact (version finale acceptée)

> <texte du paragraphe>

### Phrase 1 — « <phrase> »

| # | Affirmation | Verdict | Détail |
| <tableau> |

### Phrase 2 — « <phrase> »

| <tableau> |

[…]

### Note [^N] — Texte exact

> <texte de la note>

| <tableau pour la note> |

---

### Synthèse §<N>

| Catégorie | Nombre |
| <stats> |

**Rouges à corriger** : <liste>
**Orange à arbitrer** : <liste>

### Reformulations prêtes à coller

**🔴 <ref> — <description>**
- Actuel : « <texte> »
- → « <reformulation> »

[autres reformulations]

Tu veux qu'on enchaîne avec le §<N+1> ?

Sources :
- [<titre>](URL)
```
