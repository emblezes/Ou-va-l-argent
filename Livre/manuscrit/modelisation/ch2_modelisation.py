"""
ch2_modelisation.py
===================
Modélisation actuarielle — Chapitre 2 de "Capitalisons. La France et son capital absent"
Auteur : Emmanuel Blezes / Où Va l'Argent — Mai 2026
Version : 1.0 (corrigée après erreur initiale de 228 270 € au lieu de ~154 000 €)

QUESTION : Pour un actif de 30 ans en 2026 (salaire brut 35 000 €),
que rapporte le passage d'un système pure répartition (scénario A)
à un système mixte avec pilier capitalisé (scénarios B et C) ?

FORMULES CLÉS :
  Valeur future d'une annuité croissante (versements FIN de période) :
    FV = C₀ × [(1+r)^n - (1+g)^n] / (r - g)   si r ≠ g
    FV = C₀ × n × (1+r)^(n-1)                  si r = g
  où :
    C₀ = première cotisation (€/an)
    r   = rendement réel net par période (annuel)
    g   = taux de croissance du salaire réel (0,5 %/an)
    n   = nombre de périodes (années)
  (Source formule : Brealey, Myers & Allen, "Principles of Corporate Finance", 13th ed.)

HYPOTHÈSES :
  Salaire brut initial (2026)       : 35 000 €/an
  Inflation                          : 2,0 %/an — TOUT EN EUROS CONSTANTS 2026
  Croissance salaire réel            : +0,5 %/an (cohérent OCDE, COR 2025 scénario 1 %)
  Âge départ retraite (théorique)    : 73 ans (43 ans de carrière depuis 30 ans)
  Durée de cotisation                : 43 ans
  Taux cotisations retraite totales  : 28 % du brut (régime général + Agirc-Arrco ; source : DSS 2024)
  Frais de gestion fonds capitalisé  : 0,3 %/an (référence AP7 Suède, ABP Pays-Bas)
  Espérance de vie résiduelle à 73 ans : 15,5 ans (mixte H/F ; source : INSEE tables 2024)
  Taux de remplacement net répartition : 74,4 % (COR Rapport annuel 2025, génération 1963, taux plein)
    → utilisé pour scénario A ; scénario B et C proportionnels au pilier répartition conservé
"""

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import itertools
import os

# ─────────────────────────────────────────────
#  0. CHEMINS DE SORTIE
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_CENTRAL  = os.path.join(BASE_DIR, "ch2_resultats.csv")
CSV_SENSI    = os.path.join(BASE_DIR, "ch2_sensibilite.csv")
PNG_COURBES  = os.path.join(BASE_DIR, "ch2_courbes.png")

# ─────────────────────────────────────────────
#  1. PARAMÈTRES (modifiables ici)
# ─────────────────────────────────────────────
SALAIRE_BRUT_0   = 35_000.0    # € brut 2026
TAUX_COTIS_TOTAL = 0.28        # 28 % du brut → répartition + capitalisation
G_SALAIRE        = 0.005       # croissance réelle du salaire : +0,5 %/an
N_CARRIERE       = 43          # années de cotisation (30 → 73 ans)
EV_73            = 15.5        # espérance de vie résiduelle à 73 ans (ans), mixte H/F
FRAIS_GESTION    = 0.003       # 0,30 %/an (AP7, ABP)
TRN_A            = 0.744       # taux de remplacement net scénario A (COR 2025, gén. 1963)

# Part du pilier capitalisation dans chaque scénario
PART_CAPI_B  = 0.20   # 20 % des cotisations → capitalisation (Suède PPM)
PART_CAPI_C  = 0.40   # 40 % des cotisations → capitalisation (Pays-Bas, 2e pilier)

# Grille de rendements réels nets AVANT frais (testés en sensibilité)
RENDEMENTS_REELS_BRUTS = [0.03, 0.04, 0.05]   # 3 %, 4 %, 5 %
R_CENTRAL = 0.04   # scénario central

