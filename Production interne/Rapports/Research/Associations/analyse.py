#!/usr/bin/env python3
"""Analyse du Jaune budgétaire 2022 — Effort financier de l'État envers les associations.
Source : data.economie.gouv.fr / PLF 2022 (données 2020).
"""
import pandas as pd
import json
from pathlib import Path

CSV = Path(__file__).parent / "jaune_2022.csv"

# Encodage : essai cp1252 puis latin-1 (séparateur ; espace insécable dans montants)
df = pd.read_csv(CSV, sep=";", encoding="cp1252", low_memory=False)
print(f"Lignes : {len(df):,}")
print(f"Colonnes : {list(df.columns)}\n")

# Nettoyage Montant (espaces insécables, virgule décimale)
def to_num(v):
    if pd.isna(v):
        return 0.0
    s = str(v).replace("\xa0", "").replace(" ", "").replace(",", ".")
    try:
        return float(s)
    except Exception:
        return 0.0

df["Montant_num"] = df["Montant"].apply(to_num)
df["Denom"] = df["Dénomination"].astype(str).str.strip()

# Mapping Programme → libellé ministère (PLF 2020)
PROGRAMMES = {
    "101": "Justice — Accès au droit",
    "102": "Travail — Accès et retour à l'emploi",
    "103": "Travail — Accompagnement mutations économiques",
    "104": "Intérieur — Intégration et accès à la nationalité",
    "105": "Affaires étrangères — Action de la France en Europe",
    "107": "Justice — Administration pénitentiaire",
    "109": "Solidarité — Aide à l'accès au logement",
    "111": "Travail — Amélioration qualité emploi",
    "112": "Cohésion territoires — Aménagement du territoire",
    "113": "Écologie — Paysages eau biodiversité",
    "115": "Culture — Action audiovisuelle extérieure",
    "117": "Économie — Charge dette",
    "119": "Cohésion territoires — Concours collectivités",
    "121": "Cohésion territoires — Concours spécifiques",
    "122": "Cohésion territoires — Concours spécifiques administration",
    "123": "Outre-mer — Conditions de vie outre-mer",
    "124": "Solidarité — Conduite et soutien santé",
    "129": "Premier ministre — Coordination travail gouvernemental",
    "131": "Culture — Création",
    "134": "Économie — Développement entreprises",
    "135": "Cohésion territoires — Urbanisme territoires habitat",
    "137": "Solidarité — Égalité femmes hommes",
    "138": "Outre-mer — Emploi outre-mer",
    "140": "Éducation — Enseignement scolaire 1er degré",
    "141": "Éducation — Enseignement scolaire 2nd degré",
    "142": "Agriculture — Enseignement supérieur agricole",
    "143": "Agriculture — Enseignement technique agricole",
    "144": "Défense — Environnement et prospective politique défense",
    "146": "Défense — Équipement des forces",
    "147": "Cohésion territoires — Politique de la ville",
    "148": "Action publique — Fonction publique",
    "149": "Agriculture — Compétitivité agriculture pêche",
    "150": "Éducation — Formations supérieures et recherche universitaire",
    "151": "Affaires étrangères — Français à l'étranger",
    "152": "Intérieur — Gendarmerie nationale",
    "154": "Agriculture — Économie et développement durable agriculture",
    "155": "Travail — Conception gestion politiques travail",
    "157": "Solidarité — Handicap et dépendance",
    "158": "Indemnisation victimes spoliations antisémites",
    "159": "Écologie — Expertise économique environnementale",
    "161": "Intérieur — Sécurité civile",
    "162": "Premier ministre — Interventions territoriales État",
    "163": "Sport, Jeunesse, Vie associative",
    "164": "Conseil et contrôle de l'État — Cour des comptes",
    "165": "Conseil d'État et autres juridictions administratives",
    "166": "Justice — Justice judiciaire",
    "167": "Anciens combattants — Liens entre Nation et armée",
    "169": "Anciens combattants — Reconnaissance et réparation",
    "172": "Recherche — Recherches scientifiques pluridisciplinaires",
    "175": "Culture — Patrimoines",
    "176": "Intérieur — Police nationale",
    "177": "Solidarité — Hébergement parcours vers logement",
    "178": "Défense — Préparation et emploi des forces",
    "180": "Médias, livre et industries culturelles",
    "181": "Écologie — Prévention risques",
    "182": "Justice — Protection judiciaire de la jeunesse",
    "183": "Solidarité — Protection maladie (AME)",
    "185": "Affaires étrangères — Diplomatie culturelle et d'influence",
    "186": "Recherche — Enseignement supérieur recherche culturelles",
    "190": "Recherche — Recherches énergie développement mobilité",
    "191": "Recherche — Recherche duale civile et militaire",
    "192": "Économie — Recherche industrielle",
    "203": "Écologie — Infrastructures et services de transports",
    "204": "Solidarité — Prévention sécurité sanitaire offre soins",
    "205": "Écologie — Affaires maritimes",
    "206": "Agriculture — Sécurité et qualité sanitaires alimentation",
    "207": "Intérieur — Sécurité et éducation routières",
    "209": "Affaires étrangères — Solidarité avec pays en développement",
    "212": "Défense — Soutien politique défense",
    "214": "Éducation — Soutien politique éducation nationale",
    "215": "Agriculture — Conduite et pilotage politiques agriculture",
    "216": "Intérieur — Conduite et pilotage politiques de l'intérieur",
    "217": "Écologie — Conduite et pilotage politiques",
    "218": "Économie — Conduite et pilotage politiques économiques",
    "219": "Sport, Jeunesse — Sport",
    "220": "INSEE — Statistiques et études économiques",
    "224": "Culture — Transmission savoirs démocratisation culture",
    "230": "Éducation — Vie de l'élève",
    "231": "Recherche — Vie étudiante",
    "302": "Économie — Facilitation gestion grandes administrations",
    "303": "Intérieur — Immigration et asile",
    "304": "Solidarité — Inclusion sociale et protection personnes",
    "305": "Économie — Stratégie politiques économiques",
    "306": "Justice — Conduite politique justice",
    "307": "Intérieur — Administration territoriale",
    "308": "Conseil constitutionnel — Protection droits libertés",
    "310": "Justice — Conduite politique justice",
    "333": "Premier ministre — Moyens mutualisés administrations déconcentrées",
    "334": "Médias, livre — Livre et industries culturelles",
    "337": "Culture — Conditions vie outre-mer",
    "343": "Plan France Très Haut Débit",
    "345": "Service public énergie",
    "346": "Travail — Plan d'investissement compétences",
    "347": "Premier ministre — Présidence française du Conseil UE",
    "349": "Action publique — Transformation publique",
    "350": "Anciens combattants — Réparation préjudices liés Algérie",
    "354": "Intérieur — Administration territoriale",
    "355": "Intérieur — Charge dette SNCF Réseau",
    "356": "Action publique — Investir 2030",
    "357": "Économie — Garantie aide aux entreprises",
    "358": "Renforcement participations financières État",
    "359": "Économie — Plan de soutien aux entreprises",
    "360": "Économie — Compensation TVA",
    "361": "Solidarité — Transformation et modernisation système soins",
    "362": "Écologie (relance)",
    "363": "Compétitivité (relance)",
    "364": "Cohésion (relance)",
    "366": "Justice — Conduite politique justice",
    "411": "Action publique — Fonds pour transformation",
    "424": "Recherche — Financement structurel",
    "425": "Recherche — Financement écosystèmes",
}

