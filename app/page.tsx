'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import InputStudio from '@/components/InputStudio';
import ScenarioCarousel from '@/components/ScenarioCarousel';
import DualOutputView from '@/components/DualOutputView';
import ApiModal from '@/components/ApiModal';
import RequestPreviewModal from '@/components/RequestPreviewModal';
import KeySettingsModal from '@/components/KeySettingsModal';
import { DEFAULT_PRESET, ALL_PRESETS, fetchPresets, runEvaluation } from '@/lib/api';
import { QuestionConfig, EvaluationResponse, Preset } from '@/types';
import { Sparkles, Zap, Key } from 'lucide-react';

export default function Home() {
  const [presets, setPresets] = useState<Preset[]>(ALL_PRESETS);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(DEFAULT_PRESET.id);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [textToJudge, setTextToJudge] = useState<string>(DEFAULT_PRESET.text_to_judge);
  const [questions, setQuestions] = useState<QuestionConfig[]>(DEFAULT_PRESET.questions);

  const [model, setModel] = useState<string>('jev-1.13.0');
  const [compareWithLLM, setCompareWithLLM] = useState<boolean>(true);
  const [selectedLLM, setSelectedLLM] = useState<string>('gemini-3.5-flash-lite');

  // Custom LLM prompts (customizable by user)
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>(
    'You are an expert AI evaluation model and judge. You will analyze the provided ticket or text context and evaluate each question thoroughly.\n' +
    'Instructions:\n' +
    '1. For "choice" questions, select strictly from the provided options.\n' +
    '2. For "yes_no" questions, respond with "Yes" or "No".\n' +
    '3. For "score" questions, assign a numeric score or level.\n' +
    '4. Return ONLY a valid JSON object matching this schema:\n' +
    '{\n' +
    '  "judgments": [\n' +
    '    {"question_id": string, "key": string, "verdict": string, "confidence": number, "explanation": string}\n' +
    '  ],\n' +
    '  "reasoning_summary": string\n' +
    '}'
  );

  const [customUserPrompt, setCustomUserPrompt] = useState<string>(
    'TICKET / TEXT CONTEXT TO EVALUATE:\n{context}\n\nQUESTIONS TO JUDGE:\n{questions}'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  // Live API Keys state (JEVMODEL_API_KEY + GEMINI_API_KEY)
  const [typesafeKey, setTypesafeKey] = useState<string>('');
  const [geminiKey, setGeminiKey] = useState<string>('');

  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  // Load presets, keys and backend health on mount
  useEffect(() => {
    async function init() {
      try {
        const loaded = await fetchPresets();
        if (loaded && loaded.length > 0) {
          setPresets(loaded);
          const first = loaded[0];
          setSelectedPresetId(first.id);
          setTextToJudge(first.text_to_judge);
          setQuestions(first.questions);
        }
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }

      const savedTs = localStorage.getItem('jev_typesafe_key') || '';
      const savedGemini = localStorage.getItem('jev_gemini_key') || '';
      setTypesafeKey(savedTs);
      setGeminiKey(savedGemini);

      // Model evaluation only triggers manually when the user clicks Run
    }
    init();
  }, []);

  const triggerInitialEval = async () => {
    setIsLoading(true);
    try {
      const res = await runEvaluation({
        text_to_judge: DEFAULT_PRESET.text_to_judge,
        questions: DEFAULT_PRESET.questions,
        model: 'jev-1.13.0',
        compare_with_llm: true,
        llm_model: 'gemini-3.5-flash-lite',
        custom_system_prompt: customSystemPrompt,
        custom_user_prompt: customUserPrompt
      });
      setResult(res);
    } catch (e) {
      console.warn('Initial eval error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const p = presets.find((item) => item.id === id);
    if (p) {
      setTextToJudge(p.text_to_judge);
      setQuestions(p.questions);
      setResult(null);
    }
  };

  const handleResetExample = () => {
    const p = presets.find((item) => item.id === selectedPresetId) || DEFAULT_PRESET;
    setTextToJudge(p.text_to_judge);
    setQuestions(p.questions);
    setResult(null);
  };

  const handleRun = async () => {
    if (!textToJudge.trim()) {
      alert('Please provide scenario context / text to judge.');
      return;
    }
    if (questions.length === 0) {
      alert('Please configure at least one question.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await runEvaluation({
        text_to_judge: textToJudge,
        questions,
        model,
        compare_with_llm: compareWithLLM,
        llm_model: selectedLLM,
        typesafe_api_key: typesafeKey.trim() || undefined,
        gemini_api_key: geminiKey.trim() || undefined,
        custom_system_prompt: customSystemPrompt,
        custom_user_prompt: customUserPrompt
      });
      setResult(res);
      setBackendOnline(true);
    } catch (err: any) {
      console.error('Run failed:', err);
      alert(`Evaluation error: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportConfig = () => {
    const configData = {
      model,
      compare_with_llm: compareWithLLM,
      selected_llm: selectedLLM,
      text_to_judge: textToJudge,
      questions,
      custom_system_prompt: customSystemPrompt,
      custom_user_prompt: customUserPrompt
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jev_benchmark_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (imported.text_to_judge) setTextToJudge(imported.text_to_judge);
          if (imported.questions && Array.isArray(imported.questions)) setQuestions(imported.questions);
          if (imported.model) setModel(imported.model);
          if (imported.custom_system_prompt) setCustomSystemPrompt(imported.custom_system_prompt);
          if (imported.custom_user_prompt) setCustomUserPrompt(imported.custom_user_prompt);
          setResult(null);
        } catch {
          alert('Invalid JSON configuration file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const currentPreset = presets.find((p) => p.id === selectedPresetId) || DEFAULT_PRESET;
  const estimatedTokens = Math.max(30, Math.floor(textToJudge.length / 4) + questions.length * 25);
  const hasLiveKeys = !!(typesafeKey || geminiKey);

  return (
    <div className="min-h-screen bg-snssquare-pattern text-slate-900 flex selection:bg-blue-100 selection:text-blue-900">
      {/* 1. LEFT SIDEBAR: Sticky SNS SQUARE Logo, Use Cases & Token Status (Single Toggle) */}
      <Sidebar
        presets={presets}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        backendOnline={backendOnline}
        hasLiveKeys={hasLiveKeys}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Clean App Bar */}
        <header className="h-16 px-6 lg:px-8 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
              Agentic Workbench
            </span>
            <span className="text-sm font-extrabold text-slate-900 truncate">
              {currentPreset.title}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Jev 1.13 vs Gemini 3.5</span>
            </div>

            <button
              type="button"
              onClick={() => setIsKeyModalOpen(true)}
              className="py-1 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Key className="w-3 h-3 text-amber-500" />
              <span>Keys</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Body with Clean Spacings */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Prominent Page Heading Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Agentic Workbench
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  SNS SQUARE · Dual Architecture Playground
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                Jev vs Generative LLM Benchmark
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-right">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Selected Use Case
                </span>
                <span className="text-xs font-black text-slate-800 flex items-center justify-end gap-1.5">
                  <span>{currentPreset.title}</span>
                  {currentPreset.version_tag && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {currentPreset.version_tag}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Crisp Section 1 (TOP): EDITABLE DUAL INPUT STUDIO & SCENARIOS */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                1. Dual Input Formulation & State Customization
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                Customize scenario state and questions below · Run on demand
              </span>
            </div>

            <InputStudio
              scenarioTitle={currentPreset.title}
              scenarioDescription={currentPreset.description}
              textToJudge={textToJudge}
              onChangeText={setTextToJudge}
              onReset={handleResetExample}
              questions={questions}
              onChangeQuestions={setQuestions}
              onRun={handleRun}
              isLoading={isLoading}
              onOpenApiModal={() => setIsApiModalOpen(true)}
              onOpenPreviewModal={() => setIsPreviewModalOpen(true)}
              estimatedTokens={estimatedTokens}
              customSystemPrompt={customSystemPrompt}
              onChangeSystemPrompt={setCustomSystemPrompt}
              customUserPrompt={customUserPrompt}
              onChangeUserPrompt={setCustomUserPrompt}
              selectedLLM={selectedLLM}
              onChangeSelectedLLM={setSelectedLLM}
              hasImage={currentPreset.has_image}
              imageUrl={currentPreset.image_url}
              versionTag={currentPreset.version_tag}
            />
          </section>

          {/* Crisp Section 2 (BELOW): VERTICALLY ALIGNED COMPARISON & CHARTS */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                2. Output & Performance Benchmark
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                Side-by-side synchronized comparison per question
              </span>
            </div>

            <DualOutputView
              result={result}
              isLoading={isLoading}
              questions={questions}
              textToJudge={textToJudge}
              onExportConfig={handleExportConfig}
              onImportConfig={handleImportConfig}
            />
          </section>
        </main>
      </div>

      {/* MODALS */}
      <ApiModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        textToJudge={textToJudge}
        questions={questions}
        model={model}
      />

      <RequestPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        textToJudge={textToJudge}
        questions={questions}
        model={model}
        compareWithLLM={compareWithLLM}
        selectedLLM={selectedLLM}
        customSystemPrompt={customSystemPrompt}
        customUserPrompt={customUserPrompt}
      />

      <KeySettingsModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        typesafeKey={typesafeKey}
        setTypesafeKey={setTypesafeKey}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
      />
    </div>
  );
}