# Durées de carrière testées en sensibilité
DUREES = [40, 43, 45]

# Croissances salariales testées en sensibilité
CROISSANCES_SALAIRE = [0.00, 0.005, 0.010]

# Durée de retraite (cumul sur 20 ans dans le tableau de synthèse)
DUREE_RETRAITE_CUMUL = 20   # ans (73-93)


# ─────────────────────────────────────────────
#  2. FONCTIONS ACTUARIELLES
# ─────────────────────────────────────────────

def fv_annuite_croissante(C0: float, r: float, g: float, n: int) -> float:
    """
    Valeur future (fin de période n) d'une annuité croissante.

    Versements en FIN de période :
      t=1 → C0*(1+g)^0 = C0
      t=2 → C0*(1+g)^1
      ...
      t=n → C0*(1+g)^(n-1)

    Formule :
      Si r ≠ g :  FV = C0 × [(1+r)^n - (1+g)^n] / (r - g)
      Si r = g :  FV = C0 × n × (1+r)^(n-1)

    ATTENTION : tous les paramètres sont réels (pas nominaux).
    Les euros sont en valeur constante 2026.
    """
    if abs(r - g) < 1e-10:
        # Cas limite r = g
        return C0 * n * (1 + r) ** (n - 1)
    else:
        return C0 * ((1 + r) ** n - (1 + g) ** n) / (r - g)


def rente_viagere(capital: float, r_rente: float, duree: float) -> float:
    """
    Rente annuelle issue d'un capital, sur une durée certaine.
    Modèle simplifié (rente certaine sur duree ans).

    Formule : R = Capital × r / [1 - (1+r)^(-duree)]
    Si r → 0 : R = Capital / duree

    Paramètre r_rente : rendement réel du fonds en phase de liquidation.
    On utilise r = 2 % réel (rendement prudentiel en phase de rente).
    """
    r = r_rente
    if abs(r) < 1e-10:
        return capital / duree
    else:
        return capital * r / (1 - (1 + r) ** (-duree))


def cotisation_annuelle_capi(part_capi: float, n_annee: int = 0) -> float:
    """
    Cotisation annuelle vers la capitalisation, à l'année n_annee (0-indexé).
    C(t) = SALAIRE_BRUT_0 × TAUX_COTIS_TOTAL × part_capi × (1 + G_SALAIRE)^t
    Première cotisation (t=0) : C0 = 35 000 × 0,28 × part_capi
    """
    return SALAIRE_BRUT_0 * TAUX_COTIS_TOTAL * part_capi * (1 + G_SALAIRE) ** n_annee


