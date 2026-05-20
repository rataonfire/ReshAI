from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Task Variants Generator")

class GenerateRequest(BaseModel):
    task_text: str
    n_variants: int = 3
    variation_types: list[str] = ["numbers", "synonyms"]

@app.post("/upload")
async def upload_file(file: UploadFile):
    """Загрузка файла с эталонным заданием"""
    return {"file_id": "temp", "extracted_text": "..."}

@app.post("/generate")
async def generate_variants(req: GenerateRequest):
    """Генерация вариантов"""
    return {"variants": [{"text": f"Вариант {i+1}"} for i in range(req.n_variants)]}

@app.get("/task/{task_id}")
async def get_task(task_id: str):
    """Получить задание и варианты"""
    return {"task_id": task_id, "variants": []}