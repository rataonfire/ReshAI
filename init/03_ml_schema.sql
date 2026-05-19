SET search_path TO ml;

-- ========== Корпус задач (RAG) ==========
CREATE TABLE task_corpus (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source      TEXT NOT NULL,         -- 'sdamgia_vpr', 'fipi_kim', 'spravochnik'
    source_id   TEXT,
    subject     TEXT NOT NULL,
    grade       SMALLINT,
    topic       TEXT,
    task_type   TEXT,
    text        TEXT NOT NULL,
    formulas    JSONB,                -- [{latex: "...", svg_url: "..."}]
    answer      TEXT,
    difficulty  SMALLINT,             -- 1-5
    embedding   vector(1536),         -- размерность GigaChat Embeddings
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_task_corpus_subject ON task_corpus(subject, grade);
CREATE INDEX idx_task_corpus_embedding ON task_corpus USING hnsw (embedding vector_cosine_ops);

-- ========== Правила из справочников (RAG для критика) ==========
CREATE TABLE reference_rules (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject      TEXT NOT NULL,
    grade_min    SMALLINT,
    grade_max    SMALLINT,
    topic        TEXT NOT NULL,
    rule_name    TEXT NOT NULL,
    content      TEXT NOT NULL,        -- описание правила
    formula_latex TEXT,
    steps        JSONB,                -- [{condition: "...", steps: [...]}]
    source_file  TEXT,
    embedding    vector(1536),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ref_rules_topic ON reference_rules(subject, topic);
CREATE INDEX idx_ref_rules_embedding ON reference_rules USING hnsw (embedding vector_cosine_ops);

-- ========== Few-shot примеры (динамический retrieval) ==========
CREATE TABLE few_shot_examples (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_type    TEXT NOT NULL,        -- 'word_problem', 'computational' и т.д.
    subject      TEXT,
    original     TEXT NOT NULL,
    variants     JSONB NOT NULL,       -- [{"text":"...", "quality":"good"}]
    embedding    vector(1536),
    quality_score FLOAT NOT NULL DEFAULT 1.0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_few_shot_embedding ON few_shot_examples USING hnsw (embedding vector_cosine_ops);

-- ========== Кодификатор ФИПИ (структура требований) ==========
CREATE TABLE fipi_skills (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject     TEXT NOT NULL,
    grade       SMALLINT NOT NULL,
    skill_code  TEXT,                  -- например '1.2.3'
    skill_name  TEXT NOT NULL,
    topic       TEXT,
    bloom_level SMALLINT              -- 1-6
);
CREATE INDEX idx_fipi_skills_subject_grade ON fipi_skills(subject, grade);