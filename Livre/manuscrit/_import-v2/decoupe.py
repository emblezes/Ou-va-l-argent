#!/usr/bin/env python3
"""Découpage du MD V2 (track-changes acceptés) vers les fichiers V4 (3 parties)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_import-v2" / "capitalisons-v2-accepted.md"
text = SRC.read_text()
lines = text.split("\n")
# lines[i] correspond à la ligne i+1 dans grep -n

def extract(start, end):
    """Extrait les lignes [start, end] (inclusif, 1-indexé)."""
    return "\n".join(lines[start - 1:end])

def clean_empty_headings(s):
    """Supprime les H1/H2/H3 vides (titre seul, sans contenu après le marqueur)."""
    out = []
    for line in s.split("\n"):
        if re.match(r"^#{1,3}\s*$", line):
            continue
        # Aussi enlever les ancres {#xxx} vides bizarres dans titres
        out.append(line)
    return "\n".join(out)

def strip_mark(s):
    """Retire les [...]{.mark} mais garde le texte intérieur."""
    return re.sub(r"\[([^\[\]]+)\]\{\.mark\}", r"\1", s)

# --- Frontières V2 ---
B = {
    "toc":         (1, 94),       # Table of Contents (jetée)
    "avant_propos":(95, 131),
    "intro":       (132, 190),
    "p1_v2":       (191, 352),    # « Nous n'aurons pas de retraite »
    "p2_v2":       (353, 476),    # Comprendre la capitalisation
    "p3_v2":       (477, 723),    # La France a besoin de fonds de pensions
    "p4_v2":       (724, 939),    # Suède, Australie, Singapour, Chili
    "p5_v2":       (940, 1151),   # Vers la capitalisation
    "conclusion":  (1152, 1179),
    "appendice":   (1180, 1317),
    "footnotes":   (1318, len(lines)),
}

OUT = ROOT  # manuscrit-v4/

# === 00-avant-propos.md ===
ap = extract(*B["avant_propos"])
ap = strip_mark(clean_empty_headings(ap))
(OUT / "00-avant-propos.md").write_text(ap.strip() + "\n")

# === 01-introduction.md — PLACEHOLDER (à réécrire par capitalisons-writer) ===
intro_brut = extract(*B["intro"])
intro_brut = strip_mark(clean_empty_headings(intro_brut))
intro_v4 = f"""<!-- TODO-REECRITURE (capitalisons-writer) : réécrire pour annoncer la nouvelle structure 3 parties.
     - 0.1 « Les Français sont prêts » (NOUVEAU, sondages 2024-2025 actualisés)
     - 0.2 Trois chiffres (conserver tels quels)
     - 0.3 La grande illusion (conserver)
     - 0.4 L'objectif du livre (conserver)
     - 0.5 Plan de l'ouvrage en 3 parties (à RÉÉCRIRE)
     Source IAP janvier 2025 → uniquement pour les angles, pas les chiffres.
-->

{intro_brut.strip()}
"""
(OUT / "01-introduction.md").write_text(intro_v4)

# === 02-partie1-capi-repond.md — FUSION ex-P1 V2 + ex-P2 V2 ===
p1 = extract(*B["p1_v2"])
p2 = extract(*B["p2_v2"])
# Nettoyer
p1 = clean_empty_headings(strip_mark(p1))
p2 = clean_empty_headings(strip_mark(p2))
# Remplacer le H1 V2 par le H1 V4
p1 = re.sub(r"^# Partie 1.*$", "# Partie 1 — La capitalisation répond aux problèmes du système de retraite", p1, count=1, flags=re.MULTILINE)
# Le H1 de P2 V2 devient un H2 transition dans P1 V4
p2 = re.sub(r"^# Partie 2 - Comprendre la capitalisation.*$", "## Comprendre la capitalisation : quand l'argent travaille dans le temps", p2, count=1, flags=re.MULTILINE)

placeholder_rafp = """
## 1.9 Le RAFP : la capitalisation existe déjà chez nous

<!-- TODO-NOUVEAU (matière agent capitalisons-researcher en cours) :
     section ~1800 mots sur le Régime additionnel de la fonction publique :
     - Créé par loi du 21 août 2003 (réforme Fillon), opérationnel depuis 2005
     - Régime OBLIGATOIRE par capitalisation à cotisations définies pour 4,5 M de fonctionnaires
     - Encours fin 2024 (rapport annuel RAFP 2024, publié 2025)
     - Rendement annualisé depuis création
     - Allocation portefeuille (actions / obligations / immobilier / capital-investissement)
     - Politique 100 % ISR — plus gros investisseur ISR public d'Europe
     - L'argument plaidoyer : « ce qui marche pour 4,5 M de fonctionnaires depuis 20 ans peut marcher pour 28 M de salariés »
     - Pourquoi ce trou de cohérence ? L'angle mort français
     CHIFFRES À ACTUALISER aux sources primaires 2024-2025, JAMAIS aux chiffres IAP janvier 2025.
