import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function App() {
  // Состояние (state) для хранения текста, который введет учитель
  const [taskText, setTaskText] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Шапка (Header) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#21A038] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">РешAI</h1>
          </div>
          <span className="text-sm font-medium text-slate-500">
            Мастер создания заданий
          </span>
        </div>
      </header>

      {/* Основной контент (Шаг 1) */}
      <main className="max-w-3xl mx-auto w-full px-6 pt-10 pb-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Шаг 1. Какую задачу будем размножать?
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Вставьте текст задачи вручную или загрузите файл, а нейросеть сама
            определит предмет.
          </p>

          {/* Текстовое поле от shadcn */}
          <Textarea
            placeholder="Вставьте текст эталонного задания сюда..."
            className="h-40 resize-none mb-6 focus-visible:ring-[#21A038]"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-bold text-slate-400 uppercase">
              ИЛИ
            </span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Зона загрузки файла (пока просто визуал) */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer mb-8">
            <span className="text-sm font-semibold text-slate-700">
              Перетащите файл сюда (PDF, DOCX, JPG)
            </span>
            <span className="text-xs text-slate-500 mt-1">
              или нажмите, чтобы выбрать
            </span>
          </div>

          {/* Кнопка Далее */}
          <div className="flex justify-end">
            <Button
              className="bg-[#21A038] hover:bg-[#1B802C] text-white px-8 py-6 text-md font-bold rounded-lg"
              disabled={taskText.length === 0} // Кнопка заблокирована, если текст пустой
            >
              Далее: Настройки
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