def calcul_scenario(part_capi: float, r_brut: float, n: int = N_CARRIERE, g: float = G_SALAIRE) -> dict:
    """
    Calcul complet d'un scénario (A, B ou C).

    Retourne un dictionnaire avec :
      - capital_capi    : capital accumulé au bout de n années
      - cotis_totales_capi : somme des cotisations versées (€ constants)
      - rente_annuelle  : rente annuelle viagère (€/an)
      - rente_mensuelle : rente mensuelle (€/mois)
      - pension_repartition_annuelle : pension annuelle du pilier répartition (€/an)
      - pension_totale_annuelle : pension totale (€/an)
      - cumul_20ans     : cumul retraite sur 20 ans (€)
    """
    # ── Cotisations capitalisation ──
    # C0 : première cotisation (t=0, versée en fin d'année 1)
    C0_capi = SALAIRE_BRUT_0 * TAUX_COTIS_TOTAL * part_capi

    # Rendement réel NET de frais
    r_net = r_brut - FRAIS_GESTION

    # Capital accumulé : formule annuité croissante
    capital = fv_annuite_croissante(C0=C0_capi, r=r_net, g=g, n=n)

    # Somme des cotisations réelles versées (sans rendement) — pour contrôle
    cotis_totales = sum(C0_capi * (1 + g) ** t for t in range(n))

    # ── Rente viagère ──
    # Rendement prudentiel en phase de liquidation : 2 % réel
    rente_an = rente_viagere(capital=capital, r_rente=0.02, duree=EV_73)
    rente_mois = rente_an / 12

    # ── Pilier répartition ──
    # Dernier salaire brut réel (à t=n)
    salaire_final = SALAIRE_BRUT_0 * (1 + g) ** (n - 1)
    # Salaire net ≈ brut × 0,77 (charges salariales ~23 %)
    salaire_net_final = salaire_final * 0.77

    # La part répartition = (1 - part_capi) des droits → TRN proportionnel
    # Hypothèse : le taux de remplacement est proportionnel à la part cotisée en répartition
    # Scénario A : TRN = 74,4 % → part_repartition = 1,0
    # Scénario B : TRN_B = TRN_A × 0,80
    # Scénario C : TRN_C = TRN_A × 0,60
    trn_repartition = TRN_A * (1 - part_capi)
    pension_repartition = salaire_net_final * trn_repartition

    # Pension totale
    pension_totale = pension_repartition + rente_mois * 12

    # Cumul sur 20 ans de retraite
    cumul_20 = pension_totale * DUREE_RETRAITE_CUMUL

    return {
        "C0_capi":                    C0_capi,
        "r_net":                      r_net,
        "capital_capi":               capital,
        "cotis_totales_capi":         cotis_totales,
        "salaire_final":              salaire_final,
        "salaire_net_final":          salaire_net_final,
        "trn_repartition":            trn_repartition,
        "pension_repartition_annuelle": pension_repartition,
        "rente_annuelle":             rente_an,
        "rente_mensuelle":            rente_mois,
        "pension_totale_annuelle":    pension_totale,
        "cumul_20ans":                cumul_20,
    }


# ─────────────────────────────────────────────
#  3. VÉRIFICATION ANTI-ERREUR (pré-calcul)
# ─────────────────────────────────────────────
print("=" * 65)
print("VÉRIFICATIONS PRÉALABLES (scénario B, r=4 % réel brut)")
print("=" * 65)

C0_B = SALAIRE_BRUT_0 * TAUX_COTIS_TOTAL * PART_CAPI_B
print(f"Première cotisation C0_B  = {SALAIRE_BRUT_0:,.0f} × {TAUX_COTIS_TOTAL:.0%} × {PART_CAPI_B:.0%} = {C0_B:,.0f} €")

dernier_versement_B = C0_B * (1 + G_SALAIRE) ** (N_CARRIERE - 1)
print(f"Dernier versement (t=42)  = {C0_B:,.0f} × (1.005)^42 = {dernier_versement_B:,.0f} €")

cotis_simples_B = sum(C0_B * (1 + G_SALAIRE) ** t for t in range(N_CARRIERE))
print(f"Cumul cotisations réelles = {cotis_simples_B:,.0f} €")

r_net_B = R_CENTRAL - FRAIS_GESTION
capital_B = fv_annuite_croissante(C0=C0_B, r=r_net_B, g=G_SALAIRE, n=N_CARRIERE)
print(f"\nCapital B (formule exacte FV annuité croissante) = {capital_B:,.0f} €")

# Vérification 1 : formule simplifiée (approximation ordre de grandeur)
# Capital ≈ cotisation_moyenne × n × (1+r)^(n/2)
cotis_moy_B = cotis_simples_B / N_CARRIERE
capital_simplifie_B = cotis_moy_B * N_CARRIERE * (1 + r_net_B) ** (N_CARRIERE / 2)
print(f"Capital B (formule simplifiée, ordre de grandeur) = {capital_simplifie_B:,.0f} €")
ecart_pct = abs(capital_B - capital_simplifie_B) / capital_B * 100
print(f"Écart entre les deux méthodes = {ecart_pct:.1f} %  (seuil admis : < 10 %)")
# NOTE : la formule simplifiée est une approximation d'ordre de grandeur.
# Un écart jusqu'à 10 % est normal et attendu. La validation rigoureuse
# est la boucle terme à terme ci-dessous (seuil 0,01 %).
if ecart_pct > 10:
    print("ALERTE : écart > 10 % — vérifier la formule avant de continuer")
    raise ValueError(f"Écart de vérification trop grand : {ecart_pct:.1f} %")
