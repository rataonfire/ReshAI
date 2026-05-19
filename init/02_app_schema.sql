SET search_path TO app;

-- ========== Пользователи и безопасность ==========
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    settings      JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT UNIQUE NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

CREATE TABLE rate_limits (
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    endpoint     TEXT NOT NULL,
    count        INT NOT NULL DEFAULT 0,
    window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, endpoint)
);

-- ========== Задания и генерация ==========
CREATE TABLE uploaded_tasks (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    file_path     TEXT,                -- путь в MinIO: uploads/{user_id}/...
    subject       TEXT,
    grade         SMALLINT,
    task_type     TEXT,                -- computational, word_problem, ...
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_uploaded_tasks_user ON uploaded_tasks(user_id);
CREATE INDEX idx_uploaded_tasks_created ON uploaded_tasks(created_at);

CREATE TABLE generation_requests (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id     UUID NOT NULL REFERENCES uploaded_tasks(id) ON DELETE CASCADE,
    parameters  JSONB NOT NULL,        -- {"n_variants":3, "variation_types":[...]}
    status      TEXT NOT NULL DEFAULT 'pending',  -- pending/processing/done/failed
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_gen_requests_user ON generation_requests(user_id);
CREATE INDEX idx_gen_requests_status ON generation_requests(status);

CREATE TABLE generated_variants (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id       UUID NOT NULL REFERENCES generation_requests(id) ON DELETE CASCADE,
    variant_number   SMALLINT NOT NULL,
    text             TEXT NOT NULL,
    verification     TEXT,    -- symbolic/llm/unverified/not_applicable
    quality_score    FLOAT,
    llm_judge_notes  TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_variants_request ON generated_variants(request_id);

-- ========== Версионирование промптов (для быстрой активации) ==========
CREATE TABLE prompts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT NOT NULL,        -- 'critic', 'generate', 'analyze'
    version      TEXT NOT NULL,
    content      TEXT NOT NULL,
    model_target TEXT,
    is_active    BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(name, version)
);