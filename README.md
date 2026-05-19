# Проект генерации вариантов заданий

## Быстрый старт
1. `./setup_project.sh` — создать структуру (если не сделано)
2. `docker compose up -d` — поднять БД, Redis, MinIO
3. Для ML-разработки: `docker compose --profile ml up -d ollama`
4. Бэкенд: `cd backend && pip install -r requirements.txt`
5. ML: `cd ml && pip install -r requirements.txt`

## Структура
- `frontend/` — React (Надя)
- `backend/` — FastAPI (Вика)
- `ml/` — LangChain, промпты, RAG (Добрыня)
- `data/` — сырые и обработанные данные
- `init/` — SQL для автоматической инициализации БД
