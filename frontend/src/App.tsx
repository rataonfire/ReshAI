import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SUBJECTS = [
  "Математика",
  "Физика",
  "Биология",
  "Информатика",
  "История",
  "Обществознание",
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [taskText, setTaskText] = useState("");
  const [subject, setSubject] = useState("Математика");
  const [variantsCount, setVariantsCount] = useState(4);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  // НОВОЕ: Функция для удаления файла
  const handleRemoveFile = (event: React.MouseEvent) => {
    event.stopPropagation(); // Чтобы клик по крестику не вызывал окно выбора файлов
    setFileName("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Очищаем сам инпут, чтобы можно было выбрать тот же файл снова
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#21A038] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              РешAI
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Шаг {currentStep} из 3
            </span>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#21A038] transition-all duration-500"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full px-6 pt-10 pb-12">
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
              Шаг 1. Какую задачу будем размножать?
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Вставьте текст вручную или загрузите файл (PDF, DOCX, JPG).
            </p>
            <Textarea
              placeholder="Вставьте текст эталонного задания сюда..."
              className="h-44 resize-none mb-6 focus-visible:ring-[#21A038] border-slate-200 text-md"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            />
            <div className="flex items-center gap-4 mb-8 text-center">
              <div className="flex-1 h-px bg-slate-100"></div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                ИЛИ
              </span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx,.jpg,.png,.txt"
            />

            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-green-50 hover:border-[#21A038] transition-all cursor-pointer mb-8 group"
            >
              {fileName ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">📄</span>
                  <span className="text-sm font-bold text-[#21A038] text-center">
                    Файл выбран: {fileName}
                  </span>

                  {/* НОВОЕ: Кнопка удаления файла */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] text-slate-400 group-hover:text-slate-600 transition-colors">
                      Нажмите, чтобы заменить
                    </span>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={handleRemoveFile}
                      className="text-[11px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors shadow-sm"
                    >
                      Удалить ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-[#21A038] text-xl">+</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 text-center">
                    Нажмите, чтобы выбрать файл на компьютере
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                    Макс. размер 20МБ
                  </span>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={taskText.length < 5 && !selectedFile}
                className="bg-[#21A038] hover:bg-[#1B802C] text-white px-10 py-7 text-md font-bold rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95"
              >
                Далее: Настройки
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
              Шаг 2. Настройки генерации
            </h2>
            <p className="text-slate-500 text-sm mb-8">
              Уточните предмет и количество вариантов для ИИ.
            </p>
            <div className="space-y-8 mb-10">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Предмет
                </label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#21A038] appearance-none cursor-pointer"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Количество вариантов
                  </label>
                  <span className="bg-green-100 text-[#21A038] px-3 py-1 rounded-full text-xs font-bold">
                    {variantsCount}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={variantsCount}
                  onChange={(e) => setVariantsCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#21A038]"
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(1)}
                className="text-slate-400 hover:text-slate-800 font-bold"
              >
                ← НАЗАД
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                className="bg-[#21A038] hover:bg-[#1B802C] text-white px-10 py-7 text-md font-bold rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95"
              >
                СГЕНЕРИРОВАТЬ ЗАДАНИЯ
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl animate-pulse">✨</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Магия началась!
            </h2>
            <p className="text-slate-500 mt-3 max-w-sm mx-auto">
              ИИ анализирует вашу задачу и создаёт {variantsCount} уникальных
              варианта по предмету "{subject}".
            </p>
            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#21A038] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-[#21A038] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-[#21A038] rounded-full animate-bounce"></div>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="mt-8 border-slate-200 text-slate-400 hover:text-slate-800 rounded-xl"
              >
                Отменить и вернуться
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