# === ANGLE 3 : TOTAL GLOBAL ===
total = df["Montant_num"].sum()
n_lignes = len(df)
n_assos = df["SIREN"].nunique()
n_progs = df["Programme"].nunique()
print("=== ANGLE 3 : TOTAL ===")
print(f"Total versé        : {total:>20,.0f} €  ({total/1e9:.2f} milliards)")
print(f"Nombre de lignes   : {n_lignes:>20,}")
print(f"Associations uniq. : {n_assos:>20,}  (par SIREN)")
print(f"Programmes budg.   : {n_progs:>20,}\n")

# === ANGLE 1 : TOP 20 ASSOCIATIONS ===
top_assos = (df.groupby("Denom")["Montant_num"].agg(["sum","count"])
             .sort_values("sum", ascending=False).head(25))
print("=== ANGLE 1 : TOP 25 ASSOCIATIONS ===")
for nom, row in top_assos.iterrows():
    print(f"  {row['sum']:>15,.0f} €  ({int(row['count']):>4} lignes)  {nom[:60]}")
print()

# === ANGLE 5 : TOP PROGRAMMES (MINISTÈRES) ===
top_progs = (df.groupby("Programme")["Montant_num"].agg(["sum","count"])
             .sort_values("sum", ascending=False).head(20))