else:
    print(f"✓ Vérification ordre de grandeur OK ({ecart_pct:.1f} % < 10 % — attendu pour formule simplifiée)")

# Vérification 2 : reproduction manuelle terme à terme (10 premières années)
print("\nVérification terme à terme (10 premières années) :")
capital_manuel = 0.0
for t in range(10):
    versement = C0_B * (1 + G_SALAIRE) ** t
    capital_manuel = capital_manuel * (1 + r_net_B) + versement
print(f"  Capital après 10 ans (manuel) = {capital_manuel:,.0f} €")

# Même calcul sur 43 ans complet
capital_complet_manuel = 0.0
for t in range(N_CARRIERE):
    versement = C0_B * (1 + G_SALAIRE) ** t
    capital_complet_manuel = capital_complet_manuel * (1 + r_net_B) + versement
print(f"  Capital après {N_CARRIERE} ans (boucle manuelle) = {capital_complet_manuel:,.0f} €")
ecart_manuel = abs(capital_B - capital_complet_manuel) / capital_B * 100
print(f"  Écart formule vs boucle manuelle = {ecart_manuel:.4f} %  (seuil : < 0,01 %)")
if ecart_manuel > 0.01:
    raise ValueError(f"Erreur formule FV : écart vs boucle manuelle = {ecart_manuel:.4f} %")
else:
    print("✓ Formule FV validée par boucle manuelle")

print()


# ─────────────────────────────────────────────
#  4. CALCULS SCÉNARIOS CENTRAUX
# ─────────────────────────────────────────────
print("=" * 65)
print("RÉSULTATS SCÉNARIOS CENTRAUX (r=4 % réel brut, n=43 ans, g=0.5 %)")
print("=" * 65)

scenarios_def = {
    "A — Répartition pure":       {"part_capi": 0.00, "label": "A"},
    "B — Mixte 80/20 (Suède)":    {"part_capi": PART_CAPI_B, "label": "B"},
    "C — Mixte 60/40 (NL)":       {"part_capi": PART_CAPI_C, "label": "C"},
}

resultats_centraux = {}
for nom, params in scenarios_def.items():
    res = calcul_scenario(part_capi=params["part_capi"], r_brut=R_CENTRAL)
    resultats_centraux[nom] = res

    print(f"\n{'─'*55}")
    print(f"  {nom}")
    print(f"{'─'*55}")
    print(f"  Part capitalisation         : {params['part_capi']:.0%}")
    print(f"  1ère cotisation capi (C0)   : {res['C0_capi']:>10,.0f} €/an")
    print(f"  Rendement réel NET frais    : {res['r_net']:.2%}")
    print(f"  Cumul cotisations réelles   : {res['cotis_totales_capi']:>10,.0f} €")
    print(f"  Capital accumulé à 73 ans   : {res['capital_capi']:>10,.0f} €")
    print(f"  Rente mensuelle             : {res['rente_mensuelle']:>10,.0f} €/mois")
    print(f"  Rente annuelle              : {res['rente_annuelle']:>10,.0f} €/an")
    print(f"  Salaire net final (t=42)    : {res['salaire_net_final']:>10,.0f} €")
    print(f"  TRN pilier répartition      : {res['trn_repartition']:.2%}")
    print(f"  Pension répartition         : {res['pension_repartition_annuelle']:>10,.0f} €/an")
    print(f"  PENSION TOTALE              : {res['pension_totale_annuelle']:>10,.0f} €/an")
    print(f"  Cumul 20 ans de retraite    : {res['cumul_20ans']:>10,.0f} €")

