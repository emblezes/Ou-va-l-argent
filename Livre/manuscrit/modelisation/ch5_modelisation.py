"""
ch5_modelisation.py
===================
Modélisation macroéconomique nationale — Chapitre 5 de "Capitalisons. La France et son capital absent"
Auteur : Emmanuel Blezes / Où Va l'Argent — Mai 2026
Version : 1.0

QUESTION : Sur 25 ans (2027-2052) et 50 ans (2027-2077), combien chaque scénario
de transition vers la capitalisation rapporte-t-il à la France en encours de fonds,
en flux annuels, et en impact sur le déficit COR ?

PÉRIMÈTRE : Modélisation macroéconomique nationale (non individuelle — cf. ch2).
  Quatre scénarios (A, B, C, D) comparés à un scénario de référence "statu quo".
  Projection annuelle 2027-2077 (50 ans).

FORMULE PRINCIPALE — Accumulation année par année (boucle terme à terme) :
  Encours(t) = Encours(t-1) × (1 + r_net) + Flux_cotisations(t)
  avec r_net = 4 % réel net de frais (cohérent Ch.2)
  et Flux_cotisations(t) = taux_capitalisation(t) × Masse_salariale(t)

  Validation croisée : formule FV annuité croissante vs boucle terme à terme
  Seuil d'écart admis : < 0,01 %

SOURCES :
  - PIB France 2026 : INSEE Comptes nationaux 2025 (~2 900 Md€)
  - Masse salariale brute : INSEE, ~1 100 Md€ en 2024 (→ ~1 350 Md€ en 2052)
  - Taux cotisation actuel : DSS 2024, 28 % du brut (CNAV 16,9 % + AGIRC-ARRCO 7,7 % + autres)
  - Déficit COR : Rapport COR 2025 (-5 Md€ en 2025, -6,6 Md€ en 2030, -45 Md€ en 2070)
  - Rendement 4 % réel net : cohérent Ch.2, ref. ABP NL, APG, CPPIB (rendements long terme OCDE)
  - FRR encours : Rapport annuel FRR 2024 (20,4 Md€)
  - Taux Superannuation Australie : ATO Historical SG Rates 1992-2025
  - Taux auto-enrolment UK : The Pensions Regulator, 2012-2019
  - NEST UK actifs : Annual Report 2024-2025 (49,7 Md£)
  - CPP Canada : CRA Historical Contribution Rates 1997-2003
  - Modèle suédois PPM : Pensionsmyndigheten, NDC returns 1999-2024
  - Espérance de vie à 65 ans : INSEE tables 2024 (H 20,2 / F 23,9)
  - Passif implicite : Commission européenne Ageing Report 2024 (417 % PIB)

AVERTISSEMENTS :
  Tous les montants sont en euros CONSTANTS 2026 (réels), sauf mention.
  La masse salariale croît en termes réels de +0,5 %/an (même hypothèse que Ch.2).
  Le modèle NE capture PAS : comportements d'épargne compensatoires, effets sur l'offre de
  travail, réactions des marchés financiers, chocs politiques intermédiaires, fiscalité
  des rentes, ni la charge totale sur les finances publiques (sécurité sociale comprise).
  Le modèle est deterministe. Il fournit les trajectoires centrales + fourchettes de sensibilité.
"""

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import os

np.random.seed(42)   # reproductibilité (inutilisé ici — modèle déterministe, seed pour référence)

# ─────────────────────────────────────────────────────────────────────────────
#  0. CHEMINS DE SORTIE
# ─────────────────────────────────────────────────────────────────────────────
BASE_DIR       = os.path.dirname(os.path.abspath(__file__))
CSV_RESULTATS  = os.path.join(BASE_DIR, "ch5_resultats.csv")
CSV_SENSIBILITE = os.path.join(BASE_DIR, "ch5_sensibilite.csv")
PNG_COURBES    = os.path.join(BASE_DIR, "ch5_courbes.png")
RAPPORT_MD     = os.path.join(BASE_DIR, "ch5_rapport_modelisation.md")

# ─────────────────────────────────────────────────────────────────────────────
#  1. PARAMÈTRES GLOBAUX (modifiables ici)
# ─────────────────────────────────────────────────────────────────────────────

# Horizon
ANNEE_DEBUT  = 2027
ANNEE_FIN_25 = 2052   # horizon 25 ans
ANNEE_FIN_50 = 2077   # horizon 50 ans

# Masse salariale brute (Md€ constants 2026)
MASSE_SAL_0    = 1_100.0    # Md€ en 2026/2027 (INSEE 2024 ; légère progression nominale absorbée)
G_MASSE_SAL    = 0.005      # +0,5 %/an réel (cohérent avec g_salaire Ch.2, OCDE projections 2025)
#   → Masse salariale 2052 : 1 100 × (1,005)^25 ≈ 1 247 Md€ (≈1 250 Md€ ~ cible bibliographique 1 350 Md€ ; écart dû à la base 2027)

# Rendement du fonds capitalisé (réel net de frais)
R_CENTRAL      = 0.04       # 4 % réel net — scénario central (CPPIB 10 ans : 7,7 % nominal ≈ 5 % réel ; AP7 Suède : 10 ans ≈ 6 % réel)
R_BAS          = 0.03       # scénario pessimiste
R_HAUT         = 0.05       # scénario optimiste
FRAIS_GESTION  = 0.003      # 0,3 %/an — cohérent AP7 Suède (0,12 %), ABP NL (0,37 %), moyen FRR (0,28 %)
#   Note : r_net = r_brut - frais. Ici r_central = 4 % NET. Les scénarios de sensibilité font varier le net.

# Encours initial France 2026 (tous véhicules : PER + ERAFP + FRR + PERCO + Préfon)
ENCOURS_INITIAL = 200.0     # Md€ (AFG/France Assureurs/FRR 2024 — PER ~100 Md€ + ERAFP ~37 Md€ + FRR 20,4 Md€ + PERCO/autres ~43 Md€)

# FRR disponible comme dotation initiale scénario D
FRR_DOTATION   = 20.4       # Md€ (FRR Rapport annuel 2024)

# Eurobonds retraite scénario D (versement unique en 2027)
EUROBONDS_D    = 50.0       # Md€ (hypothèse — cf. NextGenerationEU comme précédent)

# Déficit COR (Md€, négatif = déficit) — données rapport COR 2025
DEFICIT_COR = {
    2025: -5.0,
    2030: -6.6,
    2040: -15.0,   # interpolation linéaire entre 2030 et 2070 (COR 2025, scénario central)
    2050: -30.0,   # interpolation
    2060: -38.0,   # interpolation
    2070: -45.0,   # COR 2025 explicite
}

# PIB France 2026 (Md€ courants) — pour calcul ratios % PIB
PIB_2026       = 2_900.0    # Md€ (INSEE Comptes nationaux 2025)
G_PIB_REEL     = 0.012      # +1,2 %/an réel (OCDE Economic Outlook 2025, France scénario central)

# Coût fiscal estimé (tax relief, incitations fiscales)
COUT_FISCAL_ANNUEL = {
    "A": 0.0,    # Md€/an — modèle australien : coût intégralement employeur, État zéro
    "B": 0.0,    # recyclage interne — coût État zéro
    "C": 1.5,    # tax relief type NEST UK (1-2 Md£/an, ici 1,5 Md€/an)
    "D": 1.5,    # idem
}

# Taux d'opt-out scénario C (inertie comportementale — NEST UK : 8-12 % historique)
OPT_OUT_C_CENTRAL = 0.10    # 10 % des salariés quittent le fonds par défaut
OPT_OUT_C_BAS     = 0.20    # scénario pessimiste
OPT_OUT_C_HAUT    = 0.05    # scénario optimiste (quasi-universelle)

# Croissances salariales testées en sensibilité
G_SAL_BAS      = 0.000
G_SAL_HAUT     = 0.010

print("=" * 70)
print("ch5_modelisation.py — Capitalisons, Chapitre 5")
print("Projections macroéconomiques nationales 2027-2077")
print("=" * 70)
print(f"Paramètres centraux :")
print(f"  Masse salariale 2027         : {MASSE_SAL_0:,.0f} Md€ réels 2026")
print(f"  Croissance salariale réelle  : {G_MASSE_SAL:.1%}/an")
print(f"  Rendement réel net (central) : {R_CENTRAL:.1%}/an")
print(f"  Encours initial (2026)       : {ENCOURS_INITIAL:,.0f} Md€")
print(f"  PIB France 2026              : {PIB_2026:,.0f} Md€")
print()


# ─────────────────────────────────────────────────────────────────────────────
#  2. FONCTIONS UTILITAIRES
# ─────────────────────────────────────────────────────────────────────────────

def masse_salariale(annee: int, g: float = G_MASSE_SAL) -> float:
    """Masse salariale brute en Md€ réels 2026 pour l'année donnée."""
    t = annee - ANNEE_DEBUT
    return MASSE_SAL_0 * (1 + g) ** t


def pib(annee: int) -> float:
    """PIB en Md€ réels 2026."""
    t = annee - ANNEE_DEBUT
    return PIB_2026 * (1 + G_PIB_REEL) ** (annee - 2026)


def deficit_cor_interpole(annee: int) -> float:
    """
    Déficit COR interpolé linéairement à partir des données du rapport COR 2025.
    Retourne une valeur en Md€ (négative = déficit).
    """
    annees_ref = sorted(DEFICIT_COR.keys())
    valeurs_ref = [DEFICIT_COR[a] for a in annees_ref]
    return float(np.interp(annee, annees_ref, valeurs_ref))


def fv_annuite_croissante(C0: float, r: float, g: float, n: int) -> float:
    """
    Valeur future (fin de période n) d'une annuité croissante.
    Même formule que Ch.2 — utilisée ici pour validation croisée.
    Versements en FIN de période.
    Si r ≠ g : FV = C0 × [(1+r)^n - (1+g)^n] / (r - g)
    Si r = g : FV = C0 × n × (1+r)^(n-1)
    """
    if abs(r - g) < 1e-10:
        return C0 * n * (1 + r) ** (n - 1)
    else:
        return C0 * ((1 + r) ** n - (1 + g) ** n) / (r - g)


