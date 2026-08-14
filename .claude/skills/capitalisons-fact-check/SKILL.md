---
name: capitalisons-fact-check
description: Fact-check ligne par ligne, paragraphe par paragraphe, du livre-essai *Capitalisons. La France et son capital absent*. Travaille sur la version courante `Livre/docx/Capitalisons.docx` (DOCX avec markup/track-changes/surlignages de l'auteur). Applique le workflow factcheck-line-by-line en utilisant les sources prioritaires du projet (OCDE, FMI, BCE, INSEE, COR, Cour des comptes, Banque de France, Drees, Bercy, communiqués officiels des fonds étrangers) et en évitant les sources hétérodoxes (OFCE Sterdyniak, économistes Atterrés, Médiapart, Alternatives Économiques, L'Humanité, Politis). Mode conversationnel : un paragraphe, on tranche, on enchaîne. Déclencheurs : "fact-check Capitalisons", "vérifie le paragraphe X du livre", "fact-check ligne par ligne du livre", "fact-check le livre", "vérifier l'avant-propos paragraphe X", "fact-check Capitalisons §X".
---

# capitalisons-fact-check

Skill spécifique au livre **Capitalisons. La France et son capital absent**. Hérite et applique le workflow générique `factcheck-line-by-line`, mais avec **chemin du DOCX en dur**, **sources prioritaires précâblées**, et **conventions Pandoc du manuscrit connues**.

## Quand utiliser