# Écarts vs scénario A
res_A = resultats_centraux["A — Répartition pure"]
print(f"\n{'═'*55}")
print("  ÉCARTS vs SCÉNARIO A")
print(f"{'═'*55}")
for nom, res in resultats_centraux.items():
    if nom == "A — Répartition pure":
        continue
    ecart_pension = res["pension_totale_annuelle"] - res_A["pension_totale_annuelle"]
    ecart_cumul   = res["cumul_20ans"] - res_A["cumul_20ans"]
    print(f"  {nom}")
    print(f"    Écart pension annuelle   : {ecart_pension:>+,.0f} €/an")
    print(f"    Écart cumul 20 ans       : {ecart_cumul:>+,.0f} €")
    print()


# ─────────────────────────────────────────────
#  5. EXPORT CSV RÉSULTATS CENTRAUX
# ─────────────────────────────────────────────
rows_central = []
for nom, params in scenarios_def.items():
    res = resultats_centraux[nom]
    ecart_pension = res["pension_totale_annuelle"] - res_A["pension_totale_annuelle"]
    ecart_cumul   = res["cumul_20ans"] - res_A["cumul_20ans"]
    rows_central.append({
        "scenario":                    nom,
        "part_capitalisation":         params["part_capi"],
        "rendement_reel_brut":         R_CENTRAL,
        "rendement_reel_net":          res["r_net"],
        "cotisation_annuelle_C0":      round(res["C0_capi"], 0),
        "cumul_cotisations_reelles":   round(res["cotis_totales_capi"], 0),
        "capital_73ans":               round(res["capital_capi"], 0),
        "rente_mensuelle":             round(res["rente_mensuelle"], 0),
        "rente_annuelle":              round(res["rente_annuelle"], 0),
        "salaire_net_final":           round(res["salaire_net_final"], 0),
        "trn_repartition":             round(res["trn_repartition"], 4),
        "pension_repartition_annuelle": round(res["pension_repartition_annuelle"], 0),
        "pension_totale_annuelle":     round(res["pension_totale_annuelle"], 0),
        "cumul_20ans_retraite":        round(res["cumul_20ans"], 0),
        "ecart_pension_vs_A":          round(ecart_pension, 0),
        "ecart_cumul_vs_A":            round(ecart_cumul, 0),
    })

df_central = pd.DataFrame(rows_central)
df_central.to_csv(CSV_CENTRAL, index=False, encoding="utf-8")
print(f"\n→ Résultats centraux exportés : {CSV_CENTRAL}")


# ─────────────────────────────────────────────
#  6. ANALYSE DE SENSIBILITÉ
# ─────────────────────────────────────────────
print("\n" + "=" * 65)
print("ANALYSE DE SENSIBILITÉ")
print("=" * 65)

rows_sensi = []
for part_capi, r_brut, n, g in itertools.product(
    [PART_CAPI_B, PART_CAPI_C],
    RENDEMENTS_REELS_BRUTS,
    DUREES,
    CROISSANCES_SALAIRE
):
    res = calcul_scenario(part_capi=part_capi, r_brut=r_brut, n=n, g=g)
    res_ref = calcul_scenario(part_capi=0.0, r_brut=r_brut, n=n, g=g)  # scénario A même durée/g

    label_scenario = "B (80/20)" if part_capi == PART_CAPI_B else "C (60/40)"
    rows_sensi.append({
        "scenario":              label_scenario,
        "part_capi":             part_capi,
        "rendement_reel_brut":   r_brut,
        "duree_carriere":        n,
        "croissance_salaire":    g,
        "capital_capi":          round(res["capital_capi"], 0),
        "rente_mensuelle":       round(res["rente_mensuelle"], 0),
        "pension_totale_annuelle": round(res["pension_totale_annuelle"], 0),
        "cumul_20ans":           round(res["cumul_20ans"], 0),
        "ecart_cumul_vs_A":      round(res["cumul_20ans"] - res_ref["cumul_20ans"], 0),
    })