# ─────────────────────────────────────────────────────────────────────────────
#  3. DÉFINITION DES TRAJECTOIRES DE COTISATION PAR SCÉNARIO
# ─────────────────────────────────────────────────────────────────────────────

def taux_cotisation_scenario(scenario: str, annee: int, opt_out: float = OPT_OUT_C_CENTRAL) -> float:
    """
    Retourne le taux de cotisation effectif (en fraction de la masse salariale)
    dirigé vers le fonds capitalisé pour l'année donnée, pour le scénario donné.

    SCÉNARIO A — Australien lent :
      Inspiration : Superannuation Guarantee 1992-2025 (ATO Historical SG Rates).
      1 % en 2027, montée linéaire de 0,20 pt/an, plafond 6 % atteint en 2052.
      Après 2052 : stabilisation à 6 %.
      Source analogique : SG passé de 3 % à 12 % en 33 ans = +0,27 pt/an.
      Ici on vise +0,20 pt/an sur 25 ans (ambition légèrement plus modeste, contexte français).

    SCÉNARIO B — Suédois rapide (recyclage) :
      Inspiration : Réforme suédoise 1999 — 2,5 pts PPM sur 18,5 pts existants.
      Recyclage de 2 points des cotisations existantes vers le pilier capitalisé.
      Aucune hausse de la cotisation totale.
      Taux CONSTANT à 2 % dès 2027 (pas de montée progressive).
      Conséquence : le taux de remplacement NDC baisse légèrement (voir note méthodologique).

    SCÉNARIO C — Britannique auto-enrolment (NEST France) :
      Inspiration : Pensions Regulator UK — montée 2 % → 5 % (2018) → 8 % (2019).
      Ici la montée est étalée sur 8 ans pour tenir compte du contexte français.
      2 % en 2028, +0,75 pt/an → 8 % en 2036, stabilisation à 8 %.
      Opt-out paramétrable (défaut 10 %).
      Cotisation effective = taux nominal × (1 - opt_out).

    SCÉNARIO D — Hybride Canada-Australie :
      Phase 1 (2027-2030) : dotation FRR + eurobonds (hors flux courant, capitalisé séparément)
      Phase 2 (2028-2035) : cotisation paritaire 1 % → 4 % (0,5 pt/an)
        Source : CPP Enhancement Canada 1997-2003 (+0,4 pt/an) et 2019-2023 (+0,5 pt/an).
      Phase 3 (2030-2040) : redéploiement +1 pt AGIRC-ARRCO (conditionnel accord paritaire)
        → Flux additionnel de 1 % sur la masse salariale à partir de 2030.
      Phase 4 (2040-2052) : stabilisation à 4 % (cotisation paritaire) + 1 % AGIRC = 5 % total.
    """
    t = annee - ANNEE_DEBUT   # t=0 en 2027

    if scenario == "A":
        # Montée linéaire 1 % → 6 % sur 25 ans (2027-2052)
        taux = 0.01 + 0.20 / 100 * t   # +0,20 point par an
        taux = min(taux, 0.06)          # plafond à 6 %
        return max(taux, 0.0)

    elif scenario == "B":
        # Recyclage constant 2 points dès 2027
        return 0.02

    elif scenario == "C":
        # Montée 2 % → 8 % sur 8 ans (2028-2036)
        if annee < 2028:
            taux_brut = 0.0
        elif annee <= 2036:
            taux_brut = 0.02 + (annee - 2028) * 0.0075   # 2028→2 %, 2036→8 %
        else:
            taux_brut = 0.08
        taux_brut = max(0.0, min(taux_brut, 0.08))
        return taux_brut * (1 - opt_out)

    elif scenario == "D":
        # Phase 2 : cotisation paritaire 0,5 pt/an à partir de 2028
        if annee < 2028:
            taux_cotis = 0.0
        elif annee <= 2035:
            taux_cotis = (annee - 2027) * 0.005   # 2028→0,5 %, 2035→4 %
        else:
            taux_cotis = 0.04   # plafond phase 2

        # Phase 3 : +1 % AGIRC-ARRCO à partir de 2030 (conditionnel, inclus ici en central)
        taux_agirc = 0.01 if annee >= 2030 else 0.0

        return min(taux_cotis + taux_agirc, 0.05)   # plafond 5 %

    else:
        raise ValueError(f"Scénario inconnu : {scenario}")


# ─────────────────────────────────────────────────────────────────────────────
#  4. CALCUL DE L'ENCOURS ANNUEL (boucle terme à terme)
# ─────────────────────────────────────────────────────────────────────────────

def simuler_scenario(
    scenario: str,
    r_net: float = R_CENTRAL,
    g_sal: float = G_MASSE_SAL,
    opt_out: float = OPT_OUT_C_CENTRAL,
    annee_fin: int = ANNEE_FIN_50,
    encours_init: float = ENCOURS_INITIAL,
    include_dotation_D: bool = True,
) -> pd.DataFrame:
    """
    Simulation terme à terme de l'encours capitalisé pour un scénario donné.

    Retourne un DataFrame avec colonnes :
      annee, encours_Mde, flux_cotisations_Mde, masse_sal_Mde, taux_capi,
      cotis_cumulees_Mde, deficit_cor_Mde, encours_pct_pib, capital_par_actif_ke

    Hypothèses :
      - Encours initial 2026 (200 Md€) identique pour tous les scénarios
        (représente l'épargne retraite existante — PER, ERAFP, FRR, PERCO)
      - Les flux de cotisation sont versés en FIN d'année (convention boucle récursive)
        : Encours(t) = Encours(t-1) × (1 + r_net) + Flux(t)
      - Scénario D : dotation initiale FRR (20,4 Md€) + eurobonds (50 Md€) s'ajoutent
        en 2027 (début de la simulation), en plus de l'encours initial commun.
      - Masse salariale = 1 100 Md€ × (1 + g_sal)^t (croissance réelle)
    """
    annees = list(range(ANNEE_DEBUT, annee_fin + 1))
    encours = encours_init

    # Scénario D : dotation initiale FRR + eurobonds (s'ajoutent à t=0, avant la boucle)
    if scenario == "D" and include_dotation_D:
        encours += FRR_DOTATION + EUROBONDS_D

    rows = []
    cotis_cumul = 0.0

    for annee in annees:
        ms = masse_salariale(annee, g=g_sal)
        taux = taux_cotisation_scenario(scenario, annee, opt_out=opt_out)
        flux = ms * taux   # Md€

        # Capitalisation + versement fin d'année
        encours = encours * (1 + r_net) + flux
        cotis_cumul += flux

        # Déficit COR : impact de la capitalisation
        # Hypothèse : le recyclage de cotisations (scénario B) aggrave immédiatement le déficit
        # car les cotisations réparties diminuent. Les autres scénarios (A, C, D) s'ajoutent
        # à l'enveloppe existante → pas d'aggravation directe du déficit COR à court terme.
        # En revanche, à long terme (2045+), les rentes capitalisées réduisent les besoins
        # de retraite → effet favorable sur le déficit COR. Modélisation simplifiée :
        # On estime qu'à partir de 2045, chaque 100 Md€ d'encours réduit le déficit de 2 Md€/an
        # (hypothèse : taux de sortie rente ~2 % de l'encours, réinvestissement partiel).
        deficit_base = deficit_cor_interpole(annee)
        if scenario == "B":
            # Recyclage 2 % → moins de répartition → aggravation proportionnelle
            # 2 % de masse salariale = ~22 Md€/an de cotisations transférées
            # Impact sur déficit COR : +2 Md€/an de déficit supplémentaire à court terme
            # (approximation — en réalité, les droits NDC sont réduits proportionnellement)
            aggravation_B = -2.0   # Md€ de déficit supplémentaire
            deficit_ajuste = deficit_base + aggravation_B
        else:
            deficit_ajuste = deficit_base

        # Effet de réduction à long terme (toutes scénarios, à partir de 2045)
        if annee >= 2045 and encours > 0:
            effet_reduction = encours * 0.02 * 0.30   # 30 % de la rente réduit les besoins COR
            # Plafonnement : l'effet ne peut pas dépasser le déficit lui-même
            effet_reduction = min(effet_reduction, abs(deficit_ajuste))
            deficit_ajuste = deficit_ajuste + effet_reduction   # déficit réduit (moins négatif)

        pib_annee = pib(annee)
        n_actifs = 23.0   # millions d'actifs (hypothèse stable 2027-2052, source INSEE 2024)

        rows.append({
            "annee":                annee,
            "scenario":             scenario,
            "encours_Mde":          round(encours, 1),
            "flux_cotisations_Mde": round(flux, 1),
            "masse_sal_Mde":        round(ms, 1),
            "taux_capi_pct":        round(taux * 100, 2),
            "cotis_cumulees_Mde":   round(cotis_cumul, 1),
            "deficit_cor_Mde":      round(deficit_ajuste, 1),
            "pib_Mde":              round(pib_annee, 0),
            "encours_pct_pib":      round(encours / pib_annee * 100, 1),
            "capital_par_actif_ke": round(encours / n_actifs * 1000 / 1000, 1),   # en k€
        })

    return pd.DataFrame(rows)


# ─────────────────────────────────────────────────────────────────────────────
#  5. VALIDATION CROISÉE — FV annuité vs boucle récursive
# ─────────────────────────────────────────────────────────────────────────────

print("\n" + "=" * 70)
print("VALIDATION CROISÉE — Scénario A (flux constant simplifié)")
print("=" * 70)

# Pour la validation, on simplifie : taux constant 3,5 % (milieu de la montée A),
# masse salariale constante 1 100 Md€, pendant 25 ans, encours initial = 0.
# Flux annuel C0 = 1 100 × 0,035 = 38,5 Md€
# FV annuité croissante à g=0,5 %/an, r_net=4 %, n=25

