'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Zap,
  Code,
  Eye,
  Plus,
  Trash2,
  X,
  FileText,
  Sliders,
  Settings2,
  Check,
  ChevronDown,
  Layers,
  MessageSquare,
  Bot
} from 'lucide-react';
import { QuestionConfig, QuestionType } from '@/types';

interface InputStudioProps {
  scenarioTitle: string;
  scenarioDescription: string;
  textToJudge: string;
  onChangeText: (text: string) => void;
  onReset: () => void;
  questions: QuestionConfig[];
  onChangeQuestions: (questions: QuestionConfig[]) => void;
  onRun: () => void;
  isLoading: boolean;
  onOpenApiModal: () => void;
  onOpenPreviewModal: () => void;
  estimatedTokens: number;
  customSystemPrompt?: string;
  onChangeSystemPrompt?: (prompt: string) => void;
  customUserPrompt?: string;
  onChangeUserPrompt?: (prompt: string) => void;
  selectedLLM?: string;
  onChangeSelectedLLM?: (model: string) => void;
  hasImage?: boolean;
  imageUrl?: string;
  versionTag?: string;
}

export default function InputStudio({
  scenarioTitle = 'Active Scenario',
  scenarioDescription = '',
  textToJudge = '',
  onChangeText,
  onReset,
  questions = [],
  onChangeQuestions,
  onRun,
  isLoading = false,
  onOpenApiModal,
  onOpenPreviewModal,
  estimatedTokens = 40,
  customSystemPrompt = '',
  onChangeSystemPrompt,
  customUserPrompt = '',
  onChangeUserPrompt,
  selectedLLM = 'gemini-3.5-flash-lite',
  onChangeSelectedLLM,
  hasImage = false,
  imageUrl = '',
  versionTag = ''
}: InputStudioProps) {
  const [activeInputTab, setActiveInputTab] = useState<'both' | 'jev' | 'gemini'>('both');

  const safeSystemPrompt = customSystemPrompt || '';
  const safeUserPrompt = customUserPrompt || '';
  const safeTextToJudge = textToJudge || '';

  // Add Question handlers
  const addQuestion = (type: QuestionType) => {
    const id = `q_${Date.now()}`;
    let newQ: QuestionConfig;

    if (type === 'choice') {
      newQ = {
        id,
        type: 'choice',
        key: `choice_${questions.length + 1}`,
        question: 'Select the best category for this item.',
        options: [
          { label: 'Category A', description: 'Criteria for A' },
          { label: 'Category B', description: 'Criteria for B' }
        ]
      };
    } else if (type === 'yes_no') {
      newQ = {
        id,
        type: 'yes_no',
        key: `check_${questions.length + 1}`,
        question: 'Does this message require immediate attention?',
        options: []
      };
    } else if (type === 'box') {
      newQ = {
        id,
        type: 'box',
        key: `box_${questions.length + 1}`,
        question: 'the element or button to locate in the screenshot',
        options: []
      };
    } else {
      newQ = {
        id,
        type: 'score',
        key: `severity_${questions.length + 1}`,
        question: 'Rate the severity level from low to high.',
        options: [
          { label: 'Low', description: 'Minimal' },
          { label: 'Moderate', description: 'Noticeable' },
          { label: 'High', description: 'Critical' }
        ],
        score_min: 0.0,
        score_max: 2.0
      };
    }

    onChangeQuestions([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    onChangeQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<QuestionConfig>) => {
    onChangeQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const addOption = (questionId: string) => {
    const q = questions.find((item) => item.id === questionId);
    if (!q) return;
    const newOptions = [...(q.options || []), { label: `Option ${(q.options?.length || 0) + 1}`, description: '' }];
    updateQuestion(questionId, { options: newOptions });
  };

  const removeOption = (questionId: string, optIndex: number) => {
    const q = questions.find((item) => item.id === questionId);
    if (!q || !q.options || q.options.length <= 2) return;
    const newOptions = q.options.filter((_, idx) => idx !== optIndex);
    updateQuestion(questionId, { options: newOptions });
  };

  const updateOption = (questionId: string, optIndex: number, label: string, description: string) => {
    const q = questions.find((item) => item.id === questionId);
    if (!q || !q.options) return;
    const newOptions = q.options.map((opt, idx) => (idx === optIndex ? { label, description } : opt));
    updateQuestion(questionId, { options: newOptions });
  };

  const llmPromptTokens = Math.max(
    80,
    Math.floor((safeSystemPrompt.length + safeUserPrompt.length + safeTextToJudge.length) / 4) + 120
  );

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 lg:p-8 card-elevation space-y-6">
      {/* Top Header: Scenario Title & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80">
              Scenario
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">{scenarioTitle}</h2>
          </div>
          <p className="text-xs text-slate-500">{scenarioDescription}</p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200 text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveInputTab('both')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeInputTab === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dual View
          </button>
          <button
            type="button"
            onClick={() => setActiveInputTab('jev')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeInputTab === 'jev' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jev 1.13 ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveInputTab('gemini')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeInputTab === 'gemini' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gemini 3.5 Prompt
          </button>
        </div>
      </div>

      {/* 1. SHARED SCENARIO CONTEXT (USER EDITABLE STATE) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Shared Scenario Context (Ticket / State to Evaluate)</span>
          </label>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset text</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 transition-all shadow-2xs">
          <textarea
            value={safeTextToJudge}
            onChange={(e) => onChangeText(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-xs text-slate-800 mono-font focus:outline-none resize-y leading-relaxed"
            placeholder="Enter customer support ticket or document state..."
          />
          <div className="flex justify-between items-center pt-2 border-t border-slate-200/70 text-[11px] text-slate-400 mono-font">
            <span>{safeTextToJudge.length} chars</span>
            <span className="font-semibold text-slate-600">
              ~{Math.max(20, Math.floor(safeTextToJudge.length / 4))} state tokens
            </span>
          </div>
        </div>

        {/* Multimodal Image Attachment / Dropzone (Matches Jev Playground 1.14) */}
        {(hasImage || versionTag === '1.14' || safeTextToJudge.includes('sample-')) && (
          <div className="space-y-2 pt-1">
            {/* Sample Image Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 shadow-2xs">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold">
                IMG
              </span>
              <span>{safeTextToJudge.includes('sample-settings') ? 'sample-settings' : 'sample-checkout'}</span>
              <button type="button" className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Dropzone Box */}
            <div className="border border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40 rounded-2xl p-4 transition-all flex items-center justify-between gap-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Add an image — PNG or JPEG</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      1.14
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Drop it here or click. Ask choice, yes/no or score questions about it, or add a Box question to locate something.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. DUAL INPUT CUSTOMIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= COLUMN 1: JEV 1.13 TYPED QUESTIONS ================= */}
        {(activeInputTab === 'both' || activeInputTab === 'jev') && (
          <div
            className={`${
              activeInputTab === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'
            } rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-5 space-y-4`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  J
                </span>
                <span className="text-xs font-extrabold text-slate-900">Jev 1.13 Primitives</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Zero Output Tokens
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5 hover:border-slate-300 transition-all"
                >
                  {/* Type Selector & Key */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={q.type}
                        onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 cursor-pointer focus:outline-none"
                      >
                        <option value="choice">CHOICE</option>
                        <option value="yes_no">NOUL (YES/NO)</option>
                        <option value="score">SCORE RUBRIC</option>
                        <option value="box">BOX (GROUNDING)</option>
                      </select>

                      <input
                        type="text"
                        value={q.key}
                        onChange={(e) => updateQuestion(q.id, { key: e.target.value })}
                        className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] mono-font focus:outline-none w-28"
                        placeholder="key"
                      />
                    </div>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                    placeholder="Question prompt..."
                  />

                  {/* CHOICE OPTIONS */}
                  {q.type === 'choice' && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>Options:</span>
                        <button
                          type="button"
                          onClick={() => addOption(q.id)}
                          className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 cursor-pointer text-[11px]"
                        >
                          <Plus className="w-3 h-3" /> Add Choice
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {q.options?.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) => updateOption(q.id, optIdx, e.target.value, opt.description)}
                              placeholder={`Option ${optIdx + 1}`}
                              className="w-1/3 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={opt.description}
                              onChange={(e) => updateOption(q.id, optIdx, opt.label, e.target.value)}
                              placeholder="Description..."
                              className="flex-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-none"
                            />
                            {q.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(q.id, optIdx)}
                                className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SCORE RUBRIC */}
                  {q.type === 'score' && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>Rubric Levels:</span>
                        <button
                          type="button"
                          onClick={() => addOption(q.id)}
                          className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-0.5 cursor-pointer text-[11px]"
                        >
                          <Plus className="w-3 h-3" /> Add Level
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {q.options?.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-1.5">
                            <span className="w-5 text-center text-[10px] font-black text-amber-800 bg-amber-50 rounded py-0.5 border border-amber-200">
                              {optIdx}
                            </span>
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) => updateOption(q.id, optIdx, e.target.value, opt.description)}
                              className="w-1/3 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={opt.description}
                              onChange={(e) => updateOption(q.id, optIdx, opt.label, e.target.value)}
                              placeholder="Criteria..."
                              className="flex-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-none"
                            />
                            {q.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(q.id, optIdx)}
                                className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Question Creator Toolbar */}
            <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-emerald-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Add Typed Question:
              </span>
              <button
                type="button"
                onClick={() => addQuestion('yes_no')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 text-slate-700 text-[11px] font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>+ Yes/No</span>
              </button>
              <button
                type="button"
                onClick={() => addQuestion('choice')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 text-slate-700 text-[11px] font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>+ Choice</span>
              </button>
              <button
                type="button"
                onClick={() => addQuestion('score')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 text-slate-700 text-[11px] font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>+ Score</span>
              </button>

            </div>
          </div>
        )}

        {/* ================= COLUMN 2: GEMINI 3.5 LLM CUSTOMIZATION ================= */}
        {(activeInputTab === 'both' || activeInputTab === 'gemini') && (
          <div
            className={`${
              activeInputTab === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'
            } rounded-2xl border-2 border-blue-200/90 bg-blue-50/20 p-5 flex flex-col justify-between space-y-4 shadow-xs`}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-blue-950">Gemini Generative Prompt</span>
                    <p className="text-[10px] text-slate-500">System prompt, schema & envelope</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
                  Prompt In · Text Out
                </span>
              </div>

              {/* Model Selector */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600">Model Engine:</label>
                  <span className="text-[10px] font-bold text-blue-600">Official Google Gemini API</span>
                </div>
                <select
                  value={selectedLLM}
                  onChange={(e) => onChangeSelectedLLM?.(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite (Preview)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                </select>
              </div>

              {/* Editable System Prompt - Fully Visible Without Awkward Scrollbar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-blue-600" />
                    <span>System Prompt & Schema Instructions:</span>
                  </label>
                  <span className="text-[10px] mono-font text-blue-700 font-black bg-blue-100/70 px-2 py-0.5 rounded-md border border-blue-200">
                    ~{Math.max(30, Math.floor(safeSystemPrompt.length / 4))} prompt tokens
                  </span>
                </div>
                <textarea
                  value={safeSystemPrompt}
                  onChange={(e) => onChangeSystemPrompt?.(e.target.value)}
                  rows={14}
                  className="w-full text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-600 leading-relaxed shadow-2xs font-medium resize-y min-h-[250px]"
                  placeholder="Enter system prompt and JSON instructions for Gemini..."
                />
              </div>

              {/* Editable Prompt Envelope */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>User Prompt Envelope:</span>
                  </label>
                  <span className="text-[10px] mono-font text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                    Placeholders: {'{context}'} & {'{questions}'}
                  </span>
                </div>
                <textarea
                  value={safeUserPrompt}
                  onChange={(e) => onChangeUserPrompt?.(e.target.value)}
                  rows={4}
                  className="w-full text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-600 leading-relaxed shadow-2xs font-medium resize-y"
                  placeholder="TICKET / TEXT CONTEXT TO EVALUATE:&#10;{context}&#10;&#10;QUESTIONS TO JUDGE:&#10;{questions}"
                />
              </div>
            </div>

            {/* Token Overhead & Live Specification Card - Eliminates Empty Bottom Gap */}
            <div className="rounded-xl bg-white border border-blue-200 p-4 space-y-2.5 text-xs text-blue-950 shadow-2xs mt-2">
              <div className="flex items-center justify-between font-black">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>LLM Prompt & Generation Overhead:</span>
                </span>
                <span className="mono-font text-blue-700 font-black text-xs bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  ~{llmPromptTokens} tokens / call
                </span>
              </div>
              {/* <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] border-t border-slate-100">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold">RESPONSE MODE</span>
                  <p className="font-extrabold text-slate-800">application/json</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold">SAMPLING TEMP</span>
                  <p className="font-extrabold text-slate-800">0.0 (Deterministic)</p>
                </div>
              </div> */}

            </div>
          </div>
        )}
      </div>

      {/* 3. PRIMARY ACTION BAR */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onRun}
          disabled={isLoading}
          className="py-3 px-7 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-md shadow-slate-900/15 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running Parallel Benchmark...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Run Both Models in Parallel (Jev 1.13 vs Gemini 3.5)</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-4 text-xs">


          <button
            type="button"
            onClick={onOpenPreviewModal}
            className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
