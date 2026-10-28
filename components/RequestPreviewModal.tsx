'use client';

import React from 'react';
import { X, Eye, FileJson } from 'lucide-react';
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
}

export default function RequestPreviewModal({
  isOpen,
  onClose,
  textToJudge,
  imagePreview = null,
  questions,
  model = 'jev-1.13.0',
  compareWithLLM = true,
  selectedLLM = 'gemini-3.5-flash-lite'
}: RequestPreviewModalProps) {
  if (!isOpen) return null;

  const payload = {
    model,
    compare_with_llm: compareWithLLM,
    llm_model: selectedLLM,
    text_to_judge: textToJudge,
    image_attached: !!imagePreview,
    questions: questions.map((q) => ({
      id: q.id,
      key: q.key,
      type: q.type,
      question: q.question,
      options: q.options,
      score_min: q.score_min,
      score_max: q.score_max
    }))
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[#222f49] bg-[#0c121e] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-[#1b253b] flex items-center justify-between bg-[#0e1626]">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200">Raw Request Payload Preview</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-400">
            This structured JSON object is transmitted to the decision model inference endpoint:
          </p>
          <pre className="p-4 rounded-xl bg-[#080d17] border border-[#1b253b] text-xs mono-font text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