C0_VALID    = 1_100.0 * 0.035   # 38,5 Md€ (approximation flux moyen scénario A)
R_VALID     = R_CENTRAL          # 4 % réel net
G_VALID     = G_MASSE_SAL        # 0,5 %/an
N_VALID     = 25

fv_formule = fv_annuite_croissante(C0=C0_VALID, r=R_VALID, g=G_VALID, n=N_VALID)
print(f"Flux initial C0 (test)        = {C0_VALID:,.1f} Md€")
print(f"Rendement réel net (test)     = {R_VALID:.1%}")
print(f"Croissance masse sal (test)   = {G_VALID:.1%}/an")
print(f"Durée (test)                  = {N_VALID} ans")
print(f"FV formule annuité croissante = {fv_formule:,.1f} Md€")

# Même calcul en boucle récursive
capital_boucle = 0.0
for t in range(N_VALID):
    versement = C0_VALID * (1 + G_VALID) ** t
    capital_boucle = capital_boucle * (1 + R_VALID) + versement
print(f"FV boucle récursive (25 ans)  = {capital_boucle:,.1f} Md€")

ecart_validation = abs(fv_formule - capital_boucle) / fv_formule * 100
print(f"Écart relatif                 = {ecart_validation:.6f} % (seuil : < 0,01 %)")

if ecart_validation > 0.01:
    raise ValueError(f"ERREUR : Écart formule vs boucle = {ecart_validation:.6f} % > 0,01 %")
else:
    print(f"OK — Formule FV validée par boucle récursive (écart {ecart_validation:.6f} %)")

# Vérification multiplicateur composé sur 25 ans
multiplicateur_25 = (1.04) ** 25
print(f"\nVérification (1,04)^25 = {multiplicateur_25:.4f} (cible ≈ 2,6658)")
assert abs(multiplicateur_25 - 2.6658) < 0.001, "Erreur multiplicateur 25 ans"
print(f"OK — Multiplicateur 25 ans : {multiplicateur_25:.4f}")

multiplicateur_50 = (1.04) ** 50
print(f"Vérification (1,04)^50 = {multiplicateur_50:.4f} (cible ≈ 7,1067)")
assert abs(multiplicateur_50 - 7.1067) < 0.001, "Erreur multiplicateur 50 ans"
print(f"OK — Multiplicateur 50 ans : {multiplicateur_50:.4f}")


# ─────────────────────────────────────────────────────────────────────────────
#  6. SIMULATION CENTRALE — 4 SCÉNARIOS, 2027-2077
# ─────────────────────────────────────────────────────────────────────────────

print("\n" + "=" * 70)
print("SIMULATION CENTRALE (r = 4 % réel net, g_sal = 0,5 %/an)")
print("=" * 70)

scenarios = ["A", "B", "C", "D"]
labels = {
    "A": "A — Australien lent (1→6 % patronal)",
    "B": "B — Suédois rapide (2 pts recyclés)",
    "C": "C — Auto-enrolment NEST France (2→8 %)",
    "D": "D — Hybride Canada-Australie (1→5 % paritaire+AGIRC)",
}

dfs_central = {}
for sc in scenarios:
    df = simuler_scenario(sc, r_net=R_CENTRAL, g_sal=G_MASSE_SAL, annee_fin=ANNEE_FIN_50)
    dfs_central[sc] = df

# Affichage des encours aux jalons clés
jalons = [2027, 2032, 2037, 2042, 2047, 2052, 2062, 2077]

print(f"\n{'Année':<8}", end="")
for sc in scenarios:
    print(f"{labels[sc][:28]:<30}", end="")
print()
print("-" * (8 + 30 * 4))

for an in jalons:
    print(f"{an:<8}", end="")
    for sc in scenarios:
        df = dfs_central[sc]
        row = df[df["annee"] == an]
        if len(row) > 0:
            enc = row["encours_Mde"].values[0]
            pib_pct = row["encours_pct_pib"].values[0]
            print(f"{enc:>10,.0f} Md€ ({pib_pct:.0f}% PIB){'':<6}", end="")
        else:
            print(f"{'N/A':<30}", end="")
    print()

# Résumé par scénario à 2052 et 2077
print("\n" + "=" * 70)
print("RÉSULTATS CLÉS — Scénario central (4 % réel net)")
print("=" * 70)
for sc in scenarios:
    df = dfs_central[sc]
    row_52 = df[df["annee"] == 2052].iloc[0]
    row_77 = df[df["annee"] == 2077].iloc[0]

    # Taux en 2052
    taux_2052 = taux_cotisation_scenario(sc, 2052)
    taux_2027 = taux_cotisation_scenario(sc, 2027)

    print(f"\n  {labels[sc]}")
    print(f"    Taux capitalisation 2027  : {taux_2027:.1%} de la masse salariale")
    print(f"    Taux capitalisation 2052  : {taux_2052:.1%} de la masse salariale")
    print(f"    Flux annuel 2052          : {row_52['flux_cotisations_Mde']:,.0f} Md€/an")
    print(f"    Encours 2052              : {row_52['encours_Mde']:,.0f} Md€ ({row_52['encours_pct_pib']:.0f} % PIB)")
    print(f"    Capital/actif 2052        : {row_52['capital_par_actif_ke']:,.0f} k€/actif")
    print(f"    Cotis. cumulées 2027-2052 : {row_52['cotis_cumulees_Mde']:,.0f} Md€")
    print(f"    Encours 2077              : {row_77['encours_Mde']:,.0f} Md€ ({row_77['encours_pct_pib']:.0f} % PIB)")
    print(f"    Déficit COR ajusté 2052   : {row_52['deficit_cor_Mde']:,.1f} Md€")


# ─────────────────────────────────────────────────────────────────────────────
#  7. EXPORT CSV — RÉSULTATS CENTRAUX
# ─────────────────────────────────────────────────────────────────────────────

df_all_central = pd.concat([dfs_central[sc] for sc in scenarios], ignore_index=True)
df_all_central.to_csv(CSV_RESULTATS, index=False, encoding="utf-8")
print(f"\n→ Résultats centraux exportés : {CSV_RESULTATS}")


# ─────────────────────────────────────────────────────────────────────────────
#  8. ANALYSE DE SENSIBILITÉ
# ─────────────────────────────────────────────────────────────────────────────

print("\n" + "=" * 70)
print("ANALYSE DE SENSIBILITÉ")
print("=" * 70)

# Paramètres à faire varier
rendements = [R_BAS, R_CENTRAL, R_HAUT]
croissances_sal = [G_SAL_BAS, G_MASSE_SAL, G_SAL_HAUT]
opt_outs_C = [OPT_OUT_C_HAUT, OPT_OUT_C_CENTRAL, OPT_OUT_C_BAS]   # haut=optimiste

rows_sensi = []
for sc in scenarios:
    # Sensibilité au rendement (scénario C : opt_out central)
    for r in rendements:
        df_s = simuler_scenario(sc, r_net=r, g_sal=G_MASSE_SAL, annee_fin=ANNEE_FIN_50)
        row_52 = df_s[df_s["annee"] == 2052].iloc[0]
        row_77 = df_s[df_s["annee"] == 2077].iloc[0]
        rows_sensi.append({
            "scenario": sc,
            "parametre_varie": "rendement_reel_net",
            "valeur": r,
            "g_sal": G_MASSE_SAL,
            "opt_out": OPT_OUT_C_CENTRAL,
            "encours_2052_Mde": row_52["encours_Mde"],
            "encours_pct_pib_2052": row_52["encours_pct_pib"],
            "capital_par_actif_2052_ke": row_52["capital_par_actif_ke"],
            "encours_2077_Mde": row_77["encours_Mde"],
            "deficit_cor_2052_Mde": row_52["deficit_cor_Mde"],
            "cotis_cumulees_2052_Mde": row_52["cotis_cumulees_Mde"],
        })

    # Sensibilité à la croissance salariale
    for g in croissances_sal:
        df_s = simuler_scenario(sc, r_net=R_CENTRAL, g_sal=g, annee_fin=ANNEE_FIN_50)
        row_52 = df_s[df_s["annee"] == 2052].iloc[0]
        row_77 = df_s[df_s["annee"] == 2077].iloc[0]
        rows_sensi.append({
            "scenario": sc,
            "parametre_varie": "croissance_salariale",
            "valeur": g,
            "g_sal": g,
            "opt_out": OPT_OUT_C_CENTRAL,
            "encours_2052_Mde": row_52["encours_Mde"],
            "encours_pct_pib_2052": row_52["encours_pct_pib"],
            "capital_par_actif_2052_ke": row_52["capital_par_actif_ke"],
            "encours_2077_Mde": row_77["encours_Mde"],
            "deficit_cor_2052_Mde": row_52["deficit_cor_Mde"],
            "cotis_cumulees_2052_Mde": row_52["cotis_cumulees_Mde"],
        })

# Sensibilité opt-out (scénario C uniquement)
for oo in opt_outs_C:
    df_s = simuler_scenario("C", r_net=R_CENTRAL, g_sal=G_MASSE_SAL,
                             opt_out=oo, annee_fin=ANNEE_FIN_50)
    row_52 = df_s[df_s["annee"] == 2052].iloc[0]
    row_77 = df_s[df_s["annee"] == 2077].iloc[0]
    rows_sensi.append({
        "scenario": "C",
        "parametre_varie": "opt_out",
        "valeur": oo,
        "g_sal": G_MASSE_SAL,
        "opt_out": oo,
        "encours_2052_Mde": row_52["encours_Mde"],
        "encours_pct_pib_2052": row_52["encours_pct_pib"],
        "capital_par_actif_2052_ke": row_52["capital_par_actif_ke"],
        "encours_2077_Mde": row_77["encours_Mde"],
        "deficit_cor_2052_Mde": row_52["deficit_cor_Mde"],
        "cotis_cumulees_2052_Mde": row_52["cotis_cumulees_Mde"],
    })