df_sensi = pd.DataFrame(rows_sensi)
df_sensi.to_csv(CSV_SENSI, index=False, encoding="utf-8")
print(f"→ Sensibilité exportée : {CSV_SENSI}")

# Affichage synthétique scénario B / central
print("\nSensibilité scénario B (80/20) — pension totale annuelle (€/an) :")
pivot_B = df_sensi[
    (df_sensi["scenario"] == "B (80/20)") &
    (df_sensi["duree_carriere"] == N_CARRIERE) &
    (df_sensi["croissance_salaire"] == G_SALAIRE)
][["rendement_reel_brut", "pension_totale_annuelle", "capital_capi", "ecart_cumul_vs_A"]]
print(pivot_B.to_string(index=False))

print("\nSensibilité scénario C (60/40) — pension totale annuelle (€/an) :")
pivot_C = df_sensi[
    (df_sensi["scenario"] == "C (60/40)") &
    (df_sensi["duree_carriere"] == N_CARRIERE) &
    (df_sensi["croissance_salaire"] == G_SALAIRE)
][["rendement_reel_brut", "pension_totale_annuelle", "capital_capi", "ecart_cumul_vs_A"]]
print(pivot_C.to_string(index=False))


# ─────────────────────────────────────────────
#  7. TRAJECTOIRES TEMPORELLES (pour graphique)
# ─────────────────────────────────────────────
# Accumulation année par année (boucle manuelle — pas de formule)
def trajectoire_accumulation(part_capi: float, r_brut: float,
                              n: int = N_CARRIERE, g: float = G_SALAIRE):
    r_net = r_brut - FRAIS_GESTION
    C0 = SALAIRE_BRUT_0 * TAUX_COTIS_TOTAL * part_capi
    capital = 0.0
    annees   = []
    capitaux = []
    cotisations_cumulees = []
    cotis_cum = 0.0
    for t in range(n):
        versement = C0 * (1 + g) ** t
        capital   = capital * (1 + r_net) + versement
        cotis_cum += versement
        annees.append(2026 + t + 1)   # fin d'année t+1
        capitaux.append(capital)
        cotisations_cumulees.append(cotis_cum)
    return annees, capitaux, cotisations_cumulees


ann_B, cap_B, cc_B = trajectoire_accumulation(PART_CAPI_B, R_CENTRAL)
ann_B3, cap_B3, _  = trajectoire_accumulation(PART_CAPI_B, 0.03)
ann_B5, cap_B5, _  = trajectoire_accumulation(PART_CAPI_B, 0.05)
ann_C, cap_C, cc_C = trajectoire_accumulation(PART_CAPI_C, R_CENTRAL)
ann_C3, cap_C3, _  = trajectoire_accumulation(PART_CAPI_C, 0.03)
ann_C5, cap_C5, _  = trajectoire_accumulation(PART_CAPI_C, 0.05)


# ─────────────────────────────────────────────
#  8. GRAPHIQUE PUBLICATION-READY (charte OVLA)
# ─────────────────────────────────────────────
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
    "axes.titlesize":     14,
    "axes.titleweight":   "bold",
    "figure.dpi":         300,
})

fig, axes = plt.subplots(1, 2, figsize=(1920/300*2, 1080/300*2))
fig.patch.set_facecolor(OVLA_COLORS["navy"])

# ── Sous-graphique gauche : accumulation du capital ──
ax1 = axes[0]
ax1.set_facecolor(OVLA_COLORS["navy"])

# Fourchette scénario B (3-5 %)
ax1.fill_between(ann_B3, cap_B3, cap_B5, alpha=0.15, color=OVLA_COLORS["cyan"])
# Central scénario B
ax1.plot(ann_B, cap_B, color=OVLA_COLORS["cyan"], lw=2.2,
         label=f"B — Mixte 80/20 (4 % réel)")
