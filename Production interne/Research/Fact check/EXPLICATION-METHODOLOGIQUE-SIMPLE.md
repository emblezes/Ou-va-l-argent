# Comment Comprendre les Chiffres des Dépenses Publiques?

## Les Deux Façons de Compter

Imaginez que vous voulez comprendre les dépenses d'une famille nombreuse avec plusieurs comptes bancaires.

### 🏦 Approche 1: QUI DÉPENSE? (Institutionnelle - INSEE)

"Combien dépense chaque membre de la famille?"

```
┌─────────────────────────────────────┐
│ FAMILLE FRANCE = 1,670 Md€          │
├─────────────────────────────────────┤
│                                      │
│ 👨 Papa (État)        : 670 Md€     │
│ 👩 Maman (Sécu)       : 777 Md€     │
│ 👧 Enfants (Villes)   : 330 Md€     │
│                                      │
│ Total avant consolidation: 1,777 Md€│
│ Moins doubles comptes:      -107 Md€│
│ = TOTAL RÉEL:             1,670 Md€ │
└─────────────────────────────────────┘
```

**Source:** INSEE - Comptes des administrations publiques

---

### 🎯 Approche 2: POUR QUOI? (Fonctionnelle - DREES)

"À quoi sert l'argent, peu importe qui paie?"

```
┌─────────────────────────────────────┐
│ BUDGET FAMILLE = 1,670 Md€          │
├─────────────────────────────────────┤
│                                      │
│ 🏥 Santé & Protection    : 932 Md€  │
│    - Retraites    : 380 Md€         │
│    - Santé        : 270 Md€         │
│    - Famille      : 282 Md€         │
│                                      │
│ 🎓 Éducation             : 170 Md€  │
│ 🏛️  Services publics     : 140 Md€  │
│ 🚂 Transports            :  50 Md€  │
│ ... (autres)             : 378 Md€  │
│                                      │
│ = TOTAL:                 1,670 Md€  │
└─────────────────────────────────────┘
```

**Source:** DREES - Protection sociale / INSEE - Classification COFOG

---

## 🤔 La Question Qui Dérange

### "Pourquoi la Sécurité sociale dépense 777 Md€ mais la protection sociale coûte 932 Md€?"

**Réponse simple:**

La protection sociale (932 Md€) ≠ Dépenses de la Sécurité sociale (777 Md€)

**Car la protection sociale inclut AUSSI:**

1. **Les retraites des fonctionnaires (payées par l'État)** → ~90 Md€
   - Un instituteur retraité touche sa pension
   - Ce n'est PAS la Sécu qui paie, c'est l'État
   - Mais c'est bien de la "protection sociale" (retraite)

2. **Le RSA (payé par les départements)** → ~15 Md€
   - Versé par les conseils départementaux
   - Pas par la Sécu
   - Mais c'est de la "protection sociale" (solidarité)

3. **L'APA, allocations logement, etc.** → ~50 Md€
   - Versés par différentes institutions
   - Pas tous par la Sécu

**Total de la différence: ~155 Md€**

---

## 📊 Schéma Explicatif

```
                    PROTECTION SOCIALE
                    932 Md€ de prestations
                    ┌───────────────────────┐
                    │                       │
                    │   Toutes les          │
                    │   prestations         │
                    │   sociales versées    │
                    │   en France           │
                    │                       │
                    └───────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐     ┌──────────┐
    │  ASSO    │      │  ÉTAT    │     │  VILLES  │
    │ (Sécu)   │      │          │     │          │
    │          │      │          │     │          │
    │ 777 Md€  │      │ ~90 Md€  │     │ ~65 Md€  │
    │          │      │          │     │          │
    │ Retraites│      │ Pensions │     │   RSA    │
    │  privé   │      │  fonc-   │     │   APA    │
    │ Santé    │      │  tion.   │     │  Aide    │
    │ Chômage  │      │          │     │  sociale │
    └──────────┘      └──────────┘     └──────────┘

         83%               10%              7%
    de la protection   de la protection  de la protection
        sociale            sociale          sociale
```

---

## 💡 Exemple Concret

### Monsieur Dupont, instituteur retraité

**Il touche 2,000€ de pension par mois.**

| Vue | Question | Réponse | Dans quel total? |
|-----|----------|---------|------------------|
| **Institutionnelle** | Qui paie? | L'État (ministère Éducation) | Dans les 670 Md€ de l'État, PAS dans les 777 Md€ de la Sécu |
| **Fonctionnelle** | C'est quoi? | Une prestation retraite | Dans les 932 Md€ de protection sociale, rubrique "Retraites" (380 Md€) |

**Donc:**
- Les 2,000€ sont dans les 932 Md€ (protection sociale)
- Mais PAS dans les 777 Md€ (dépenses Sécu)
- Ils sont dans les 670 Md€ (dépenses État)

**C'est pour ça que 777 ≠ 932 !**

---

## ✅ Les Deux Approches Sont Correctes

### On utilise laquelle?

**Ça dépend de la question:**

| Question | Approche | Chiffre |
|----------|----------|---------|
| "Combien coûte la Sécurité sociale?" | Institutionnelle | 777 Md€ |
| "Combien coûte la protection sociale?" | Fonctionnelle | 932 Md€ |
| "Combien dépense l'État?" | Institutionnelle | 670 Md€ |
| "Combien coûtent les retraites?" | Fonctionnelle | 380 Md€ |
| "Combien coûte la santé?" | Fonctionnelle | 270 Md€ |

---

## 🎓 Pour Aller Plus Loin

### Définitions Techniques

**ASSO (Administrations de Sécurité Sociale):**
- Catégorie comptable de l'INSEE
- Regroupe: CNAM, CNAF, CNAV, Pôle emploi, etc.
- 777 Md€ de dépenses en 2024

**Protection Sociale:**
- Concept fonctionnel de la DREES
- Toutes les prestations contre les risques sociaux
- 932 Md€ de prestations en 2024

**APU (Administrations Publiques):**
- Ensemble: État + ASSO + Collectivités + ODAC
- 1,670 Md€ de dépenses consolidées en 2024

---

## 📚 Sources

- **INSEE:** [Comptes des administrations publiques 2024](https://www.insee.fr/fr/statistiques/8574492)
- **DREES:** [Protection sociale 2024](https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse/panoramas-de-la-drees/251217-protection-sociale-france-europe-2024)
- **Budget.gouv.fr:** [Panorama des finances publiques](https://www.budget.gouv.fr/panorama-finances-publiques)

---

## 📞 Contact

Questions sur ces données?
→ Voir le rapport complet: `/RAPPORT-FACT-CHECK-DONNEES-2024.md`