df_sensi = pd.DataFrame(rows_sensi)
df_sensi.to_csv(CSV_SENSIBILITE, index=False, encoding="utf-8")
print(f"→ Sensibilité exportée : {CSV_SENSIBILITE}")

# Affichage tableau sensibilité scénario D central
print("\nSensibilité encours 2052 (Md€) — scénario D par rendement :")
for r in rendements:
    enc = df_sensi[
        (df_sensi["scenario"] == "D") &
        (df_sensi["parametre_varie"] == "rendement_reel_net") &
        (df_sensi["valeur"].round(2) == round(r, 2))
    ]["encours_2052_Mde"].values[0]
    print(f"  r = {r:.0%} réel net → encours 2052 = {enc:,.0f} Md€")


# ─────────────────────────────────────────────────────────────────────────────
#  9. GRAPHIQUE PUBLICATION-READY — charte OVLA
# ─────────────────────────────────────────────────────────────────────────────

OVLA_COLORS = {
    "cyan":    "#00d4ff",
    "red":     "#ff4757",
    "gold":    "#ffd700",
    "green":   "#00ff88",
    "violet":  "#a855f7",
    "orange":  "#ff9f43",
    "navy":    "#0a1220",
    "midnight":"#142b48",
}

SCENARIO_COLORS = {
    "A": OVLA_COLORS["orange"],
    "B": OVLA_COLORS["violet"],
    "C": OVLA_COLORS["cyan"],
    "D": OVLA_COLORS["gold"],
}

plt.rcParams.update({
    "figure.facecolor":   OVLA_COLORS["navy"],
    "axes.facecolor":     OVLA_COLORS["navy"],
    "axes.edgecolor":     "#ffffff",
    "axes.labelcolor":    "#ffffff",
    "xtick.color":        "#ffffff",
    "ytick.color":        "#ffffff",
    "text.color":         "#ffffff",
    "grid.color":         "#ffffff",
    "grid.alpha":         0.08,
    "font.family":        "sans-serif",
    "font.size":          11,
    "axes.titlesize":     13,
    "axes.titleweight":   "bold",
    "figure.dpi":         300,
})

fig, axes = plt.subplots(1, 2, figsize=(1920/300 * 2, 1080/300 * 2))
fig.patch.set_facecolor(OVLA_COLORS["navy"])

annees_plot = list(range(ANNEE_DEBUT, ANNEE_FIN_50 + 1))

# ── Graphique gauche : trajectoires encours 4 scénarios + fourchette scénario D ──
ax1 = axes[0]
ax1.set_facecolor(OVLA_COLORS["navy"])

# Fourchette scénario D (rendement 3 % - 5 %)
df_D_bas  = simuler_scenario("D", r_net=R_BAS,  g_sal=G_MASSE_SAL, annee_fin=ANNEE_FIN_50)
df_D_haut = simuler_scenario("D", r_net=R_HAUT, g_sal=G_MASSE_SAL, annee_fin=ANNEE_FIN_50)
ax1.fill_between(
    df_D_bas["annee"],
    df_D_bas["encours_Mde"],
    df_D_haut["encours_Mde"],
    alpha=0.12, color=OVLA_COLORS["gold"],
    label="D — Fourchette 3-5 %"
)

# Fourchette scénario A
df_A_bas  = simuler_scenario("A", r_net=R_BAS,  g_sal=G_MASSE_SAL, annee_fin=ANNEE_FIN_50)
df_A_haut = simuler_scenario("A", r_net=R_HAUT, g_sal=G_MASSE_SAL, annee_fin=ANNEE_FIN_50)
ax1.fill_between(
    df_A_bas["annee"],
    df_A_bas["encours_Mde"],
    df_A_haut["encours_Mde"],
    alpha=0.10, color=OVLA_COLORS["orange"],
)

# Courbes centrales
for sc in scenarios:
    df = dfs_central[sc]
    lw = 2.8 if sc == "D" else 1.8
    ax1.plot(df["annee"], df["encours_Mde"],
             color=SCENARIO_COLORS[sc], lw=lw,
             label=f"{sc} — {'central' if sc == 'D' else ''}")

# Ligne de référence 1 500 Md€ (cible 25 ans)
ax1.axhline(1_500, color="#ffffff", lw=0.8, ls="--", alpha=0.4)
ax1.text(2029, 1_530, "Cible 2052 : 1 500 Md€ (50 % PIB)", color="#ffffff",
         fontsize=7.5, alpha=0.7)

# Ligne de référence 3 000 Md€ (cible 50 ans)
ax1.axhline(3_000, color="#ffffff", lw=0.8, ls=":", alpha=0.3)
ax1.text(2029, 3_030, "Cible 2077 : 3 000 Md€ (100 % PIB)", color="#ffffff",
         fontsize=7.5, alpha=0.5)

# Annotations finales (2077)
offsets = {"A": (0, -80), "B": (0, 40), "C": (0, -40), "D": (0, 60)}
for sc in scenarios:
    df = dfs_central[sc]
    enc_fin = df["encours_Mde"].iloc[-1]
    ax1.annotate(
        f"{labels[sc][:3]}: {enc_fin:,.0f} Md€",
        xy=(2077, enc_fin),
        xytext=(-70 + offsets[sc][0], offsets[sc][1]),
        textcoords="offset points",
        color=SCENARIO_COLORS[sc], fontsize=8, fontweight="bold",
        arrowprops=dict(arrowstyle="->", color=SCENARIO_COLORS[sc], lw=0.7)
    )

# Ligne verticale jalons
ax1.axvline(2052, color="#ffffff", lw=0.6, ls="-", alpha=0.2)
ax1.text(2052.5, 200, "2052\n(25 ans)", color="#ffffff", fontsize=7, alpha=0.5)

ax1.set_xlim(ANNEE_DEBUT, ANNEE_FIN_50 + 1)
ax1.set_ylim(0, None)
ax1.set_xlabel("Année", fontsize=10)
ax1.set_ylabel("Encours capitalisé (Md€ constants 2026)", fontsize=10)
ax1.set_title("Encours capitalisé — 4 scénarios (2027-2077)", fontsize=12,
              fontweight="bold", color=OVLA_COLORS["cyan"])
ax1.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{x/1000:.0f} 000 Md€" if x >= 1000 else f"{x:.0f} Md€"))
ax1.legend(fontsize=7.5, framealpha=0.2, loc="upper left",
           handles=[
               plt.Line2D([0], [0], color=SCENARIO_COLORS["A"], lw=2, label=f"A — Australien lent"),
               plt.Line2D([0], [0], color=SCENARIO_COLORS["B"], lw=2, label=f"B — Suédois rapide"),
               plt.Line2D([0], [0], color=SCENARIO_COLORS["C"], lw=2, label=f"C — Auto-enrolment"),
               plt.Line2D([0], [0], color=SCENARIO_COLORS["D"], lw=2.8, label=f"D — Hybride Canada-AU"),
           ])
ax1.grid(True, alpha=0.08)

# ── Graphique droit : flux de cotisations annuels 2027-2052 ──
ax2 = axes[1]
ax2.set_facecolor(OVLA_COLORS["navy"])

for sc in scenarios:
    df = dfs_central[sc][dfs_central[sc]["annee"] <= 2052]
    lw = 2.4 if sc == "D" else 1.6
    ax2.plot(df["annee"], df["flux_cotisations_Mde"],
             color=SCENARIO_COLORS[sc], lw=lw,
             label=f"{sc}")

# Ligne de référence déficit COR 2030
ax2.axhline(6.6, color=OVLA_COLORS["red"], lw=0.8, ls="--", alpha=0.5)
ax2.text(2028, 7.5, "Déficit COR 2030 : 6,6 Md€", color=OVLA_COLORS["red"], fontsize=7.5)

# Ligne 45 Md€ (déficit COR 2070 extrapolé)
ax2.axhline(45, color=OVLA_COLORS["red"], lw=0.8, ls=":", alpha=0.35)
ax2.text(2028, 46, "Déficit COR 2070 : 45 Md€", color=OVLA_COLORS["red"], fontsize=7.5, alpha=0.7)

ax2.set_xlim(ANNEE_DEBUT, 2053)
ax2.set_ylim(0, None)
ax2.set_xlabel("Année", fontsize=10)
ax2.set_ylabel("Flux cotisations vers capitalisation (Md€/an)", fontsize=10)
ax2.set_title("Flux annuels vers le fonds (2027-2052)", fontsize=12,
              fontweight="bold", color=OVLA_COLORS["gold"])
ax2.legend(fontsize=9, framealpha=0.2, loc="upper left")
ax2.grid(True, alpha=0.08)

# Titre principal
fig.suptitle(
    "Capitalisons — Ch. 5 : Quatre scénarios de transition vers la capitalisation\n"
    "France 2027-2077 · Euros constants 2026 · r = 4 % réel net (scénario central)",
    fontsize=12, fontweight="bold", color="#ffffff", y=1.01
)

plt.tight_layout()
plt.savefig(PNG_COURBES, dpi=300, bbox_inches="tight", facecolor=OVLA_COLORS["navy"])
print(f"\n→ Graphique exporté : {PNG_COURBES}")


# ─────────────────────────────────────────────────────────────────────────────
#  10. VÉRIFICATION DE COHÉRENCE INTERNATIONALE
# ─────────────────────────────────────────────────────────────────────────────

print("\n" + "=" * 70)
print("VÉRIFICATION COHÉRENCE INTERNATIONALE")
print("=" * 70)

# Australie (référence empirique)
# Encours super juin 2025 : 4 300 Md AUD (APRA 2025)
# PIB Australie 2025 : ~2 700 Md AUD
# Ratio encours/PIB Australie : ~160 %
print("Australie (référence 33 ans) :")
print(f"  Encours super juin 2025 : 4 300 Md AUD")
print(f"  PIB Australie 2025      : ~2 700 Md AUD")
print(f"  Ratio encours/PIB       : ~160 %")
print()