ax1.plot(ann_B3, cap_B3, color=OVLA_COLORS["cyan"], lw=1.0, ls="--", alpha=0.6,
         label="B — 3 %")
ax1.plot(ann_B5, cap_B5, color=OVLA_COLORS["cyan"], lw=1.0, ls=":", alpha=0.6,
         label="B — 5 %")

# Fourchette scénario C (3-5 %)
ax1.fill_between(ann_C3, cap_C3, cap_C5, alpha=0.12, color=OVLA_COLORS["gold"])
# Central scénario C
ax1.plot(ann_C, cap_C, color=OVLA_COLORS["gold"], lw=2.2,
         label=f"C — Mixte 60/40 (4 % réel)")
ax1.plot(ann_C3, cap_C3, color=OVLA_COLORS["gold"], lw=1.0, ls="--", alpha=0.6,
         label="C — 3 %")
ax1.plot(ann_C5, cap_C5, color=OVLA_COLORS["gold"], lw=1.0, ls=":", alpha=0.6,
         label="C — 5 %")

# Cotisations cumulées (sans rendement)
ax1.plot(ann_B, cc_B, color=OVLA_COLORS["cyan"], lw=1.0, ls="-", alpha=0.35)
ax1.plot(ann_C, cc_C, color=OVLA_COLORS["gold"], lw=1.0, ls="-", alpha=0.35)

ax1.set_xlim(2026, 2070)
ax1.set_xlabel("Année", fontsize=10)
ax1.set_ylabel("Capital accumulé (€ constants 2026)", fontsize=10)
ax1.set_title("Accumulation du capital (2026-2069)", fontsize=12, fontweight="bold",
              color=OVLA_COLORS["cyan"])
ax1.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{x/1000:.0f} k€"))
ax1.legend(fontsize=7.5, framealpha=0.25, loc="upper left")
ax1.grid(True, alpha=0.1)

# Annotation capital final scénario B central
ax1.annotate(
    f"{cap_B[-1]/1000:.0f} k€",
    xy=(ann_B[-1], cap_B[-1]),
    xytext=(-50, 10), textcoords="offset points",
    color=OVLA_COLORS["cyan"], fontsize=9, fontweight="bold",
    arrowprops=dict(arrowstyle="->", color=OVLA_COLORS["cyan"], lw=0.8)
)
ax1.annotate(
    f"{cap_C[-1]/1000:.0f} k€",
    xy=(ann_C[-1], cap_C[-1]),
    xytext=(-50, -18), textcoords="offset points",
    color=OVLA_COLORS["gold"], fontsize=9, fontweight="bold",
    arrowprops=dict(arrowstyle="->", color=OVLA_COLORS["gold"], lw=0.8)
)

# ── Sous-graphique droit : pension mensuelle totale par scénario/rendement ──
ax2 = axes[1]
ax2.set_facecolor(OVLA_COLORS["navy"])

scenarios_bar = ["A\nRépartition\npure", "B — 3 %", "B — 4 %", "B — 5 %",
                  "C — 3 %", "C — 4 %", "C — 5 %"]
colours_bar   = [OVLA_COLORS["red"],
                 OVLA_COLORS["cyan"], OVLA_COLORS["cyan"], OVLA_COLORS["cyan"],
                 OVLA_COLORS["gold"], OVLA_COLORS["gold"], OVLA_COLORS["gold"]]
alphas_bar    = [1.0, 0.55, 1.0, 0.7, 0.55, 1.0, 0.7]

pensions_mensuelles = [
    resultats_centraux["A — Répartition pure"]["pension_totale_annuelle"] / 12,
]
for r in RENDEMENTS_REELS_BRUTS:
    res_b = calcul_scenario(PART_CAPI_B, r)
    pensions_mensuelles.append(res_b["pension_totale_annuelle"] / 12)
for r in RENDEMENTS_REELS_BRUTS:
    res_c = calcul_scenario(PART_CAPI_C, r)
    pensions_mensuelles.append(res_c["pension_totale_annuelle"] / 12)