-->
"""

contenu_p1_v4 = p1.strip() + "\n\n" + p2.strip() + "\n" + placeholder_rafp
(OUT / "02-partie1-capi-repond.md").write_text(contenu_p1_v4)

# === 03-partie2-fonds-pension.md — ex-P3 V2 ===
p3 = extract(*B["p3_v2"])
p3 = clean_empty_headings(strip_mark(p3))
# Renommer le H1 V2 vers V4 — titre quasi inchangé
p3 = re.sub(r"^# Partie 3.*$", "# Partie 2 — La capitalisation permet d'avoir des fonds de pension", p3, count=1, flags=re.MULTILINE)

placeholder_cercle = """
## 2.7 Le cercle vertueux de la capitalisation

<!-- TODO-NOUVEAU : section ~600 mots
     La boucle : cotisations → investies en actifs productifs → stimule la croissance économique
     → crée emploi et richesse → valeur des actifs (future retraite) augmente → cotisations augmentent
     Inspiration : pres IAP slide 33 (cercle vertueux visuel).
     Articulation avec la section précédente « Si la France avait des fonds de pension »
     et la section suivante « Alléger les dépenses publiques de retraite ».
     Aucun chiffre IAP repris tel quel.
-->
"""
contenu_p2_v4 = p3.strip() + "\n" + placeholder_cercle
(OUT / "03-partie2-fonds-pension.md").write_text(contenu_p2_v4)

# === 04-partie3-feuille-route.md — FUSION ex-P4 V2 + ex-P5 V2 ===
p4 = extract(*B["p4_v2"])
p5 = extract(*B["p5_v2"])
p4 = clean_empty_headings(strip_mark(p4))
p5 = clean_empty_headings(strip_mark(p5))
# H1 V4
p4 = re.sub(r"^# Partie 4.*$", "# Partie 3 — Comment on y arrive : ce que les autres pays nous apprennent", p4, count=1, flags=re.MULTILINE)
# Le H1 de P5 V2 devient un H2 de transition dans P3 V4
p5 = re.sub(r"^# Partie 5 - Vers la capitalisation.*$", "## Vingt-cinq ans pour basculer", p5, count=1, flags=re.MULTILINE)

placeholder_4raisons = """
<!-- TODO-ENRICHISSEMENT §3.8 (méthode politique) : ajouter le développement
     « Pourquoi pas la France ? — 4 raisons » (inspiré pres IAP slide 41) :
     1. Héritage historique : système par répartition imposé sous Vichy en 1941, perçu comme acquis social
     2. Méfiance culturelle vis-à-vis de la finance (à nuancer : ~67% Français se disent prêts en 2024)
     3. Poids des syndicats (CGT, FO) et frilosité politique
     4. Préférence pour les réformes paramétriques (âge, durée) plutôt que structurelles
-->

<!-- TODO-ENRICHISSEMENT §3.9 (agenda 2027-2052) : développer le fonds de transition
     modèle suédois (les fonds AP qui ont absorbé la double cotisation 1994-1999) :
     - En France, faire monter en charge le FRR (réorienté depuis 2010 vers la CADES)
     - Le FFC évoqué dans la V2 absorbe FRR + RAFP — à articuler avec ce qui existe déjà
     Aucun chiffre IAP repris tel quel.
-->
"""

contenu_p3_v4 = p4.strip() + "\n\n" + p5.strip() + "\n" + placeholder_4raisons
(OUT / "04-partie3-feuille-route.md").write_text(contenu_p3_v4)

# === 05-conclusion.md ===
cc = extract(*B["conclusion"])
cc = clean_empty_headings(strip_mark(cc))
cc = re.sub(r"^# Conclusion.*$", "# Conclusion — Choisir, enfin", cc, count=1, flags=re.MULTILINE)
(OUT / "05-conclusion.md").write_text(cc.strip() + "\n")

# === 07-appendice-cinq-mensonges.md ===
ap_x = extract(*B["appendice"])
ap_x = clean_empty_headings(strip_mark(ap_x))
(OUT / "07-appendice-cinq-mensonges.md").write_text(ap_x.strip() + "\n")

# === 99-footnotes.md ===
fn = extract(*B["footnotes"])
(OUT / "99-footnotes.md").write_text(fn.strip() + "\n")

# === Statistiques ===
print("=== Découpage V2 → V4 terminé ===")
for f in sorted(OUT.glob("[0-9][0-9]-*.md")):
    n_words = len(f.read_text().split())
    n_lines = len(f.read_text().splitlines())
    print(f"  {f.name:42s}  {n_lines:6d} l.  {n_words:6d} mots")