# France scénario A en 2052 (25 ans, taux max 6 %) vs Australie en 2025 (33 ans, taux max 12 %)
enc_A_2052 = dfs_central["A"][dfs_central["A"]["annee"] == 2052]["encours_Mde"].values[0]
pib_2052 = pib(2052)
ratio_A_2052 = enc_A_2052 / pib_2052 * 100
print(f"France Sc.A en 2052 (25 ans, 6 %) :")
print(f"  Encours         : {enc_A_2052:,.0f} Md€")
print(f"  PIB 2052 estimé : {pib_2052:,.0f} Md€")
print(f"  Ratio /PIB      : {ratio_A_2052:.0f} %")
print(f"  Commentaire     : Cohérent — Australie arrive à 160 % en 33 ans avec 12 % de cotis.")
print(f"                    La France vise ~40-50 % PIB avec 6 % en 25 ans → ratio attendu plus bas.")

print()
# Canada (référence 28 ans)
# CPPIB actifs juin 2025 : ~714 Md CAD
# PIB Canada 2025 : ~2 900 Md CAD
# Ratio : ~25 %
# Mais CPP ne couvre que ~1/3 du revenu → cohérent avec un pilier partiel
print("Canada CPPIB (référence 28 ans) :")
print(f"  Actifs CPPIB 2025  : ~714 Md CAD")
print(f"  PIB Canada 2025    : ~2 900 Md CAD")
print(f"  Ratio /PIB         : ~25 %")
print(f"  Note : CPP est un pilier partiel (~30 % du remplacement). Cohérent avec")
print(f"         la France scénario B (2 pts recyclés, pilier limité).")

# Suède (référence 25 ans)
# AP-fonds (AP1+AP2+AP3+AP4+AP6+AP7) : ~2 100 Md SEK fin 2024
# PIB Suède 2024 : ~7 000 Md SEK
# Ratio AP-fonds/PIB : ~30 %
# PPM (capitalisation individuelle) : environ 2 000 Md SEK
# Total capitalisation suédoise : ~60 % PIB
print()
print("Suède (référence 25 ans) :")
print(f"  AP-fonds total 2024 : ~2 100 Md SEK")
print(f"  PIB Suède 2024      : ~7 000 Md SEK")
print(f"  Ratio /PIB          : ~30 % (AP-fonds seuls) ; ~60 % avec PPM individuel")
print(f"  France Sc.B 2052    : {dfs_central['B'][dfs_central['B']['annee']==2052]['encours_pct_pib'].values[0]:.0f} % PIB")
print(f"  Commentaire         : Scénario B plus modeste — 2 pts seulement vs 2,5 pts PPM + réserves AP.")

print()
enc_D_2052 = dfs_central["D"][dfs_central["D"]["annee"] == 2052]["encours_Mde"].values[0]
enc_D_2077 = dfs_central["D"][dfs_central["D"]["annee"] == 2077]["encours_Mde"].values[0]
print(f"Scénario D central (résumé publication) :")
print(f"  Encours 2052 : {enc_D_2052:,.0f} Md€ (scénario central, 4 % réel net)")
print(f"  Encours 2077 : {enc_D_2077:,.0f} Md€")

# Sensibilité scénario D
enc_D_3 = df_sensi[
    (df_sensi["scenario"] == "D") &
    (df_sensi["parametre_varie"] == "rendement_reel_net") &
    (df_sensi["valeur"].round(2) == 0.03)
]["encours_2052_Mde"].values[0]
enc_D_5 = df_sensi[
    (df_sensi["scenario"] == "D") &
    (df_sensi["parametre_varie"] == "rendement_reel_net") &
    (df_sensi["valeur"].round(2) == 0.05)
]["encours_2052_Mde"].values[0]
print(f"  Fourchette 2052 : {enc_D_3:,.0f} Md€ (3 %) — {enc_D_5:,.0f} Md€ (5 %)")

print()
print(f"Écart formule FV vs boucle récursive : {ecart_validation:.6f} % (seuil 0,01 % — OK)")


# ─────────────────────────────────────────────────────────────────────────────
#  11. GÉNÉRATION DU RAPPORT MÉTHODOLOGIQUE MARKDOWN
# ─────────────────────────────────────────────────────────────────────────────

# Calcul des valeurs pour les tableaux
def get_enc(sc, an):
    return dfs_central[sc][dfs_central[sc]["annee"] == an]["encours_Mde"].values[0]

def get_pib_pct(sc, an):
    return dfs_central[sc][dfs_central[sc]["annee"] == an]["encours_pct_pib"].values[0]

def get_flux(sc, an):
    return dfs_central[sc][dfs_central[sc]["annee"] == an]["flux_cotisations_Mde"].values[0]

def get_deficit(sc, an):
    return dfs_central[sc][dfs_central[sc]["annee"] == an]["deficit_cor_Mde"].values[0]

def get_cap_actif(sc, an):
    return dfs_central[sc][dfs_central[sc]["annee"] == an]["capital_par_actif_ke"].values[0]

def get_cotis_cum(sc, an):
    return dfs_central[sc][dfs_central[sc]["annee"] == an]["cotis_cumulees_Mde"].values[0]

# Tableau 1 — Trajectoires de cotisation
def taux_str(sc, an):
    t = taux_cotisation_scenario(sc, an)
    return f"{t:.1%}"

# Tableau 2 — Encours
jalons_tab2 = [2027, 2032, 2037, 2042, 2047, 2052, 2077]

# Tableau 3 — Coût budgétaire annuel estimé
# Scénario A : 0 (coût intégralement employeur)
# Scénario B : 0 (recyclage interne)
# Scénario C : ~1,5 Md€/an (tax relief)
# Scénario D : ~1,5 Md€/an (tax relief) + charge des eurobonds (~2 Md€/an d'intérêts sur 50 Md€ à 4 %)
cout_D_eurobonds = 50.0 * 0.04   # 2 Md€/an d'intérêts sur les eurobonds (~4 % taux souverain France 2026)

# Tableau 4 — Impact déficit COR
jalons_deficit = [2027, 2030, 2040, 2052, 2070]

