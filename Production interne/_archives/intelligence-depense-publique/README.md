# Intelligence de la Depense Publique (IDP)

Projet d'analyse de l'integralite de la depense publique francaise (~1 600 Md€/an, 57% du PIB).

**Statut** : Archive (mars 2026). Fonctionnel mais pas integre au site ouvalargent.com.

## Structure

```
intelligence/          Backend Python (FastAPI + PostgreSQL + ingesters)
frontend-pages/        Pages Next.js (app/intelligence/*)
api-route/             Route API Next.js (app/api/intelligence/)
```

## Ce que ca fait

- **4 piliers** : Etat (LOLF), Securite sociale (DREES), Collectivites (OFGL), Operateurs
- **Comparaison internationale** : 14 pays, classification COFOG (Eurostat)
- **Agent IA** : Orchestrateur Claude avec 12 tools SQL
- **Dashboard** : Vue consolidee 1 600 Md€ + 3 pages detail

## Donnees ingerees

| Source | Rows | Annees |
|--------|------|--------|
| Budget Etat (data.economie.gouv.fr) | 1 242 | 2023 |
| Protection sociale (DREES) | 1 664 | 2022 |
| COFOG (Eurostat) | 4 488 | 1995-2024 |
| OFGL communes | ~1 | Paris |

## Pour relancer

```bash
# 1. Remettre les fichiers en place
mv intelligence/ ../../intelligence/
mv frontend-pages/ ../../Site/app/intelligence/
mv api-route/ ../../Site/app/api/intelligence/

# 2. Installer les deps Python
cd ../../intelligence && pip3 install -r requirements.txt

# 3. Appliquer le schema SQL (PostgreSQL requis)
psql -f schema.sql

# 4. Lancer le backend
cd intelligence && python3 -m uvicorn api.routes:app --port 8001

# 5. Le frontend se lance avec le site (next dev)
```

## Config requise

- PostgreSQL local
- Variables d'env : DATABASE_URL (ou defaut localhost:5432/idp)
- ANTHROPIC_API_KEY pour l'agent IA