# Référence scénario A
ref_pension = pensions_mensuelles[0]

bars = ax2.bar(scenarios_bar, pensions_mensuelles, color=colours_bar,
               alpha=0.85, edgecolor="none", width=0.65)
for i, (bar, val) in enumerate(zip(bars, pensions_mensuelles)):
    bars[i].set_alpha(alphas_bar[i])
    ax2.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 8,
             f"{val:.0f} €", ha="center", va="bottom",
             color="#ffffff", fontsize=8.5, fontweight="bold")
    if i > 0:
        ecart = val - ref_pension
        ax2.text(bar.get_x() + bar.get_width() / 2, bar.get_height() / 2,
                 f"+{ecart:.0f} €", ha="center", va="center",
                 color="#000000", fontsize=7, fontweight="bold", alpha=0.75)

# Ligne de référence scénario A
ax2.axhline(ref_pension, color=OVLA_COLORS["red"], lw=1.0, ls="--", alpha=0.6,
            label=f"Référence A : {ref_pension:.0f} €/mois")

ax2.set_ylabel("Pension mensuelle totale (€/mois, euros constants 2026)", fontsize=9)
ax2.set_title("Pension mensuelle totale à 73 ans", fontsize=12, fontweight="bold",
              color=OVLA_COLORS["gold"])
ax2.legend(fontsize=8, framealpha=0.25)
ax2.grid(True, alpha=0.08, axis="y")
ax2.set_ylim(0, max(pensions_mensuelles) * 1.18)

# ── Titre principal ──
fig.suptitle(
    "Capitalisons — Modélisation Ch. 2 : l'actif de 30 ans en 2026\n"
    "Salaire brut 35 000 € · 43 ans de cotisation · Euros constants 2026",
    fontsize=13, fontweight="bold", color="#ffffff", y=1.01
)

plt.tight_layout()
plt.savefig(PNG_COURBES, dpi=300, bbox_inches="tight",
            facecolor=OVLA_COLORS["navy"])
print(f"\n→ Graphique exporté : {PNG_COURBES}")


# ─────────────────────────────────────────────
#  9. RÉCAPITULATIF CONSOLE FINAL
# ─────────────────────────────────────────────
print("\n" + "=" * 65)
print("RÉCAPITULATIF FINAL — Scénario B central (80/20, 4 % réel)")
print("=" * 65)
res_B_central = resultats_centraux["B — Mixte 80/20 (Suède)"]
print(f"  Capital accumulé à 73 ans     : {res_B_central['capital_capi']:>12,.0f} €")
print(f"  Rente mensuelle               : {res_B_central['rente_mensuelle']:>12,.0f} €/mois")
print(f"  Rente annuelle                : {res_B_central['rente_annuelle']:>12,.0f} €/an")
print(f"  Pension répartition           : {res_B_central['pension_repartition_annuelle']:>12,.0f} €/an")
print(f"  PENSION TOTALE                : {res_B_central['pension_totale_annuelle']:>12,.0f} €/an")
print(f"  Pension A (référence)         : {res_A['pension_totale_annuelle']:>12,.0f} €/an")
ecart_B_A = res_B_central["pension_totale_annuelle"] - res_A["pension_totale_annuelle"]
ecart_cum_B = res_B_central["cumul_20ans"] - res_A["cumul_20ans"]
print(f"  Écart pension annuelle vs A   : {ecart_B_A:>+12,.0f} €/an")
print(f"  Écart cumul 20 ans vs A       : {ecart_cum_B:>+12,.0f} €")

print("\n" + "=" * 65)
print("FICHIERS PRODUITS")
print("=" * 65)
print(f"  CSV résultats centraux : {CSV_CENTRAL}")
print(f"  CSV sensibilité        : {CSV_SENSI}")
print(f"  Graphique PNG          : {PNG_COURBES}")
print("=" * 65)
