'use client';

import React from 'react';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { QuestionConfig, QuestionType, QuestionOption } from '@/types';

interface QuestionsBuilderProps {
  questions: QuestionConfig[];
  onChange: (questions: QuestionConfig[]) => void;
  theme?: 'dark' | 'light';
}

export default function QuestionsBuilder({ questions, onChange, theme = 'dark' }: QuestionsBuilderProps) {
  const maxQuestions = 8;
  const isLight = theme === 'light';

  const addQuestion = (type: QuestionType) => {
    if (questions.length >= maxQuestions) return;

    let newQ: QuestionConfig;
    const id = `q_${Date.now()}`;

    if (type === 'choice') {
      newQ = {
        id,
        type: 'choice',
        key: 'verdict',
        question: 'Choose the most appropriate classification.',
        options: [
          { label: 'Supported', description: 'Every claim is backed by the reference.' },
          { label: 'Contradicted', description: 'A claim conflicts with the reference.' },
          { label: 'Insufficient evidence', description: 'The reference does not cover a claim.' }
        ]
      };
    } else if (type === 'yes_no') {
      newQ = {
        id,
        type: 'yes_no',
        key: 'direct_address',
        question: 'Does candidate_answer directly address the user_question?',
        options: []
      };
    } else if (type === 'score') {
      newQ = {
        id,
        type: 'score',
        key: 'score_rating',
        question: 'Rate the quality of the answer from 1 to 5.',
        options: [],
        score_min: 1.0,
        score_max: 5.0
      };
    } else {
      newQ = {
        id,
        type: 'box',
        key: 'bounding_box',
        question: 'Locate the primary item in the image.',
        options: []
      };
    }

    onChange([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<QuestionConfig>) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const addOption = (qId: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const newOptions: QuestionOption[] = [
      ...q.options,
      { label: `Option ${q.options.length + 1}`, description: 'Description for this option' }
    ];
    updateQuestion(qId, { options: newOptions });
  };

  const updateOption = (qId: string, optIndex: number, field: 'label' | 'description', val: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const newOpts = [...q.options];
    newOpts[optIndex] = { ...newOpts[optIndex], [field]: val };
    updateQuestion(qId, { options: newOpts });
  };

  const removeOption = (qId: string, optIndex: number) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const newOpts = q.options.filter((_, idx) => idx !== optIndex);
    updateQuestion(qId, { options: newOpts });
  };

  const getTypeBadge = (type: QuestionType) => {
    switch (type) {
      case 'choice':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-teal-500/15 text-teal-600 dark:text-teal-300 border border-teal-500/30">
            CHOICE
          </span>
        );
      case 'yes_no':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
            YES/NO
          </span>
        );
      case 'score':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
            SCORE
          </span>
        );
      case 'box':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
            BOX
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center text-xs font-bold">
            2
          </div>
          <h2 className={`text-sm font-semibold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
            Questions
          </h2>
        </div>

        <span className="text-xs text-slate-400 mono-font">
          {questions.length} / {maxQuestions}
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((q) => (
          <div
            key={q.id}
            className={`rounded-xl border p-3.5 space-y-3 transition-all ${
              isLight
                ? 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                : 'bg-[#090e18] border-[#1f2a40] hover:border-[#2b3a58]'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {getTypeBadge(q.type)}
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                  placeholder="Enter question to judge..."
                  className={`bg-transparent text-xs font-medium focus:outline-none flex-1 w-72 ${
                    isLight ? 'text-slate-800' : 'text-slate-200'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={() => removeQuestion(q.id)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                title="Remove question"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CHOICE specific details */}
            {q.type === 'choice' && (
              <div className={`space-y-2 pt-1 border-t ${isLight ? 'border-slate-100' : 'border-[#182338]'}`}>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded border mono-font text-[11px] shrink-0 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-[#131b2c] border-[#23314c] text-slate-400'
                    }`}
                  >
                    {q.key || 'verdict'}
                  </span>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                    className={`flex-1 border rounded px-2.5 py-1 text-xs focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#101726] border-[#222f47] text-slate-300'
                    }`}
                  />
                </div>

                {/* Options List */}
                <div className={`space-y-1.5 pl-2 border-l-2 ${isLight ? 'border-slate-200' : 'border-[#1e2a42]'}`}>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) => updateOption(q.id, optIdx, 'label', e.target.value)}
                        placeholder="Option label"
                        className={`w-32 border rounded px-2 py-1 font-medium text-xs focus:outline-none ${
                          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#121a2c] border-[#23324f] text-slate-200'
                        }`}
                      />
                      <input
                        type="text"
                        value={opt.description}
                        onChange={(e) => updateOption(q.id, optIdx, 'description', e.target.value)}
                        placeholder="Option criteria description"
                        className={`flex-1 border rounded px-2.5 py-1 text-xs focus:outline-none ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-[#0f1625] border-[#1e2b44] text-slate-400'
                        }`}
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(q.id, optIdx)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="text-[11px] font-semibold text-emerald-500 hover:underline transition-colors pt-1 flex items-center gap-1 cursor-pointer"
                  >
                    + Add option
                  </button>
                </div>
              </div>
            )}

            {/* SCORE specific details */}
            {q.type === 'score' && (
              <div className={`flex items-center gap-3 pt-1 border-t text-xs ${isLight ? 'border-slate-100' : 'border-[#182338]'}`}>
                <span className="text-slate-400">Scale range:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={q.score_min || 1}
                    onChange={(e) => updateQuestion(q.id, { score_min: Number(e.target.value) })}
                    className={`w-12 border rounded px-2 py-0.5 text-center ${
                      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#101726] border-[#222f47] text-slate-200'
                    }`}
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="number"
                    value={q.score_max || 5}
                    onChange={(e) => updateQuestion(q.id, { score_max: Number(e.target.value) })}
                    className={`w-12 border rounded px-2 py-0.5 text-center ${
                      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#101726] border-[#222f47] text-slate-200'
                    }`}
                  />
                </div>
                <span className="text-[11px] text-slate-400">Single-pass calibrated scalar regression</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Question Toolbar */}
      {questions.length < maxQuestions && (
        <div className="flex items-center flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => addQuestion('yes_no')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0e1422] hover:bg-[#141c2e] border-[#202c44] text-slate-300 hover:text-emerald-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> + Yes/No
          </button>
          <button
            type="button"
            onClick={() => addQuestion('choice')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0e1422] hover:bg-[#141c2e] border-[#202c44] text-slate-300 hover:text-teal-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> + Choice
          </button>
          <button
            type="button"
            onClick={() => addQuestion('score')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0e1422] hover:bg-[#141c2e] border-[#202c44] text-slate-300 hover:text-amber-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> + Score
          </button>
          <button
            type="button"
            onClick={() => addQuestion('box')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0e1422] hover:bg-[#141c2e] border-[#202c44] text-slate-300 hover:text-indigo-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> + Box
          </button>
        </div>
      )}
    </div>
  );
}