print("=== ANGLE 5 : TOP PROGRAMMES BUDGÉTAIRES ===")
for prog, row in top_progs.iterrows():
    libelle = PROGRAMMES.get(str(prog), f"Programme {prog}")
    pct = 100 * row["sum"] / total
    print(f"  {row['sum']/1e6:>9,.1f} M€  {pct:>4.1f}%  P{prog:<4} {libelle[:50]}")
print()

# === ANGLE 2 : CONCENTRATION (PARETO) ===
sorted_assos = df.groupby("Denom")["Montant_num"].sum().sort_values(ascending=False)
n = len(sorted_assos)
cumsum = sorted_assos.cumsum()
total_assos = sorted_assos.sum()
print("=== ANGLE 2 : CONCENTRATION ===")
for pct in [0.001, 0.005, 0.01, 0.05, 0.10, 0.20, 0.50]:
    k = max(1, int(n * pct))
    cum = cumsum.iloc[k-1]
    print(f"  Top {pct*100:>5.1f}% ({k:>5} assos)  ->  {cum/1e9:>5.2f} Md€  ({100*cum/total_assos:>5.1f}% du total)")
print()

# === ANGLE 4 : TOP VILLES ===
top_villes = (df.groupby("COG : libellé")["Montant_num"].agg(["sum","count"])
              .sort_values("sum", ascending=False).head(20))
print("=== ANGLE 4 : TOP 20 VILLES ===")
for ville, row in top_villes.iterrows():
    pct = 100 * row["sum"] / total
    print(f"  {row['sum']/1e6:>9,.1f} M€  {pct:>4.1f}%  {ville}  ({int(row['count'])} lignes)")
print()

# === ANGLE 6 : SAUPOUDRAGE ===
print("=== ANGLE 6 : SAUPOUDRAGE / GROSSES ENVELOPPES ===")
brackets = [(0, 500), (500, 1000), (1000, 5000), (5000, 10000),
            (10000, 50000), (50000, 100000), (100000, 500000),
            (500000, 1_000_000), (1_000_000, 10_000_000), (10_000_000, 1e12)]
for lo, hi in brackets:
    mask = (df["Montant_num"] >= lo) & (df["Montant_num"] < hi)
    n = mask.sum()
    s = df.loc[mask, "Montant_num"].sum()
    label = f"{lo/1000:.0f}k - {hi/1000:.0f}k €" if hi < 1e12 else f"≥ {lo/1e6:.0f} M€"
    print(f"  [{label:>20}]  {n:>6,} lignes ({100*n/n_lignes:>5.1f}%)  →  {s/1e6:>9,.1f} M€ ({100*s/total:>5.1f}%)")
print()

# Export résumé JSON pour réutilisation dans les infographies
out = {
    "source": "Jaune budgétaire PLF 2022 (données 2020) — Bercy / data.economie.gouv.fr",
    "total_eur": total,
    "n_lignes": n_lignes,
    "n_assos_uniques": n_assos,
    "n_programmes": n_progs,
    "top_assos": [
        {"nom": nom, "montant": row["sum"], "lignes": int(row["count"])}
        for nom, row in top_assos.head(20).iterrows()
    ],
    "top_programmes": [
        {"code": str(prog), "libelle": PROGRAMMES.get(str(prog), f"Programme {prog}"),
         "montant": row["sum"], "lignes": int(row["count"]), "pct": 100*row["sum"]/total}
        for prog, row in top_progs.iterrows()
    ],
    "top_villes": [
        {"ville": str(v), "montant": row["sum"], "lignes": int(row["count"])}
        for v, row in top_villes.iterrows()
    ],
    "concentration": [
        {"pct_assos": p*100, "n_assos": int(n*p),
         "cum_montant": cumsum.iloc[max(1,int(n*p))-1],
         "pct_total": 100*cumsum.iloc[max(1,int(n*p))-1]/total_assos}
        for p in [0.001, 0.005, 0.01, 0.05, 0.10, 0.20, 0.50]
    ],
}
with open(Path(__file__).parent / "resume.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2, default=float)
print(f"\n✓ Résumé écrit : resume.json")
