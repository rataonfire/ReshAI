from abc import ABC, abstractmethod

class LLMClient(ABC):
    @abstractmethod
    async def generate(self, prompt: str, **kwargs) -> str: ...
    
    @abstractmethod
    async def generate_structured(self, prompt: str, schema: dict) -> dict: ...

class GigaChatClient(LLMClient):
    pass

class OllamaClient(LLMClient):
    pass

def get_client(provider: str | None = None) -> LLMClient:
    raise NotImplementedError("Подключи GigaChat/Ollama")
