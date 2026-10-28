'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  Coins,
  Cpu,
  CheckCircle2,
  AlertCircle,
  FileDown,
  FileUp,
  BarChart3,
  Code2,
  Scale
} from 'lucide-react';
import { EvaluationResponse, QuestionConfig } from '@/types';

interface JudgmentViewProps {
  result: EvaluationResponse | null;
  isLoading: boolean;
  questions: QuestionConfig[];
  onExportConfig: () => void;
  onImportConfig: () => void;
  theme?: 'dark' | 'light';
}

export default function JudgmentView({
  result,
  isLoading,
  questions,
  onExportConfig,
  onImportConfig,
  theme = 'dark'
}: JudgmentViewProps) {
  const [activeTab, setActiveTab] = useState<'comparison' | 'jev' | 'llm' | 'raw'>('comparison');
  const isLight = theme === 'light';

  const jev = result?.jev_result;
  const llm = result?.llm_result;
  const delta = result?.comparison_delta;

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border transition-all overflow-hidden shadow-xl ${
        isLight
          ? 'bg-white border-slate-200 shadow-slate-200/50'
          : 'bg-[#0a0e1a] border-[#1c273d] shadow-black/40'
      }`}
    >
      {/* Header */}
      <div
        className={`px-5 py-3.5 border-b flex items-center justify-between transition-colors ${
          isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-[#0d1424] border-[#1a253a]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center text-xs font-bold">
            3
          </div>
          <h2 className={`text-sm font-semibold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
            Your judgment
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <div
              className={`flex items-center p-0.5 rounded-lg border text-[11px] ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#121a2c] border-[#222f49]'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveTab('comparison')}
                className={`px-2.5 py-1 rounded transition-colors font-medium cursor-pointer ${
                  activeTab === 'comparison'
                    ? isLight
                      ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Comparison
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('jev')}
                className={`px-2 py-1 rounded transition-colors font-medium cursor-pointer ${
                  activeTab === 'jev'
                    ? isLight
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'bg-[#1e2a42] text-slate-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Jev Model
              </button>
              {llm && (
                <button
                  type="button"
                  onClick={() => setActiveTab('llm')}
                  className={`px-2 py-1 rounded transition-colors font-medium cursor-pointer ${
                    activeTab === 'llm'
                      ? isLight
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'bg-[#1e2a42] text-slate-200'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Gemini Baseline
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTab('raw')}
                className={`px-2 py-1 rounded transition-colors font-medium cursor-pointer ${
                  activeTab === 'raw'
                    ? isLight
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'bg-[#1e2a42] text-slate-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Raw JSON
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{jev?.metrics?.is_live_api ? 'Live TypeSafe API' : 'Real Jev output'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Evaluating with Jev & Google Gemini...
              </p>
              <p className="text-xs text-slate-400 mt-1">Calibrating non-autoregressive decision distributions</p>
            </div>
          </div>
        ) : !result ? (
          /* Empty State matching reference image */
          <div className="h-full flex flex-col items-center justify-center text-center py-24 px-6 max-w-md mx-auto">
            <h3 className={`text-base font-semibold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              A question in. A judgment out.
            </h3>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              Your result appears here with the response returned by Jev. Run the example to see how the question and
              answer options shape the judgment.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* COMPARISON METRICS DASHBOARD */}
            {activeTab === 'comparison' && delta && llm && jev && (
              <div
                className={`rounded-xl border p-4 space-y-4 shadow-md ${
                  isLight
                    ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white'
                    : 'border-emerald-500/30 bg-gradient-to-b from-[#101828] to-[#0c121e]'
                }`}
              >
                <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-[#1f2b42]'}`}>
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-500" />
                    <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      Jev vs Google Gemini Benchmark
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                      {delta.speedup_ratio}x Faster
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/10 text-cyan-600 border border-cyan-500/30">
                      {delta.token_savings_percent}% Fewer Tokens
                    </span>
                  </div>
                </div>

                {/* 3 Metric Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Latency */}
                  <div className={`rounded-xl border p-3 space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-[#080d17] border-[#1b253b]'}`}>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        Latency
                      </span>
                      <span className="text-emerald-500 font-bold mono-font text-[11px]">
                        -{Math.round((1 - jev.metrics.latency_ms / Math.max(1, llm.metrics.latency_ms)) * 100)}%
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-500 font-semibold">Jev Model</span>
                          <span className="text-emerald-500 font-bold mono-font">{jev.metrics.latency_ms} ms</span>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden mt-1 ${isLight ? 'bg-slate-100' : 'bg-[#182337]'}`}>
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(5, (jev.metrics.latency_ms / llm.metrics.latency_ms) * 100))}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">{llm.model_name}</span>
                          <span className="text-slate-400 mono-font">{llm.metrics.latency_ms} ms</span>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden mt-1 ${isLight ? 'bg-slate-100' : 'bg-[#182337]'}`}>
                          <div className="bg-slate-400 h-full rounded-full w-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Token Consumption */}
                  <div className={`rounded-xl border p-3 space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-[#080d17] border-[#1b253b]'}`}>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                        Token Footprint
                      </span>
                      <span className="text-cyan-500 font-bold mono-font text-[11px]">
                        -{delta.token_savings_percent}%
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-cyan-600 font-semibold">Jev</span>
                          <span className="text-cyan-600 font-bold mono-font">{jev.metrics.total_tokens} tok</span>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden mt-1 ${isLight ? 'bg-slate-100' : 'bg-[#182337]'}`}>
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(5, (jev.metrics.total_tokens / llm.metrics.total_tokens) * 100))}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Gemini</span>
                          <span className="text-slate-400 mono-font">{llm.metrics.total_tokens} tok</span>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden mt-1 ${isLight ? 'bg-slate-100' : 'bg-[#182337]'}`}>
                          <div className="bg-slate-400 h-full rounded-full w-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Cost */}
                  <div className={`rounded-xl border p-3 space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-[#080d17] border-[#1b253b]'}`}>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        Cost / Run
                      </span>
                      <span className="text-amber-500 font-bold mono-font text-[11px]">
                        -{delta.cost_savings_percent}%
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-amber-600 font-semibold">Jev</span>
                        <span className="text-amber-600 font-bold mono-font">${jev.metrics.estimated_cost_usd}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Gemini</span>
                        <span className="text-slate-400 mono-font">${llm.metrics.estimated_cost_usd}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 pt-0.5">
                        Zero generative output token bloat on Jev.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* QUESTION BY QUESTION VERDICT RESULTS */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Evaluated Judgments
              </h4>

              {jev?.judgments?.map((j) => {
                const llmMatch = llm?.judgments?.find((item) => item.question_id === j.question_id);

                return (
                  <div
                    key={j.question_id}
                    className={`rounded-xl border p-4 space-y-3 transition-all ${
                      isLight
                        ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                        : 'bg-[#0c121e] border-[#1f2b42] hover:border-[#2a3a58]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold mono-font border ${
                              isLight
                                ? 'bg-white border-slate-300 text-slate-700'
                                : 'bg-[#141d30] border-[#23324f] text-slate-300'
                            }`}
                          >
                            {j.question_key}
                          </span>
                          <span className={`text-xs font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                            {questions.find((q) => q.id === j.question_id)?.question || j.question_key}
                          </span>
                        </div>
                      </div>

                      {/* Jev Verdict Pill */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center gap-1.5 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {j.verdict}
                        </span>
                      </div>
                    </div>

                    {/* Calibrated Probabilities if choice */}
                    {j.probabilities && (
                      <div className={`space-y-1.5 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-[#182338]'}`}>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Calibrated Class Probabilities</span>
                          <span className="mono-font text-emerald-500 font-semibold">
                            {(j.confidence * 100).toFixed(1)}% confidence
                          </span>
                        </div>
                        <div className="space-y-1">
                          {Object.entries(j.probabilities).map(([label, prob]) => (
                            <div key={label} className="space-y-0.5">
                              <div className={`flex justify-between text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                                <span>{label}</span>
                                <span className="mono-font">{(prob * 100).toFixed(1)}%</span>
                              </div>
                              <div className={`w-full h-1 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-[#141c2c]'}`}>
                                <div
                                  className={`h-full rounded-full ${
                                    label === j.verdict ? 'bg-emerald-500' : 'bg-slate-400'
                                  }`}
                                  style={{ width: `${Math.max(2, prob * 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Google Gemini Comparison Snippet */}
                    {activeTab === 'comparison' && llmMatch && (
                      <div
                        className={`pt-2 border-t flex items-center justify-between text-xs p-2.5 rounded-lg border ${
                          isLight
                            ? 'bg-white border-slate-200 text-slate-600'
                            : 'bg-[#080d17] border-[#1b253b] text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-cyan-500">Google Gemini:</span>
                          <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                            {llmMatch.verdict}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mono-font">Autoregressively generated</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RAW JSON VIEW */}
            {activeTab === 'raw' && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400">Raw Jev Response Object</h4>
                <pre
                  className={`p-3.5 rounded-xl border text-xs mono-font overflow-x-auto leading-relaxed ${
                    isLight ? 'bg-slate-900 text-emerald-300 border-slate-800' : 'bg-[#080d17] border-[#1b253b] text-emerald-300'
                  }`}
                >
                  {JSON.stringify(jev, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`px-5 py-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0e1a] border-[#1b253b]'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onExportConfig}
            className="text-emerald-500 hover:underline font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export configuration</span>
          </button>
          <button
            type="button"
            onClick={onImportConfig}
            className="text-emerald-500 hover:underline font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Import configuration</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Model judgment, not a guarantee. Review the result before using it to trigger an action.
        </p>
      </div>
    </div>
  );
}