rapport = f"""# Rapport méthodologique — Chapitre 5 : Vingt-cinq ans pour basculer
## *Capitalisons. La France et son capital absent*
### Auteur : Emmanuel Blezes / Où Va l'Argent — Mai 2026

---

## 1. Objet de la modélisation

Ce rapport documente les projections macroéconomiques nationales du Chapitre 5 du livre
*Capitalisons*, portant sur quatre scénarios de transition vers un pilier de retraite
capitalisé en France sur la période 2027-2077.

**Question centrale :** Pour chacun des quatre scénarios de bascule, quel encours de
capital sous gestion la France accumule-t-elle à 25 ans (2052) et à 50 ans (2077),
à quelle vitesse les flux de cotisation montent-ils, et quel est l'impact sur le
déficit du système de retraites projeté par le COR ?

Cette modélisation est complémentaire de celle du Chapitre 2 (actif individuel de 30 ans).
Elle porte sur l'agrégat national : non pas un individu, mais 23 millions d'actifs
et une masse salariale brute de 1 100 à 1 250 Md€ selon l'horizon.

---

## 2. Hypothèses paramétriques

Toutes les hypothèses sont datées mai 2026. Les hypothèses vieillissent et devront
être révisées lors d'une mise à jour du livre.

| Paramètre | Valeur | Source | Date |
|---|---|---|---|
| PIB France 2026 | 2 900 Md€ | INSEE Comptes nationaux 2025 | mai 2026 |
| Masse salariale brute 2027 | 1 100 Md€ constants 2026 | INSEE Comptes nationaux 2024 | mai 2026 |
| Croissance salariale réelle | +0,5 %/an | OCDE Economic Outlook 2025 (France) | mai 2026 |
| Masse salariale 2052 (estimée) | ~1 247 Md€ réels 2026 | Calcul modèle | mai 2026 |
| Croissance PIB réelle | +1,2 %/an | OCDE Economic Outlook 2025 | mai 2026 |
| Rendement réel net (central) | 4,0 %/an | CPPIB 10 ans ~7,7 % nominal ≈ 5 % réel ; AP7 Suède ; FRR France 2024 (+6,46 % nominal) | mai 2026 |
| Rendement réel net (bas) | 3,0 %/an | Scénario pessimiste (obligations seules) | mai 2026 |
| Rendement réel net (haut) | 5,0 %/an | Scénario optimiste (portefeuille actions pondéré) | mai 2026 |
| Frais de gestion | 0,3 %/an | AP7 Suède 0,12 % ; ABP NL 0,37 % ; FRR France 0,28 % ; moyenne | mai 2026 |
| Encours initial France 2026 | 200 Md€ | PER ~100 Md€ (AFG 2024) + ERAFP ~37 Md€ + FRR 20,4 Md€ + PERCO+autres ~43 Md€ | mai 2026 |
| Nombre d'actifs | 23 millions (stable) | INSEE projections emploi 2025 | mai 2026 |
| Inflation | 2,0 %/an (non modélisée — euros constants) | Cible BCE | mai 2026 |
| Taux cotisation total retraite | 28 % du brut | DSS 2024 (CNAV 16,9 % + AGIRC-ARRCO 7,7 % + autres) | mai 2026 |
| Déficit COR 2025 | -5,0 Md€ | Rapport COR juin 2025 | juin 2025 |
| Déficit COR 2030 | -6,6 Md€ | Rapport COR juin 2025 | juin 2025 |
| Déficit COR 2070 | -45,0 Md€ | Rapport COR juin 2025 (scenario central ≈ -1,4 % PIB) | juin 2025 |
| FRR encours | 20,4 Md€ | FRR Rapport annuel 2024 | 2025 |
| Espérance de vie à 65 ans | H 20,2 / F 23,9 | INSEE tables 2024 | 2024 |
| Passif implicite retraites | 417 % PIB | Commission européenne Ageing Report 2024 | 2024 |

---

## 3. Méthodologie de calcul

### 3.1 Équation maîtresse (accumulation terme à terme)

L'encours capitalisé est calculé par boucle récursive annuelle :

```
Encours(t) = Encours(t-1) × (1 + r_net) + Flux_cotisations(t)
```

avec :
- `r_net` = rendement réel net de frais (4 % scénario central)
- `Flux_cotisations(t) = taux_capitalisation(t) × Masse_salariale(t)`
- `Masse_salariale(t) = 1 100 × (1 + 0,005)^(t-2027)` Md€ réels 2026
- Versements en FIN d'année (convention comptable standard)
- Tous les montants en euros CONSTANTS 2026

### 3.2 Validation croisée

La boucle récursive est comparée à la formule analytique d'annuité croissante (Brealey, Myers & Allen, 13ème éd.) :

```
FV = C₀ × [(1+r)^n - (1+g)^n] / (r - g)   si r ≠ g
```

Résultat : **écart = {ecart_validation:.6f} %** (seuil d'alerte : 0,01 %) — validation OK.

Vérification multiplicateur composé :
- (1,04)^25 = {multiplicateur_25:.4f} (attendu ≈ 2,6658)
- (1,04)^50 = {multiplicateur_50:.4f} (attendu ≈ 7,1067)

### 3.3 Trajectoires de cotisation par scénario

**Scénario A — Australien lent :**
Inspiration : Superannuation Guarantee (ATO) 1992-2025 (+0,27 pt/an pendant 33 ans).
France : montée linéaire 1 % → 6 % sur 25 ans (2027-2052), soit +0,20 pt/an.
Coût intégralement employeur. Coût État = 0.

**Scénario B — Suédois rapide (recyclage) :**
Inspiration : Réforme suédoise 1999 (PPM = 2,5 pts sur 18,5 pts existants).
France : recyclage constant de 2 pts des 28 % de cotisations existantes vers le pilier capitalisé.
Aucune hausse globale. Le pilier répartition perd 2 pts de cotisation → impact sur
les droits NDC (~légère baisse du taux de remplacement, non modélisée ici car hors périmètre).
Coût État = 0. Note : *aggravation du déficit COR de ~2 Md€/an à court terme* car les
cotisations répartition diminuent d'autant.

**Scénario C — Auto-enrolment NEST France :**
Inspiration : The Pensions Regulator UK — montée 2 % (oct. 2012) → 5 % (avr. 2018) → 8 % (avr. 2019).
France : montée 2 % (2028) → 8 % (2036) sur 8 ans (+0,75 pt/an), puis stabilisation.
Opt-out paramétrable (défaut 10 % — cohérent NEST UK historique 8-12 %).
Cotisation effective = taux nominal × (1 - opt_out).
Coût État : ~1,5 Md€/an de tax relief (modèle NEST UK : 1-2 Md£/an).

**Scénario D — Hybride Canada-Australie :**
Phase 1 (2027) : dotation initiale FRR ({FRR_DOTATION} Md€) + eurobonds retraite ({EUROBONDS_D} Md€).
Phase 2 (2028-2035) : cotisation paritaire +0,5 pt/an → 4 % en 2035.
  Inspiration : CPP Enhancement Canada 2019-2023 (+0,5 pt/an).
Phase 3 (2030-2040) : redéploiement +1 pt AGIRC-ARRCO (accord paritaire conditionnel).
Phase 4 (2040-2052) : stabilisation à 5 % total (4 % paritaire + 1 % AGIRC).
Coût État : ~1,5 Md€/an tax relief + ~2 Md€/an intérêts eurobonds = ~3,5 Md€/an.

### 3.4 Impact sur le déficit COR

Le déficit COR de référence est interpolé linéairement à partir des données du rapport COR 2025 :
- 2025 : -5,0 Md€ ; 2030 : -6,6 Md€ ; 2040 : -15,0 Md€ (interpolé) ; 2070 : -45,0 Md€.

Deux mécanismes correcteurs sont modélisés de façon simplifiée :
1. **Scénario B** : aggravation de -2 Md€/an (les cotisations répartition diminuent de 2 pts)
2. **À partir de 2045 (tous scénarios)** : les rentes capitalisées réduisent les besoins de
   répartition. Estimation : 30 % des rentes versées par le fonds capitalisé réduisent
   les besoins COR (30 % × 2 % d'encours × encours). Effet plafonné au déficit existant.

**Limite importante :** Ce modèle de l'impact sur le déficit COR est une approximation de
premier ordre. Une modélisation rigoureuse nécessiterait un modèle actuariel complet
(tables de mortalité générationnelles, comportements de liquidation, taux de remplacement
cible par scénario). Les chiffres ici sont des ordres de grandeur, non des projections précises.

---

## 4. Tableaux de résultats

### Tableau 1 — Trajectoire de cotisation vers le fonds capitalisé (% masse salariale)

| Année | Sc. A (Australien lent) | Sc. B (Suédois recyclage) | Sc. C (Auto-enrolment) | Sc. D (Hybride Canada-AU) |
|---|---|---|---|---|
| 2027 | {taux_str("A", 2027)} patronal | 2,00 % recyclé | 0,00 % (démarrage 2028) | 0,00 % (dotation seule) |
| 2028 | {taux_str("A", 2028)} | 2,00 % | {taux_str("C", 2028)} | {taux_str("D", 2028)} paritaire |
| 2030 | {taux_str("A", 2030)} | 2,00 % | {taux_str("C", 2030)} | {taux_str("D", 2030)} (dont 1 % AGIRC) |
| 2032 | {taux_str("A", 2032)} | 2,00 % | {taux_str("C", 2032)} | {taux_str("D", 2032)} |
| 2035 | {taux_str("A", 2035)} | 2,00 % | {taux_str("C", 2035)} | {taux_str("D", 2035)} |
| 2036 | {taux_str("A", 2036)} | 2,00 % | {taux_str("C", 2036)} (plafond 8 % brut, 7,2 % net opt-out 10 %) | {taux_str("D", 2036)} |
| 2040 | {taux_str("A", 2040)} | 2,00 % | {taux_str("C", 2040)} | {taux_str("D", 2040)} |
| 2045 | {taux_str("A", 2045)} | 2,00 % | {taux_str("C", 2045)} | {taux_str("D", 2045)} |
| 2052 | {taux_str("A", 2052)} (plafond) | 2,00 % | {taux_str("C", 2052)} | {taux_str("D", 2052)} (plafond) |
| 2077 | {taux_str("A", 2077)} | 2,00 % | {taux_str("C", 2077)} | {taux_str("D", 2077)} |

*Notes : Sc.A = cotisation patronale pure (coût employeur). Sc.B = recyclage des cotisations existantes (pas de hausse globale). Sc.C = cotisation paritaire avec opt-out 10 % (défaut NEST). Sc.D = paritaire + 1 % AGIRC-ARRCO à partir de 2030 ; dotation initiale FRR {FRR_DOTATION} Md€ + eurobonds {EUROBONDS_D} Md€ en 2027.*

---

### Tableau 2 — Encours capitalisé projeté (Md€ constants 2026, scénario central r = 4 % réel net)

| Année | Sc. A | Sc. B | Sc. C | Sc. D | PIB estimé (Md€) |
|---|---|---|---|---|---|
| 2027 | {get_enc("A",2027):,.0f} ({get_pib_pct("A",2027):.0f}% PIB) | {get_enc("B",2027):,.0f} ({get_pib_pct("B",2027):.0f}% PIB) | {get_enc("C",2027):,.0f} ({get_pib_pct("C",2027):.0f}% PIB) | {get_enc("D",2027):,.0f} ({get_pib_pct("D",2027):.0f}% PIB) | {pib(2027):,.0f} |
| 2032 | {get_enc("A",2032):,.0f} ({get_pib_pct("A",2032):.0f}% PIB) | {get_enc("B",2032):,.0f} ({get_pib_pct("B",2032):.0f}% PIB) | {get_enc("C",2032):,.0f} ({get_pib_pct("C",2032):.0f}% PIB) | {get_enc("D",2032):,.0f} ({get_pib_pct("D",2032):.0f}% PIB) | {pib(2032):,.0f} |
| 2037 | {get_enc("A",2037):,.0f} ({get_pib_pct("A",2037):.0f}% PIB) | {get_enc("B",2037):,.0f} ({get_pib_pct("B",2037):.0f}% PIB) | {get_enc("C",2037):,.0f} ({get_pib_pct("C",2037):.0f}% PIB) | {get_enc("D",2037):,.0f} ({get_pib_pct("D",2037):.0f}% PIB) | {pib(2037):,.0f} |
| 2042 | {get_enc("A",2042):,.0f} ({get_pib_pct("A",2042):.0f}% PIB) | {get_enc("B",2042):,.0f} ({get_pib_pct("B",2042):.0f}% PIB) | {get_enc("C",2042):,.0f} ({get_pib_pct("C",2042):.0f}% PIB) | {get_enc("D",2042):,.0f} ({get_pib_pct("D",2042):.0f}% PIB) | {pib(2042):,.0f} |
| 2047 | {get_enc("A",2047):,.0f} ({get_pib_pct("A",2047):.0f}% PIB) | {get_enc("B",2047):,.0f} ({get_pib_pct("B",2047):.0f}% PIB) | {get_enc("C",2047):,.0f} ({get_pib_pct("C",2047):.0f}% PIB) | {get_enc("D",2047):,.0f} ({get_pib_pct("D",2047):.0f}% PIB) | {pib(2047):,.0f} |
| **2052** | **{get_enc("A",2052):,.0f} ({get_pib_pct("A",2052):.0f}% PIB)** | **{get_enc("B",2052):,.0f} ({get_pib_pct("B",2052):.0f}% PIB)** | **{get_enc("C",2052):,.0f} ({get_pib_pct("C",2052):.0f}% PIB)** | **{get_enc("D",2052):,.0f} ({get_pib_pct("D",2052):.0f}% PIB)** | **{pib(2052):,.0f}** |
| 2077 | {get_enc("A",2077):,.0f} ({get_pib_pct("A",2077):.0f}% PIB) | {get_enc("B",2077):,.0f} ({get_pib_pct("B",2077):.0f}% PIB) | {get_enc("C",2077):,.0f} ({get_pib_pct("C",2077):.0f}% PIB) | {get_enc("D",2077):,.0f} ({get_pib_pct("D",2077):.0f}% PIB) | {pib(2077):,.0f} |

*Note : l'encours initial commun 2026 est de 200 Md€ (PER + ERAFP + FRR + PERCO). Le scénario D inclut en plus la dotation FRR {FRR_DOTATION} Md€ + eurobonds {EUROBONDS_D} Md€ versés en 2027, soit {FRR_DOTATION + EUROBONDS_D:.0f} Md€ de dotation initiale supplémentaire. Tous les montants en euros constants 2026 (réels).*

---

### Tableau 3 — Coût budgétaire annuel pour l'État (Md€)

| Poste | Sc. A | Sc. B | Sc. C | Sc. D |
|---|---|---|---|---|
| Coût de la cotisation (État) | 0 | 0 | 0 | 0 |
| Tax relief / incitations fiscales | 0 | 0 | ~1,5 Md€/an | ~1,5 Md€/an |
| Charge intérêts eurobonds | 0 | 0 | 0 | ~{cout_D_eurobonds:.1f} Md€/an |
| Perte cotisations sociales (Sc.B) | 0 | ~0 (recyclage, pas de perte nette) | 0 | 0 |
| **Coût budgétaire total estimé** | **0** | **0** | **~1,5 Md€/an** | **~{1.5 + cout_D_eurobonds:.1f} Md€/an** |
| Coût cumulé 2027-2052 | 0 | 0 | ~37 Md€ | ~{(1.5 + cout_D_eurobonds) * 25:.0f} Md€ |

*Sources : ATO SG 1992-2025 (Sc.A : coût intégralement employeur, zéro pour l'État) ;
DWP UK *Ten Years of Auto-Enrolment* 2022 (tax relief NEST 1-2 Md£/an) ; CPP Canada
*CRA Historical Contribution Rates* (coût État zéro) ; eurobonds : taux souverain France
2026 ~4 % sur 50 Md€ = 2 Md€/an d'intérêts.*

*Note méthodologique : Le scénario B (recyclage) ne génère pas de coût budgétaire
direct pour l'État, mais implique une légère aggravation du déficit COR à court terme
(-2 Md€/an environ) du fait de la réduction des cotisations répartition.*

---

### Tableau 4 — Impact sur le déficit COR projeté (Md€, négatif = déficit)

| Année | Référence (statu quo) | Sc. A | Sc. B | Sc. C | Sc. D |
|---|---|---|---|---|---|
| 2027 | {deficit_cor_interpole(2027):.1f} | {get_deficit("A",2027):.1f} | {get_deficit("B",2027):.1f} | {get_deficit("C",2027):.1f} | {get_deficit("D",2027):.1f} |
| 2030 | {deficit_cor_interpole(2030):.1f} | {get_deficit("A",2030):.1f} | {get_deficit("B",2030):.1f} | {get_deficit("C",2030):.1f} | {get_deficit("D",2030):.1f} |
| 2040 | {deficit_cor_interpole(2040):.1f} | {get_deficit("A",2040):.1f} | {get_deficit("B",2040):.1f} | {get_deficit("C",2040):.1f} | {get_deficit("D",2040):.1f} |
| 2050 | {deficit_cor_interpole(2050):.1f} | {get_deficit("A",2050):.1f} | {get_deficit("B",2050):.1f} | {get_deficit("C",2050):.1f} | {get_deficit("D",2050):.1f} |
| 2052 | {deficit_cor_interpole(2052):.1f} | {get_deficit("A",2052):.1f} | {get_deficit("B",2052):.1f} | {get_deficit("C",2052):.1f} | {get_deficit("D",2052):.1f} |
| 2070 | {deficit_cor_interpole(2070):.1f} | {get_deficit("A",2070):.1f} | {get_deficit("B",2070):.1f} | {get_deficit("C",2070):.1f} | {get_deficit("D",2070):.1f} |

*Interprétation : les effets sur le déficit COR sont faibles avant 2045 (les rentes capitalisées
ne sont pas encore versées à grande échelle). L'effet favorable devient sensible après 2045,
quand les premières cohortes ayant cotisé 20+ ans commencent à liquider leur capital.
À 2052-2070, les scénarios A, C, D réduisent le déficit de 5 à 15 Md€/an selon le rendement.*

*Avertissement : cette modélisation de l'impact COR est une approximation de premier ordre.
Elle ne remplace pas une projection actuarielle complète avec tables de mortalité générationnelles
et modélisation des comportements de liquidation.*

---

### Tableau 5 — Synthèse comparative 2052 (scénario central, 4 % réel net)

| | Sc. A | Sc. B | Sc. C | Sc. D |
|---|---|---|---|---|
| **Modèle de référence** | Australie SG | Suède NDC/PPM | Royaume-Uni NEST | Canada CPP + Australie |
| **Cotisation finale 2052** | {taux_str("A",2052)} masse sal. | 2,00 % recyclé | {taux_str("C",2052)} (net opt-out) | {taux_str("D",2052)} paritaire+AGIRC |
| **Flux annuel 2052 (Md€/an)** | {get_flux("A",2052):,.0f} | {get_flux("B",2052):,.0f} | {get_flux("C",2052):,.0f} | {get_flux("D",2052):,.0f} |
| **Encours 2052 (Md€)** | {get_enc("A",2052):,.0f} | {get_enc("B",2052):,.0f} | {get_enc("C",2052):,.0f} | {get_enc("D",2052):,.0f} |
| **Encours 2052 (% PIB)** | {get_pib_pct("A",2052):.0f} % | {get_pib_pct("B",2052):.0f} % | {get_pib_pct("C",2052):.0f} % | {get_pib_pct("D",2052):.0f} % |
| **Capital moyen/actif 2052** | {get_cap_actif("A",2052):,.0f} k€ | {get_cap_actif("B",2052):,.0f} k€ | {get_cap_actif("C",2052):,.0f} k€ | {get_cap_actif("D",2052):,.0f} k€ |
| **Cotis. cumulées 2027-2052 (Md€)** | {get_cotis_cum("A",2052):,.0f} | {get_cotis_cum("B",2052):,.0f} | {get_cotis_cum("C",2052):,.0f} | {get_cotis_cum("D",2052):,.0f} |
| **Effet rendement composé** | {get_enc("A",2052)/max(get_cotis_cum("A",2052),1):.2f}x | {get_enc("B",2052)/max(get_cotis_cum("B",2052),1):.2f}x | {get_enc("C",2052)/max(get_cotis_cum("C",2052),1):.2f}x | {get_enc("D",2052)/max(get_cotis_cum("D",2052),1):.2f}x |
| **Encours 2077 (Md€)** | {get_enc("A",2077):,.0f} | {get_enc("B",2077):,.0f} | {get_enc("C",2077):,.0f} | {get_enc("D",2077):,.0f} |
| **Coût budgétaire État** | 0 | 0 | ~1,5 Md€/an | ~{1.5 + cout_D_eurobonds:.1f} Md€/an |
| **Accessibilité politique** | ★★★ | ★ | ★★ | ★★ |
| **Atteint la cible 1 500 Md€ ?** | {"Oui" if get_enc("A",2052) >= 1500 else "Non"} | {"Oui" if get_enc("B",2052) >= 1500 else "Non"} | {"Oui" if get_enc("C",2052) >= 1500 else "Non"} | {"Oui" if get_enc("D",2052) >= 1500 else "Non"} |

*La cible de 1 500 Md€ (50 % du PIB estimé 2052) est celle posée au Chapitre 3,
cohérente avec la moyenne Canada (~25 % PIB à mi-parcours de leur transition)
et l'objectif de longue terme vers 100 % PIB (moyenne pondérée OCDE Thinking Ahead Institute 2025).*

---

## 5. Analyse de sensibilité

### 5.1 Sensibilité au rendement réel net (scénario D)

| Rendement réel net | Encours 2052 (Md€) | Encours 2077 (Md€) | Ratio /PIB 2052 |
|---|---|---|---|
| 3 % (pessimiste) | {enc_D_3:,.0f} | {df_sensi[(df_sensi["scenario"]=="D") & (df_sensi["parametre_varie"]=="rendement_reel_net") & (df_sensi["valeur"].round(2)==0.03)]["encours_2077_Mde"].values[0]:,.0f} | {df_sensi[(df_sensi["scenario"]=="D") & (df_sensi["parametre_varie"]=="rendement_reel_net") & (df_sensi["valeur"].round(2)==0.03)]["encours_pct_pib_2052"].values[0]:.0f} % |
| **4 % (central)** | **{enc_D_2052:,.0f}** | **{enc_D_2077:,.0f}** | **{get_pib_pct("D",2052):.0f} %** |
| 5 % (optimiste) | {enc_D_5:,.0f} | {df_sensi[(df_sensi["scenario"]=="D") & (df_sensi["parametre_varie"]=="rendement_reel_net") & (df_sensi["valeur"].round(2)==0.05)]["encours_2077_Mde"].values[0]:,.0f} | {df_sensi[(df_sensi["scenario"]=="D") & (df_sensi["parametre_varie"]=="rendement_reel_net") & (df_sensi["valeur"].round(2)==0.05)]["encours_pct_pib_2052"].values[0]:.0f} % |

### 5.2 Sensibilité à la croissance salariale réelle (scénario D)

| Croissance salariale réelle | Encours 2052 (Md€) | Masse sal. 2052 (Md€) |
|---|---|---|
| 0 % (stagnation) | {df_sensi[(df_sensi["scenario"]=="D") & (df_sensi["parametre_varie"]=="croissance_salariale") & (df_sensi["valeur"]==0.00)]["encours_2052_Mde"].values[0]:,.0f} | {1_100 * (1.00)**25:,.0f} |
| **0,5 % (central)** | **{enc_D_2052:,.0f}** | **{masse_salariale(2052):,.0f}** |
| 1,0 % (optimiste) | {df_sensi[(df_sensi["scenario"]=="D") & (df_sensi["parametre_varie"]=="croissance_salariale") & (df_sensi["valeur"]==0.01)]["encours_2052_Mde"].values[0]:,.0f} | {1_100 * (1.01)**25:,.0f} |

### 5.3 Sensibilité au taux d'opt-out (scénario C uniquement)

| Taux d'opt-out | Encours 2052 (Md€) | Capital/actif 2052 (k€) |
|---|---|---|
| 5 % (optimiste — quasi-universelle) | {df_sensi[(df_sensi["scenario"]=="C") & (df_sensi["parametre_varie"]=="opt_out") & (df_sensi["valeur"]==0.05)]["encours_2052_Mde"].values[0]:,.0f} | {df_sensi[(df_sensi["scenario"]=="C") & (df_sensi["parametre_varie"]=="opt_out") & (df_sensi["valeur"]==0.05)]["capital_par_actif_2052_ke"].values[0]:,.0f} |
| **10 % (central — NEST UK historique)** | **{df_sensi[(df_sensi["scenario"]=="C") & (df_sensi["parametre_varie"]=="opt_out") & (df_sensi["valeur"]==0.10)]["encours_2052_Mde"].values[0]:,.0f}** | **{df_sensi[(df_sensi["scenario"]=="C") & (df_sensi["parametre_varie"]=="opt_out") & (df_sensi["valeur"]==0.10)]["capital_par_actif_2052_ke"].values[0]:,.0f}** |
| 20 % (pessimiste) | {df_sensi[(df_sensi["scenario"]=="C") & (df_sensi["parametre_varie"]=="opt_out") & (df_sensi["valeur"]==0.20)]["encours_2052_Mde"].values[0]:,.0f} | {df_sensi[(df_sensi["scenario"]=="C") & (df_sensi["parametre_varie"]=="opt_out") & (df_sensi["valeur"]==0.20)]["capital_par_actif_2052_ke"].values[0]:,.0f} |

*Source opt-out historique : DWP UK *Ten Years of Auto-Enrolment in Workplace Pensions*, 2022.
Taux d'opt-out observé 2012-2022 : 8 à 12 %, jamais au-delà de 25 %.*

---

## 6. Vérifications croisées avec données empiriques

### 6.1 Australie (32 ans de Superannuation Guarantee — référence principale)

| Indicateur | Données réelles 2025 | Modèle France Sc.A 2052 (25 ans) |
|---|---|---|
| Encours/PIB | ~160 % (4 300 Md AUD / 2 700 Md AUD) | {get_pib_pct("A",2052):.0f} % |
| Taux cotisation atteint | 12 % du salaire brut | 6 % de la masse sal. |
| Durée depuis lancement | 33 ans (1992-2025) | 25 ans (2027-2052) |
| Couverture salariés | 93 % | n.d. |

*Cohérence : La France vise 6 % en 25 ans vs l'Australie à 12 % en 33 ans → encours/PIB
moindre attendu, conformément au résultat du modèle (~{get_pib_pct("A",2052):.0f} % vs ~160 %).*

### 6.2 Suède AP-fonds + PPM (25 ans de NDC — référence Scénario B)

| Indicateur | Données réelles 2024 | Modèle France Sc.B 2052 (25 ans) |
|---|---|---|
| AP-fonds total / PIB | ~30 % (2 100 Md SEK / 7 000 Md SEK) | (hors périmètre — fonds de lissage) |
| PPM capitalisation individuelle / PIB | ~29 % (~2 000 Md SEK / 7 000 Md SEK) | ~{get_pib_pct("B",2052):.0f} % |
| Taux PPM | 2,5 pts sur 18,5 % total | 2,0 pts sur 28 % total |

*Cohérence : Le scénario B est légèrement moins ambitieux que la Suède (2 pts vs 2,5 pts PPM),
sur une durée comparable. L'encours modélisé ({get_enc("B",2052):,.0f} Md€, ~{get_pib_pct("B",2052):.0f} % PIB)
est cohérent avec la trajectoire PPM suédoise à 25 ans.*

### 6.3 Canada CPPIB (28 ans — référence Scénario D)

| Indicateur | Données réelles 2025 | Scénario D 2052 |
|---|---|---|
| Actifs CPPIB / PIB Canada | ~25 % (714 Md CAD / 2 900 Md CAD) | {get_pib_pct("D",2052):.0f} % PIB France |
| Rendement annualisé 10 ans | ~7,7 % nominal ≈ 5,7 % réel | 4 % réel (hypothèse prudente) |
| Cotisation totale atteinte | 9,9 % (partagée 4,95/4,95) | 5 % (4 % paritaire + 1 % AGIRC) |

*Note : CPPIB ne couvre qu'environ 30-40 % du remplacement canadien — le scénario D vise
un pilier complémentaire comparable, d'où un ratio /PIB plus élevé que le Canada seul.*

---

## 7. Limites du modèle

1. **Comportements non modélisés** : substitution épargne privée / épargne obligatoire
   (si la capitalisation obligatoire se substitue à l'épargne volontaire PER, l'encours net
   n'augmente pas d'autant) ; comportements de liquidation anticipée ; mobilité internationale.

2. **Fiscalité non modélisée** : exonérations de cotisations, CSG sur les rentes, imposition
   des sorties en capital. Le tax expenditure réel est sous-estimé dans le Tableau 3.

3. **Chocs et discontinuités** : crises financières (2008 : -40 % actions), changements
   politiques (pause australienne 2014-2021), hausse des taux d'intérêt. Le modèle est
   déterministe — il ne simule pas de Monte Carlo sur les rendements.

4. **Dynamique du marché du travail** : l'hypothèse de 23 millions d'actifs stables masque
   les effets de la démographie (baisse tendancielle projetée par l'INSEE à partir de 2035-2040).

5. **Incidence salariale non modélisée** : le modèle ne simule pas l'accord de modération
   salariale qui, dans les modèles australien et canadien, fait supporter le coût par les
   salariés (salaire immédiat réduit d'autant). En France, l'absence d'accord équivalent
   ferait peser le coût sur les employeurs, avec impact potentiel sur l'emploi.

6. **Inflation non modélisée** : tous les montants sont en euros constants 2026. L'inflation
   2 %/an gonflerait les montants nominaux d'un facteur (1,02)^25 ≈ 1,64 à 25 ans.

7. **Consolidation des fonds** : la modélisation suppose un fonds unique (FFC). En réalité,
   une multiplicité de fonds (AGIRC-ARRCO, PER, sectoriels) fragmenterait les économies
   d'échelle et augmenterait les frais au-delà des 0,3 %/an hypothésés.

8. **Impact COR à long terme** : la modélisation de l'impact sur le déficit COR après 2045
   est une approximation de premier ordre. Une projection actuarielle complète avec tables
   de mortalité générationnelles et modélisation des comportements de liquidation est nécessaire
   pour affiner ces chiffres.

---

## 8. Récapitulatif pour le rédacteur du Chapitre 5

**Scénario D central (hybride Canada-Australie, r = 4 % réel net) :**
- Encours 2052 : **{get_enc("D",2052):,.0f} Md€** (~{get_pib_pct("D",2052):.0f} % du PIB estimé 2052)
- Encours 2077 : **{get_enc("D",2077):,.0f} Md€** (~{get_pib_pct("D",2077):.0f} % du PIB estimé 2077)
- Capital moyen par actif en 2052 : **{get_cap_actif("D",2052):,.0f} k€/actif**
- Flux de cotisations en 2052 : **{get_flux("D",2052):,.0f} Md€/an**
- Cotisations cumulées 2027-2052 : **{get_cotis_cum("D",2052):,.0f} Md€**
- Effet multiplicateur du rendement composé : **{get_enc("D",2052)/max(get_cotis_cum("D",2052),1):.2f}x les cotisations versées**

**Fourchette scénario D à 2052 :**
- Pessimiste (3 % réel net) : {enc_D_3:,.0f} Md€
- Central (4 % réel net) : {enc_D_2052:,.0f} Md€
- Optimiste (5 % réel net) : {enc_D_5:,.0f} Md€

**Validation croisée :**
- Écart formule FV vs boucle récursive : {ecart_validation:.6f} % (seuil 0,01 % — OK)
- Cohérence Australie, Suède, Canada : confirmée (voir section 6)

---

*Rapport généré automatiquement par `ch5_modelisation.py` — Mai 2026*
*Reproductible : exécuter `python ch5_modelisation.py` dans le dossier `modelisation/`*
"""

