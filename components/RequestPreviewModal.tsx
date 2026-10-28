'use client';

import React, { useState } from 'react';
import { X, Eye, FileJson, Sparkles, Zap, Copy, Check } from 'lucide-react';
import { QuestionConfig } from '@/types';

interface RequestPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  textToJudge: string;
  imagePreview?: string | null;
  questions: QuestionConfig[];
  model?: string;
  compareWithLLM?: boolean;
  selectedLLM?: string;
  customSystemPrompt?: string;
  customUserPrompt?: string;
}

export default function RequestPreviewModal({
  isOpen,
  onClose,
  textToJudge,
  imagePreview = null,
  questions,
  model = 'jev-1.13.0',
  compareWithLLM = true,
  selectedLLM = 'gemini-3.5-flash-lite',
  customSystemPrompt = '',
  customUserPrompt = ''
}: RequestPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'both' | 'jev' | 'gemini'>('both');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Build Jev native request payload (SystemOne API spec)
  const jevQuestionsObj: Record<string, any> = {};
  questions.forEach((q) => {
    const qKey = q.key || `q_${q.id}`;
    if (q.type === 'choice') {
      const criteria: Record<string, string> = {};
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt) => {
          criteria[opt.label] = opt.description?.trim() || opt.label;
        });
      } else {
        criteria['Supported'] = 'Supported';
        criteria['Contradicted'] = 'Contradicted';
      }
      jevQuestionsObj[qKey] = {
        type: 'choice',
        instructions: q.question,
        criteria
      };
    } else if (q.type === 'yes_no') {
      jevQuestionsObj[qKey] = {
        type: 'noul',
        instructions: q.question
      };
    } else if (q.type === 'score') {
      const criteriaList =
        q.options && q.options.length >= 2
          ? q.options.map((opt) => (opt.description ? `${opt.label}: ${opt.description}` : opt.label))
          : ['Level 1: Low', 'Level 2: Moderate', 'Level 3: Critical'];
      jevQuestionsObj[qKey] = {
        type: 'score',
        instructions: q.question,
        criteria: criteriaList
      };
    } else {
      jevQuestionsObj[qKey] = {
        type: 'box',
        instructions: q.question
      };
    }
  });

  const jevPayload = {
    endpoint: 'POST https://jevmodel.org/v1/systemone',
    headers: {
      Authorization: 'Bearer $JEVMODEL_API_KEY',
      'Content-Type': 'application/json'
    },
    body: {
      model: model || 'jev-latest',
      state: textToJudge,
      questions: jevQuestionsObj
    }
  };

  // 2. Build Gemini generative LLM request payload
  const formattedQuestionsList = questions.map((q) => ({
    id: q.id,
    key: q.key,
    type: q.type,
    question: q.question,
    options: q.options && q.options.length > 0 ? q.options.map((o) => `${o.label}${o.description ? ` (${o.description})` : ''}`) : undefined,
    score_scale: q.type === 'score' ? `${q.score_min ?? 0} to ${q.score_max ?? 2}` : undefined
  }));

  const userEnvelopeResolved = (customUserPrompt || 'TICKET / TEXT CONTEXT TO EVALUATE:\n{context}\n\nQUESTIONS TO JUDGE:\n{questions}')
    .replace('{context}', textToJudge)
    .replace('{questions}', JSON.stringify(formattedQuestionsList, null, 2));

  const geminiPayload = {
    endpoint: `POST https://generativelanguage.googleapis.com/v1beta/models/${selectedLLM}:generateContent?key=$GEMINI_API_KEY`,
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      system_instruction: {
        parts: [
          {
            text:
              customSystemPrompt ||
              'You are an expert AI evaluation model and judge. You will analyze the provided ticket or text context and evaluate each question thoroughly.'
          }
        ]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userEnvelopeResolved }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.0
      }
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Live Dual Request Payload Preview</h3>
              <p className="text-[11px] text-slate-500">
                Exact inputs dispatched to Jev 1.13 and Gemini 3.5 in a single parallel evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center bg-slate-200/70 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Side-by-Side (Both)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('jev')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'jev' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Jev Only
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gemini')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'gemini' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Gemini LLM Only
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/40">
          <div className={`grid grid-cols-1 ${activeTab === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-5`}>
            {/* JEV COLUMN */}
            {(activeTab === 'both' || activeTab === 'jev') && (
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 space-y-3 shadow-2xs flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      J
                    </span>
                    <div>
                      <span className="text-xs font-black text-slate-900">Jev 1.13 SystemOne Call</span>
                      <p className="text-[10px] text-slate-500 font-mono">Discriminative Classification</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(JSON.stringify(jevPayload, null, 2), 'jev')}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'jev' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'jev' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Endpoint & Auth:</span>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-700 break-all">
                    {jevPayload.endpoint}
                  </div>
                </div>

                <div className="space-y-1 text-xs flex-1 flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Request Body (JSON):</span>
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed flex-1 max-h-96">
                    {JSON.stringify(jevPayload.body, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* GEMINI COLUMN */}
            {(activeTab === 'both' || activeTab === 'gemini') && (
              <div className="rounded-2xl border border-blue-200 bg-white p-4 space-y-3 shadow-2xs flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900">Google Gemini LLM Call</span>
                      <p className="text-[10px] text-slate-500 font-mono">Generative Completion API</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(JSON.stringify(geminiPayload, null, 2), 'gemini')}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'gemini' ? <Check className="w-3 h-3 text-blue-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'gemini' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Endpoint & Model:</span>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-700 break-all">
                    {geminiPayload.endpoint}
                  </div>
                </div>

                <div className="space-y-1 text-xs flex-1 flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Full Resolved Payload (System Prompt + Envelope + Context + Questions):
                  </span>
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-blue-300 font-mono text-[11px] overflow-x-auto leading-relaxed flex-1 max-h-96">
                    {JSON.stringify(geminiPayload.body, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