- L'utilisateur dit « fact-check Capitalisons », « vérifie ce paragraphe du livre », « fact-check ligne par ligne du livre »
- L'utilisateur cible un paragraphe précis du manuscrit (ex : « avant-propos §3 », « ch1 §8 », « ch4 §2 »)
- Le DOCX est `Livre/docx/Capitalisons.docx` (compilation à jour, modifiée par l'auteur dans Word avec surlignages et track-changes)

## Source de vérité

**Toujours partir du DOCX compilé** :

```
/Users/emmanuelblezes/Documents/08_Où va l'argent /Livre/docx/Capitalisons.docx
```

C'est la version la plus à jour : elle contient les insertions, suppressions et surlignages de l'auteur (Emmanuel Blézès). Les fichiers MD séparés dans `Livre/manuscrit/` ne sont **pas** la source de vérité — ils peuvent être en retard de plusieurs jours.

## Workflow

### Étape 1 — Préparation (à faire UNE fois par session, pas par paragraphe)

```bash
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Livre/docx"

# Conversion avec markup (pour repérer les zones annotées)
pandoc Capitalisons.docx -o /tmp/Capitalisons-current.md --wrap=preserve --track-changes=all

# Conversion avec changes acceptés (version à fact-checker)
pandoc Capitalisons.docx -o /tmp/Capitalisons-accepted.md --wrap=preserve --track-changes=accept

# Extraction XML pour statistiques d'annotation
unzip -o Capitalisons.docx -d /tmp/capitalisons-xml/
python3 -c "
import re
from collections import Counter
with open('/tmp/capitalisons-xml/word/document.xml','r',encoding='utf-8') as f:
    xml = f.read()
print('Highlights:', Counter(re.findall(r'<w:highlight\\s+w:val=\"([^\"]+)\"', xml)))
print('Insertions:', len(re.findall(r'<w:ins[ >]', xml)))
print('Deletions:', len(re.findall(r'<w:del[ >]', xml)))
"
```

### Étape 2 — Localiser le paragraphe demandé

Structure des sections H1/H2 du document :

| Section | H1 du DOCX |
|---|---|
| Avant-propos | `# Avant-propos` (puis H2 `## Le paradoxe Doliprane`) |
| Introduction | `# Introduction` (puis H2 `## Trois chiffres`, etc.) |
| Ch.1 | `# Anatomie d'un système à bout de souffle` |
| Ch.2 | `# Comprendre la capitalisation` |
| Ch.3 | `# De la nécessité de fonds de pension français` |
| Ch.4 | `# Quatre modèles, une boussole` |
| Ch.5 | `# Vingt-cinq ans pour basculer` |
| Ch.6 | `# Cinq mensonges qui ont coûté trente ans` |

Pour cibler un paragraphe :
1. `grep -n "^# <titre>" /tmp/Capitalisons-accepted.md` pour trouver la ligne du H1
2. Lire à partir de cette ligne et identifier le N-ième paragraphe vrai (ignorer titres, lignes vides, notes de bas de page).

### Étape 3 — Appliquer le workflow `factcheck-line-by-line`

Suivre le skill générique : décomposer phrase par phrase, isoler chaque affirmation, vérifier, rendre tableau verdict, fournir reformulations prêtes à coller.

## Sources prioritaires du projet *Capitalisons*

### À privilégier (dans cet ordre)

**Sources institutionnelles internationales** :
- OCDE *Pensions at a Glance* (édition la plus récente — 2025) et *Pension Markets in Focus*
- FMI *Article IV France*, *Fiscal Monitor*
- BCE *Ageing Working Group*, rapports trimestriels
- Mercer CFA *Global Pension Index*
- Allianz *Global Pension Report*
- Thinking Ahead Institute *Global Pension Assets Study*

**Sources institutionnelles françaises** :
- COR (Conseil d'orientation des retraites) — rapports annuels et notes
- INSEE — Tableaux de l'économie française, séries longues
- Cour des comptes — rapports thématiques retraites
- Banque de France — statistiques flux/encours, comptes financiers
- Drees — projections retraites, données démographiques
- France Stratégie — notes d'analyse
- Bercy / DGFiP — communiqués officiels, lois de finances

**Économistes techniques français pro-réforme** :
- Antoine Bozio (IPP)
- Pierre Cahuc
- Christian Saint-Étienne
- Patrick Artus
- Jean Pisani-Ferry
- Jean-Hervé Lorenzi
- Élie Cohen
- Thomas Philippon

**Think tanks pro-capitalisation** :
- Fondapol (notamment Bertrand Martinot, *La capitalisation : un moyen de sortir par le haut de la crise des retraites ?*, oct. 2024)
- IFRAP (Verdier-Molinié)
- Institut Montaigne
- Institut Sapiens
- Cercle de l'Épargne
- Cercle des économistes

**Travaux historiques** :
- Pierre-Cyrille Hautcœur (PSE)
- Bruno Palier (Sciences Po)
- Bertrand Valat (COR)

**Presse économique de référence** :
- *Les Échos*, *Le Figaro Économie*, *Capital*, *Challenges*, *L'Express*, *Le Point*, *Investir*, *Le Revenu*
- *The Economist*, *Financial Times*, *Wall Street Journal*, *Bloomberg*, *Reuters*

**Sources pays comparés (à utiliser pour le Ch.4 et toute comparaison internationale)** :
- Suède : Pensionsmyndigheten, AP-fonderna (1-7)
- Pays-Bas : ABP, PFZW, APG, DNB
- Royaume-Uni : NEST, Pensions Regulator, IFS
- Canada : CPP Investments, CDPQ
- Australie : APRA, AustralianSuper, ASFA
- Allemagne : BMAS, Bundesbank
- États-Unis : CalPERS, CalSTRS, NYSCRF, TSP, Federal Reserve

### À éviter (parce qu'elles défendent la répartition pure et plombent le plaidoyer)

- **OFCE** : Sterdyniak, Périvier, Le Garrec, Coquet (hétérodoxie keynésienne)
- **Économistes Atterrés** : Lordon, Chavagneux
- **Presse de gauche** : *Mediapart*, *Alternatives Économiques*, *Le Monde diplomatique*, *L'Humanité*, *Politis*
- Sociologues anti-capitalisation systématiques

Si une de ces sources est citée par l'auteur dans le manuscrit, **signaler** dans le fact-check qu'elle pose un problème de neutralité — ne pas la valider tacitement.

## Conventions Pandoc du manuscrit

- Footnotes : format `[^N]` (et non `[^c1.X]` — l'ancien schéma a été abandonné après Pandoc reindex)
- Les notes de bas de page sont en fin de fichier MD, format `[^N]: <texte>`
- Chiffres importants en lettres dans le corps (« seize milliards d'euros »), en chiffres dans les notes (« 16 Md€ »)
- Tirets longs `—` pour précisions intercalaires
- « nous » inclusif
- Pas d'anaphores mécaniques, pas de phrases nominales saccadées, pas d'adresse fréquente au lecteur

## Cohérences internes à vérifier systématiquement

À chaque paragraphe, vérifier que :
1. **Chiffre du corps == chiffre de la note** : s'ils diffèrent, **incohérence interne** = 🔴
2. **Date du corps == date de la note** : idem
3. **Attribution du corps == celle de la note** : idem
4. **Définition implicite cohérente avec autres paragraphes** (ex : si on parle d'encours fonds de pension en % du PIB pour un pays, mêmes critères pour les autres pays)

## Erreurs récurrentes déjà rencontrées (à surveiller activement)

1. **Doliprane / Opella / CD&R** :
   - CD&R achète **50 %** (pas 100 %). Sanofi 48,2 %, Bpifrance 1,8 %.
   - Prix payé par CD&R = ~8 Md€. Valeur d'entreprise totale = 16 Md€.
   - Marques Opella : Doliprane, Dulcolax, Allegra, Novanight, Aspégic, Maalox. **PAS Imodium** (qui appartient à Kenvue).
   - Sites : Lisieux et Compiègne (formulation/conditionnement) ; principe actif paracétamol importé jusqu'en 2026 (relocalisation Seqens Roussillon).
   - Moteur **Vinci** d'Ariane 6 (étage supérieur) → transféré Vernon → Lampoldshausen en 2021.

2. **Fonds de pension % PIB (fin 2024)** :
   - Pays-Bas : **150,9 %** (OCDE PaG 2025), pas 225 %.
   - Norvège : 280 % seulement en incluant le GPFG (fonds souverain, pas fonds de pension stricto sensu).
   - Suisse : ~170 % | Australie : ~145 % | USA : ~130 % | UK : ~95 % | Suède : ~85 %
   - Canada : ~50-60 % (fonds privés) ou ~130 % (avec CPP/RREGOP/RRQ inclus).
   - France : **12,2 %** (OCDE 2024, dispositifs élargis PER+PERCO+FRR) ; ~2-3 % en périmètre strict.

3. **Ardian** :
   - 200 Md$ AUM annoncés en janvier 2025 (fin 2024).
   - 137 Md$ Private Equity + 49 Md$ Real Assets + 14 Md$ Credit.
   - Plus gros gestionnaire français de capital-investissement (devant Tikehau 47 Md€, Eurazeo 35 Md€, PAI Partners ~25 Md€).

4. **GPFG Norvège** :
   - 1 700 Md$ (= 1,7 trillion USD) fin 2024, **pas 1 950 Md$**.
   - Statut technique : fonds souverain, pas fonds de pension.
   - Pic atteint à ~2 trillion $ au T3 2024.

5. **Loi Thomas** :
   - Loi n° **97-277 du 25 mars 1997** (gouvernement Juppé).
   - Décrets d'application bloqués par Jospin après législatives juin 1997.
   - Abrogation formelle en 2002.

6. **Affaire Doliprane — chronologie politique** :
   - 11 oct. 2024 : annonce négociations exclusives Sanofi/CD&R.
   - 17 oct. 2024 : surenchère de PAI Partners (+200 M€).
   - 21 oct. 2024 : accord tripartite Sanofi/CD&R/État + signature à Bercy par Antoine Armand et Marc Ferracci.
   - 24 oct. 2024 : audition Audrey Duval (présidente Sanofi France) par commission affaires économiques AN.
   - Q2 2025 : closing officiel (30 avril 2025).

## Format de sortie

Identique au skill générique `factcheck-line-by-line` — voir ce skill pour le template complet.

## Anti-patterns spécifiques

- ❌ Travailler sur les fichiers MD dans `Livre/manuscrit/` — ils sont obsolètes. **Toujours partir du DOCX compilé**.
- ❌ Citer une source hétérodoxe (OFCE, Médiapart, Alt Eco) comme « vérification » d'une affirmation — elles ne servent pas le plaidoyer.
- ❌ Approuver « tacitement » une affirmation rhétorique exagérée (« personne », « jamais », « tous ») sans vérifier la part de vérité littérale.
- ❌ Sauter les notes de bas de page sous prétexte qu'elles sont longues — c'est là que se trouvent souvent les incohérences avec le corps du texte.
- ❌ Oublier de signaler les **incohérences internes** entre corps de texte et note de bas de page (chiffre différent, date différente).

## Mise à jour du JOURNAL.md en fin de session

À la fin d'une session de fact-check, l'utilisateur peut demander de noter l'avancement dans `Livre/JOURNAL.md` :

```markdown
## Fact-check ligne par ligne — <date>

- Avant-propos §1-§4 : fact-checké, corrections appliquées (X 🔴, Y ⚠️)
- Avant-propos §5- : à faire
```

Ne pas le faire automatiquement — uniquement sur demande explicite de l'utilisateur.
