-- Intelligence de la Dépense Publique (IDP)
-- PostgreSQL schema with pgvector extension

-- Extensions
-- pgvector: requires PostgreSQL 15+ with pgvector installed
-- If not available, embedding column will use JSONB instead
DO $$ BEGIN
    CREATE EXTENSION IF NOT EXISTS vector;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'pgvector not available — embeddings will use JSONB fallback';
END $$;

DO $$ BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'pg_trgm not available — fuzzy text search disabled';
END $$;

-- ============================================================
-- ENTITIES — Référentiel des acteurs publics et privés
-- ============================================================

CREATE TABLE IF NOT EXISTS entities (
    id              BIGSERIAL PRIMARY KEY,
    siren           CHAR(9) UNIQUE,
    siret           CHAR(14),
    name            TEXT NOT NULL,
    legal_form      TEXT,                          -- SA, SARL, EURL, Association...
    entity_type     TEXT NOT NULL DEFAULT 'company', -- company, public_org, association
    naf_code        VARCHAR(10),                   -- Code APE/NAF
    address         TEXT,
    postal_code     VARCHAR(5),
    city            TEXT,
    department_code VARCHAR(3),
    region_code     VARCHAR(3),
    creation_date   DATE,
    employee_count  INTEGER,
    revenue         BIGINT,                        -- Chiffre d'affaires en euros
    source          TEXT DEFAULT 'sirene',
    raw_data        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entities_siren ON entities(siren);
CREATE INDEX IF NOT EXISTS idx_entities_siret ON entities(siret);
-- Requires pg_trgm: CREATE INDEX idx_entities_name_trgm ON entities USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_entities_dept ON entities(department_code);
CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(entity_type);

-- ============================================================
-- COMMUNES — Collectivités locales (37k+ communes)
-- ============================================================

CREATE TABLE IF NOT EXISTS communes (
    id              BIGSERIAL PRIMARY KEY,
    code_insee      VARCHAR(5) NOT NULL,
    name            TEXT NOT NULL,
    department_code VARCHAR(3),
    region_code     VARCHAR(3),
    population      INTEGER,
    strate          TEXT,                          -- Strate démographique OFGL
    epci_code       VARCHAR(20),                   -- Code EPCI (intercommunalité)
    epci_name       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(code_insee)
);

CREATE INDEX IF NOT EXISTS idx_communes_insee ON communes(code_insee);
CREATE INDEX IF NOT EXISTS idx_communes_dept ON communes(department_code);
-- Requires pg_trgm: CREATE INDEX idx_communes_name_trgm ON communes USING gin(name gin_trgm_ops);

-- ============================================================
-- COMMUNE_BUDGETS — Comptes financiers annuels des communes
-- ============================================================

CREATE TABLE IF NOT EXISTS commune_budgets (
    id              BIGSERIAL PRIMARY KEY,
    code_insee      VARCHAR(5) NOT NULL REFERENCES communes(code_insee),
    year            SMALLINT NOT NULL,
    -- Recettes de fonctionnement
    rev_total       BIGINT,   -- Total recettes de fonctionnement (€)
    rev_fiscal      BIGINT,   -- Recettes fiscales
    rev_dotations   BIGINT,   -- Dotations et subventions
    rev_other       BIGINT,   -- Autres recettes
    -- Dépenses de fonctionnement
    exp_total       BIGINT,   -- Total dépenses de fonctionnement (€)
    exp_personnel   BIGINT,   -- Charges de personnel
    exp_purchases   BIGINT,   -- Achats et charges externes
    exp_financial   BIGINT,   -- Charges financières (intérêts dette)
    exp_grants      BIGINT,   -- Subventions versées
    exp_other       BIGINT,   -- Autres dépenses
    -- Investissement
    inv_revenue     BIGINT,   -- Recettes d'investissement
    inv_expenditure BIGINT,   -- Dépenses d'investissement
    -- Indicateurs
    debt_total      BIGINT,   -- Encours de dette (€)
    debt_per_capita NUMERIC(10,2), -- Dette par habitant
    exp_per_capita  NUMERIC(10,2), -- Dépenses par habitant
    savings_rate    NUMERIC(5,2),  -- Taux d'épargne brute (%)
    tax_rate        NUMERIC(5,2),  -- Taux moyen d'imposition (%)
    -- Metadata
    population      INTEGER,
    source          TEXT DEFAULT 'ofgl',
    raw_data        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(code_insee, year)
);

CREATE INDEX IF NOT EXISTS idx_budgets_insee_year ON commune_budgets(code_insee, year);
CREATE INDEX IF NOT EXISTS idx_budgets_year ON commune_budgets(year);

-- ============================================================
-- CONTRACTS — Marchés publics (BOAMP)
-- ============================================================

CREATE TABLE IF NOT EXISTS contracts (
    id              BIGSERIAL PRIMARY KEY,
    boamp_id        TEXT UNIQUE,                   -- Identifiant BOAMP unique
    announcement_type TEXT,                         -- Avis, Attribution, Rectificatif
    procedure_type  TEXT,                           -- Ouvert, Restreint, Négocié...
    contract_type   TEXT,                           -- Travaux, Fournitures, Services
    cpv_code        VARCHAR(20),                   -- Code CPV (classification)
    cpv_label       TEXT,
    title           TEXT,
    description     TEXT,
    buyer_name      TEXT,
    buyer_siret     CHAR(14),
    buyer_code_insee VARCHAR(5),
    winner_name     TEXT,
    winner_siret    CHAR(14),
    amount          BIGINT,                        -- Montant en centimes d'euros
    amount_min      BIGINT,                        -- Fourchette basse
    amount_max      BIGINT,                        -- Fourchette haute
    duration_months INTEGER,
    publication_date DATE,
    deadline_date   DATE,
    award_date      DATE,
    nb_offers       INTEGER,                       -- Nombre d'offres reçues
    is_lot          BOOLEAN DEFAULT FALSE,
    lot_number      INTEGER,
    parent_id       BIGINT REFERENCES contracts(id),
    source          TEXT DEFAULT 'boamp',
    raw_data        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_boamp ON contracts(boamp_id);
CREATE INDEX IF NOT EXISTS idx_contracts_buyer ON contracts(buyer_siret);
CREATE INDEX IF NOT EXISTS idx_contracts_winner ON contracts(winner_siret);
CREATE INDEX IF NOT EXISTS idx_contracts_cpv ON contracts(cpv_code);
CREATE INDEX IF NOT EXISTS idx_contracts_date ON contracts(publication_date);
CREATE INDEX IF NOT EXISTS idx_contracts_amount ON contracts(amount);
CREATE INDEX IF NOT EXISTS idx_contracts_type ON contracts(contract_type);

-- ============================================================
-- SUBVENTIONS — Subventions État (Data.Subvention)
-- ============================================================

CREATE TABLE IF NOT EXISTS subventions (
    id              BIGSERIAL PRIMARY KEY,
    external_id     TEXT UNIQUE,
    program         TEXT,                          -- Programme LOLF
    action          TEXT,                          -- Action budgétaire
    ministry        TEXT,
    grantor_name    TEXT,                          -- Organisme verseur
    grantor_siret   CHAR(14),
    recipient_name  TEXT,                          -- Bénéficiaire
    recipient_siret CHAR(14),
    recipient_type  TEXT,                          -- Association, Entreprise, Collectivité
    amount_granted  BIGINT,                        -- Montant accordé (centimes)
    amount_paid     BIGINT,                        -- Montant versé (centimes)
    year            SMALLINT,
    grant_date      DATE,
    payment_date    DATE,
    purpose         TEXT,                          -- Objet de la subvention
    source          TEXT DEFAULT 'data_subvention',
    raw_data        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subventions_recipient ON subventions(recipient_siret);
CREATE INDEX IF NOT EXISTS idx_subventions_grantor ON subventions(grantor_siret);
CREATE INDEX IF NOT EXISTS idx_subventions_year ON subventions(year);
CREATE INDEX IF NOT EXISTS idx_subventions_program ON subventions(program);
CREATE INDEX IF NOT EXISTS idx_subventions_amount ON subventions(amount_granted);

-- ============================================================
-- ANOMALIES — Résultats de détection d'anomalies ML
-- ============================================================

CREATE TABLE IF NOT EXISTS anomalies (
    id              BIGSERIAL PRIMARY KEY,
    entity_type     TEXT NOT NULL,                 -- contract, commune_budget, subvention
    entity_id       BIGINT NOT NULL,               -- ID dans la table source
    detector        TEXT NOT NULL,                 -- isolation_forest, prophet, lstm, graph
    anomaly_type    TEXT,                          -- price_outlier, budget_drift, network_cluster
    score           NUMERIC(8,6),                  -- Score d'anomalie (0-1)
    severity        TEXT DEFAULT 'medium',         -- low, medium, high, critical
    description     TEXT,
    details         JSONB,                         -- Données spécifiques au détecteur
    is_confirmed    BOOLEAN,                       -- Validé manuellement ?
    confirmed_by    TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anomalies_entity ON anomalies(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_severity ON anomalies(severity);
CREATE INDEX IF NOT EXISTS idx_anomalies_detector ON anomalies(detector);
CREATE INDEX IF NOT EXISTS idx_anomalies_score ON anomalies(score DESC);

-- ============================================================
-- DOCUMENT_EMBEDDINGS — Vecteurs pour la recherche sémantique
-- ============================================================

CREATE TABLE IF NOT EXISTS document_embeddings (
    id              BIGSERIAL PRIMARY KEY,
    source_type     TEXT NOT NULL,                 -- cour_comptes, rapport_crc, loi_finance
    source_id       TEXT,                          -- Identifiant du document source
    title           TEXT,
    chunk_index     INTEGER,
    chunk_text      TEXT NOT NULL,
    -- If pgvector is available, use: ALTER TABLE document_embeddings ADD COLUMN embedding vector(768);
    embedding       JSONB,                         -- Fallback: store as JSON array (upgrade to vector(768) with pgvector)
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_embeddings_source ON document_embeddings(source_type, source_id);
-- With pgvector: CREATE INDEX idx_embeddings_vector ON document_embeddings
--   USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================
-- ECONOMIC_SERIES — Séries économiques (Banque de France, Eurostat)
-- ============================================================

CREATE TABLE IF NOT EXISTS economic_series (
    id              BIGSERIAL PRIMARY KEY,
    series_key      TEXT NOT NULL,                 -- Identifiant unique de la série
    source          TEXT NOT NULL,                 -- banque_france, eurostat, insee
    name            TEXT,
    unit            TEXT,                          -- %, EUR, index...
    frequency       TEXT,                          -- monthly, quarterly, annual
    country_code    VARCHAR(3) DEFAULT 'FRA',
    observation_date DATE NOT NULL,
    value           NUMERIC(20,6),
    raw_data        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(series_key, source, observation_date)
);

CREATE INDEX IF NOT EXISTS idx_series_key ON economic_series(series_key, source);
CREATE INDEX IF NOT EXISTS idx_series_date ON economic_series(observation_date);

-- ============================================================
-- OFFICIALS — Responsables publics (HATVP)
-- ============================================================

CREATE TABLE IF NOT EXISTS officials (
    id              BIGSERIAL PRIMARY KEY,
    hatvp_id        TEXT UNIQUE,
    first_name      TEXT,
    last_name       TEXT NOT NULL,
    full_name       TEXT,
    role            TEXT,                          -- Député, Sénateur, Maire, Ministre...
    institution     TEXT,
    department_code VARCHAR(3),
    mandate_start   DATE,
    mandate_end     DATE,
    patrimony_total BIGINT,                        -- Patrimoine déclaré (centimes)
    interests       JSONB,                         -- Déclaration d'intérêts structurée
    source          TEXT DEFAULT 'hatvp',
    raw_data        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Requires pg_trgm: CREATE INDEX idx_officials_name ON officials USING gin(full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_officials_role ON officials(role);
CREATE INDEX IF NOT EXISTS idx_officials_dept ON officials(department_code);

-- ============================================================
-- INGESTION_LOG — Suivi des imports
-- ============================================================

CREATE TABLE IF NOT EXISTS ingestion_log (
    id              BIGSERIAL PRIMARY KEY,
    source          TEXT NOT NULL,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at     TIMESTAMPTZ,
    status          TEXT DEFAULT 'running',         -- running, success, error
    records_fetched INTEGER DEFAULT 0,
    records_inserted INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    error_message   TEXT,
    details         JSONB
);

CREATE INDEX IF NOT EXISTS idx_ingestion_source ON ingestion_log(source, started_at DESC);

-- ============================================================
-- BUDGET_ETAT — Budget général par mission/programme/action (LOLF)
-- ============================================================

CREATE TABLE IF NOT EXISTS budget_etat (
    id BIGSERIAL PRIMARY KEY,
    year SMALLINT NOT NULL,
    mission TEXT NOT NULL,
    programme TEXT,
    action TEXT,
    budget_type TEXT,                      -- 'AE' (autorisations engagements) ou 'CP' (crédits paiement)
    lfi BIGINT,                            -- Loi de Finances Initiale (centimes)
    execution BIGINT,                      -- Exécution réelle (centimes)
    ecart_pct NUMERIC(10,2),               -- Écart LFI vs exécution (%)
    source TEXT DEFAULT 'chorus',
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(year, mission, programme, action, budget_type)
);

CREATE INDEX IF NOT EXISTS idx_budget_etat_year ON budget_etat(year);
CREATE INDEX IF NOT EXISTS idx_budget_etat_mission ON budget_etat(mission);
CREATE INDEX IF NOT EXISTS idx_budget_etat_type ON budget_etat(budget_type);

-- ============================================================
-- PROTECTION_SOCIALE — Comptes de la protection sociale
-- ============================================================

CREATE TABLE IF NOT EXISTS protection_sociale (
    id BIGSERIAL PRIMARY KEY,
    year SMALLINT NOT NULL,
    branche TEXT NOT NULL,                 -- maladie, vieillesse, famille, emploi, AT-MP
    regime TEXT,                            -- général, complémentaire, etc.
    poste TEXT,                             -- prestations, gestion, transferts
    recettes BIGINT,                       -- centimes
    depenses BIGINT,                       -- centimes
    solde BIGINT,                          -- centimes
    source TEXT DEFAULT 'drees',
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(year, branche, regime, poste)
);

CREATE INDEX IF NOT EXISTS idx_protection_sociale_year ON protection_sociale(year);
CREATE INDEX IF NOT EXISTS idx_protection_sociale_branche ON protection_sociale(branche);

-- ============================================================
-- DEPENSE_PUBLIQUE_COFOG — Vue consolidée par fonction (classification COFOG)
-- ============================================================

CREATE TABLE IF NOT EXISTS depense_publique_cofog (
    id BIGSERIAL PRIMARY KEY,
    year SMALLINT NOT NULL,
    country_code VARCHAR(3) NOT NULL DEFAULT 'FRA',
    cofog_code VARCHAR(10) NOT NULL,       -- 01-10
    cofog_label TEXT,
    amount BIGINT,                         -- centimes (millions d'euros × 100)
    pct_gdp NUMERIC(6,2),                 -- % du PIB
    source TEXT DEFAULT 'eurostat',
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(year, country_code, cofog_code)
);

CREATE INDEX IF NOT EXISTS idx_cofog_year ON depense_publique_cofog(year);
CREATE INDEX IF NOT EXISTS idx_cofog_country ON depense_publique_cofog(country_code);
CREATE INDEX IF NOT EXISTS idx_cofog_code ON depense_publique_cofog(cofog_code);
