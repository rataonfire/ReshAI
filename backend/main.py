from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Pydantic модели ----------
class GenerateRequest(BaseModel):
    task_text: str
    n_variants: int = 3
    subject: str                    # ← ДОБАВЛЕНО: предмет (математика, русский и т.д.)
    variation_types: Optional[List[str]] = None  # опционально: ["numbers", "synonyms"]

class Variant(BaseModel):
    number: int
    text: str
    answer: str                     # ← ДОБАВЛЕНО: правильный ответ для учителя

class GenerateResponse(BaseModel):
    variants: List[Variant]

# ---------- Эндпоинты ----------
@app.post("/upload")
async def upload_file(file: UploadFile):
    """Загрузка файла с заданием"""
    contents = await file.read()
    # TODO: парсинг через твой pdf_parser.py
    return {
        "filename": file.filename,
        "size": len(contents),
        "extracted_text": "пример текста"  # пока заглушка
    }

@app.post("/generate")
async def generate_variants(request: GenerateRequest):
    """Генерация вариантов заданий"""
    # TODO: вызвать LLM с учётом subject
    # Пока заглушка для теста фронта
    variants = [
        Variant(
            number=1,
            text=f"Вариант 1: {request.task_text[:50]}... (изменено)",
            answer="42"
        ),
        Variant(
            number=2,
            text=f"Вариант 2: {request.task_text[:50]}... (изменено)",
            answer="7.5"
        ),
        Variant(
            number=3,
            text=f"Вариант 3: {request.task_text[:50]}... (изменено)",
            answer="x = 4"
        ),
    ]
    # Генерируем ровно столько, сколько запросили
    while len(variants) < request.n_variants:
        variants.append(Variant(
            number=len(variants)+1,
            text="Дополнительный вариант",
            answer="?"
        ))
    
    return GenerateResponse(variants=variants[:request.n_variants])

@app.get("/task/{task_id}")
async def get_task(task_id: int):
    """Получить сохранённое задание"""
    return {"id": task_id, "text": "пример", "subject": "математика"}