with open(RAPPORT_MD, "w", encoding="utf-8") as f:
    f.write(rapport)
print(f"\n→ Rapport méthodologique exporté : {RAPPORT_MD}")


# ─────────────────────────────────────────────────────────────────────────────
#  12. RÉCAPITULATIF CONSOLE FINAL
# ─────────────────────────────────────────────────────────────────────────────

print("\n" + "=" * 70)
print("RÉCAPITULATIF FINAL")
print("=" * 70)
print(f"\nScénario D central (hybride, 4 % réel net) :")
print(f"  Encours 2052 : {enc_D_2052:,.0f} Md€  (~{get_pib_pct('D',2052):.0f} % PIB)")
print(f"  Encours 2077 : {enc_D_2077:,.0f} Md€  (~{get_pib_pct('D',2077):.0f} % PIB)")
print(f"  Fourchette 2052 (3-5 %) : {enc_D_3:,.0f} — {enc_D_5:,.0f} Md€")
print(f"\nValidation croisée FV vs boucle récursive : {ecart_validation:.6f} %")
print()
print("Fichiers produits :")
print(f"  {CSV_RESULTATS}")
print(f"  {CSV_SENSIBILITE}")
print(f"  {PNG_COURBES}")
print(f"  {RAPPORT_MD}")
print("=" * 70)
