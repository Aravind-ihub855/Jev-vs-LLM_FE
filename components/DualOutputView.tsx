'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  Cpu,
  Coins,
  CheckCircle2,
  FileDown,
  FileUp,
  Scale,
  ChevronDown,
  ChevronRight,
  Split,
  LayoutGrid,
  TrendingDown,
  BarChart3,
  Check,
  Equal,
  HelpCircle
} from 'lucide-react';
import { EvaluationResponse, QuestionConfig } from '@/types';

function getScoreMetrics(
  scoreValue?: number,
  verdict?: string,
  options?: { label: string; description?: string }[],
  scoreMin: number = 0,
  scoreMax: number = 2
) {
  const vLower = (verdict || '').toLowerCase().trim();
  let matchedIndex = -1;

  if (options && options.length > 0) {
    matchedIndex = options.findIndex((opt) => {
      const oLower = opt.label.toLowerCase().trim();
      return vLower === oLower || vLower.includes(oLower);
    });
  }

  let numVal = typeof scoreValue === 'number' ? scoreValue : null;
  if (numVal === null) {
    const numMatch = vLower.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) {
      numVal = parseFloat(numMatch[1]);
    }
  }

  let percentage = 50;
  if (matchedIndex >= 0 && options && options.length > 1) {
    percentage = (matchedIndex / (options.length - 1)) * 84 + 8;
  } else if (numVal !== null) {
    const min = scoreMin;
    const max = scoreMax > min ? scoreMax : min + 1;
    const normalized = Math.max(0, Math.min(1, (numVal - min) / (max - min)));
    percentage = normalized * 84 + 8;
  }

  const labels =
    options && options.length > 0
      ? options.map((o) => o.label)
      : [scoreMin.toString(), ((scoreMin + scoreMax) / 2).toString(), scoreMax.toString()];

  return {
    percentage: Math.round(percentage),
    labels,
    matchedIndex
  };
}

interface DualOutputViewProps {
  result: EvaluationResponse | null;
  isLoading: boolean;
  questions: QuestionConfig[];
  textToJudge: string;
  onExportConfig: () => void;
  onImportConfig: () => void;
}

export default function DualOutputView({
  result,
  isLoading,
  questions,
  textToJudge,
  onExportConfig,
  onImportConfig
}: DualOutputViewProps) {
  const [showRawResponse, setShowRawResponse] = useState(false);

  const jev = result?.jev_result;
  const llm = result?.llm_result;
  const delta = result?.comparison_delta;

  // Chart max baselines for comparative bar percentages
  const maxLatency = Math.max(1, jev?.metrics.latency_ms || 1000, llm?.metrics.latency_ms || 3000);
  const jevLatencyPct = Math.round(((jev?.metrics.latency_ms || 0) / maxLatency) * 100);
  const llmLatencyPct = Math.round(((llm?.metrics.latency_ms || 0) / maxLatency) * 100);

  const maxTokens = Math.max(1, jev?.metrics.total_tokens || 500, llm?.metrics.total_tokens || 1000);
  const jevTokensPct = Math.round(((jev?.metrics.total_tokens || 0) / maxTokens) * 100);
  const llmTokensPct = Math.round(((llm?.metrics.total_tokens || 0) / maxTokens) * 100);

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs card-elevation overflow-hidden space-y-0">
      {/* Top Header Bar */}
      <div className="px-6 lg:px-8 py-4 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center text-xs font-black shadow-2xs">
            2
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Head-to-Head Comparison & Decisions
            </h2>
            <p className="text-[11px] text-slate-500">Split side-by-side decision cards for the active scenario</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real Jev output · {jev ? `${(jev.metrics.latency_ms / 1000).toFixed(2)}s` : '1.00s'}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 lg:p-8 space-y-7 bg-slate-50/30">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-20">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 animate-spin">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Executing Parallel Models...</p>
              <p className="text-xs text-slate-500 mt-0.5">Jev 1.13 and Gemini 3.5 Flash Lite running simultaneously</p>
            </div>
          </div>
        ) : !result ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-md mx-auto space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              A question in. A judgment out.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your result appears here with the response returned by Jev. Run the example to see how the question and answer options shape the judgment.
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            {/* ================= 1. VISUAL BENCHMARK DASHBOARD CHARTS ================= */}
            {delta && llm && jev && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* CHART 1: LATENCY SPEED */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Execution Speed</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ⚡ {delta.speedup_ratio}x Faster
                    </span>
                  </div>

                  {/* Dual comparative bars */}
                  <div className="space-y-2 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-emerald-700">Jev 1.13</span>
                        <span className="mono-font text-emerald-700">{jev.metrics.latency_ms} ms</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(10, jevLatencyPct)}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Gemini 3.5</span>
                        <span className="mono-font text-slate-500">{llm.metrics.latency_ms} ms</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(10, llmLatencyPct)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-0.5 leading-tight">
                    Non-autoregressive forward pass vs token-by-token generation.
                  </p>
                </div>

                {/* CHART 2: TOKEN FOOTPRINT */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-600" />
                      <span>Token Footprint</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                      📉 -{delta.token_savings_percent}% Tokens
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-emerald-700">Jev 1.13 (0 output)</span>
                        <span className="mono-font text-emerald-700">{jev.metrics.total_tokens} tok</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(10, jevTokensPct)}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Gemini 3.5</span>
                        <span className="mono-font text-slate-500">{llm.metrics.total_tokens} tok</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(10, llmTokensPct)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-0.5 leading-tight">
                    Jev eliminates output tokens completely; free generation.
                  </p>
                </div>

                {/* CHART 3: COST / RUN */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>Cost Efficiency</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                      -{delta.cost_savings_percent}% Cost
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Jev Cost:</span>
                      <span className="font-bold text-emerald-700 mono-font">${jev.metrics.estimated_cost_usd}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Gemini Cost:</span>
                      <span className="font-bold text-slate-600 mono-font">${llm.metrics.estimated_cost_usd}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="font-semibold text-slate-700">Per 100k runs:</span>
                      <span className="font-extrabold text-emerald-700 mono-font">
                        ${(jev.metrics.estimated_cost_usd * 100000).toFixed(2)} vs ${(llm.metrics.estimated_cost_usd * 100000).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-0.5 leading-tight">
                    Direct mathematical routing saves inference budget at scale.
                  </p>
                </div>
              </div>
            )}

            {/* ================= 2. SPLIT JEV AND GEMINI OUTPUTS ================= */}
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Split className="w-4 h-4 text-blue-600" />
                  <span>Split Model Output Comparison ({questions.length} Questions)</span>
                </span>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Jev 1.13 Decisions
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-700">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Gemini 3.5 LLM
                  </span>
                </div>
              </div>

              {/* Loop through each question with TWO SPLIT CARDS per row */}
              {questions.map((q, idx) => {
                const jJev = jev?.judgments.find((j) => j.question_id === q.id || j.question_key === q.key);
                const jLLM = llm?.judgments.find((j) => j.question_id === q.id || j.question_key === q.key);

                // Check verdict match
                const isMatch =
                  jJev &&
                  jLLM &&
                  (jJev.verdict.toLowerCase().trim() === jLLM.verdict.toLowerCase().trim() ||
                    jLLM.verdict.toLowerCase().includes(jJev.verdict.toLowerCase()));

                return (
                  <div key={q.id || idx} className="space-y-2.5">
                    {/* Unified Question Context Bar */}
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-black text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-slate-100 border border-slate-200 text-slate-700">
                          {q.type === 'yes_no' ? 'NOUL (YES/NO)' : q.type.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{q.key}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate max-w-xl">{q.question}</p>
                    </div>

                    {/* TWO SPLIT CARDS (Jev Card on Left, Gemini Card on Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
                      {/* ================= SPLIT CARD 1: JEV 1.13 DECISION ================= */}
                      <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/15 p-5 space-y-4 flex flex-col justify-between shadow-xs hover:border-emerald-500/50 transition-all">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                              Jev 1.13 Decision
                            </span>
                            {jJev && (
                              <span className="text-[11px] font-bold text-emerald-700 mono-font bg-white px-2 py-0.5 rounded border border-emerald-200">
                                {Math.round(jJev.confidence * 100)}% calibrated confidence
                              </span>
                            )}
                          </div>

                          {jJev ? (
                            <>
                              {/* 1. CHOICE */}
                              {jJev.type === 'choice' && (
                                <div className="space-y-2.5 bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                      {jJev.verdict}
                                    </h3>
                                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                                      Selected
                                    </span>
                                  </div>

                                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                    {(() => {
                                      const dist = jJev.distribution || jJev.probabilities;
                                      if (!dist) return null;
                                      return Object.entries(dist).map(([label, rawProb]) => {
                                        const prob = Number(rawProb) || 0;
                                        const pct = Math.round(prob * 100);
                                        const isWinner = label === jJev.verdict;

                                        return (
                                          <div key={label} className="flex items-center gap-2.5 text-xs">
                                            <span
                                              className={`w-28 truncate font-medium ${
                                                isWinner ? 'text-slate-900 font-bold' : 'text-slate-400'
                                              }`}
                                            >
                                              {label}
                                            </span>
                                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                              <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                  isWinner ? 'bg-emerald-500' : 'bg-slate-300'
                                                }`}
                                                style={{ width: `${Math.max(2, pct)}%` }}
                                              />
                                            </div>
                                            <span
                                              className={`w-10 text-right mono-font font-bold ${
                                                isWinner ? 'text-emerald-600' : 'text-slate-400'
                                              }`}
                                            >
                                              {pct}%
                                            </span>
                                          </div>
                                        );
                                      });
                                    })()}
                                  </div>
                                </div>
                              )}

                              {/* 2. NOUL (YES/NO) - UNIFIED CONSISTENT THEME */}
                              {jJev.type === 'yes_no' && (() => {
                                const isYes = jJev.verdict.toLowerCase().includes('yes');
                                return (
                                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
                                    <div
                                      className={`relative w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-sm shadow-2xs ${
                                        isYes
                                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                          : 'border-slate-300 bg-slate-50 text-slate-700'
                                      }`}
                                    >
                                      {Math.round(jJev.confidence * 100)}%
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black text-slate-900">
                                          {jJev.verdict}
                                        </span>
                                        <span
                                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                            isYes
                                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                              : 'bg-slate-100 text-slate-600 border-slate-200'
                                          }`}
                                        >
                                          {isYes ? 'Affirmative' : 'Negative'}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 font-medium">
                                        Noul calibrated probability: {jJev.confidence.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* 3. SCORE */}
                              {jJev.type === 'score' && (() => {
                                const metrics = getScoreMetrics(
                                  jJev.score_value,
                                  jJev.verdict,
                                  q.options,
                                  q.score_min ?? 0.0,
                                  q.score_max ?? 2.0
                                );
                                return (
                                  <div className="space-y-2 bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
                                    <div className="flex items-center justify-between">
                                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{jJev.verdict}</h3>
                                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        Calibrated Level
                                      </span>
                                    </div>
                                    <div className="space-y-1 pt-1">
                                      <div className="relative w-full h-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500">
                                        <div
                                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow-xs transition-all duration-500"
                                          style={{ left: `${metrics.percentage}%` }}
                                        />
                                      </div>
                                      <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                                        {metrics.labels.map((lbl, lIdx) => (
                                          <span
                                            key={lbl + lIdx}
                                            className={
                                              lIdx === 0
                                                ? 'text-emerald-700 font-bold'
                                                : lIdx === metrics.labels.length - 1
                                                ? 'text-rose-700 font-bold'
                                                : 'text-amber-700 font-black'
                                            }
                                          >
                                            {lbl}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No decision data</p>
                          )}
                        </div>


                      </div>

                      {/* ================= SPLIT CARD 2: GEMINI 3.5 LLM OUTPUT (BOLDLY HIGHLIGHTED!) ================= */}
                      <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-50/15 p-5 space-y-4 flex flex-col justify-between shadow-xs hover:border-blue-500/50 transition-all">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                              Gemini 3.5 LLM Output
                            </span>
                            {isMatch ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Matches Jev Decision
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                ⚠ Divergent Judgment
                              </span>
                            )}
                          </div>

                          {jLLM ? (
                            <>
                              {/* 1. CHOICE HIGHLIGHT (Clean single answer display - without repeating the category options list) */}
                              {q.type === 'choice' && (
                                <div className="space-y-2 bg-white p-4 rounded-xl border border-blue-200/90 shadow-2xs">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-blue-950 tracking-tight">
                                      {jLLM.verdict}
                                    </h3>
                                    <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold text-xs">
                                      LLM Answer
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* 2. NOUL (YES/NO) - UNIFIED CONSISTENT THEME */}
                              {q.type === 'yes_no' && (() => {
                                const isYes = jLLM.verdict.toLowerCase().includes('yes');
                                return (
                                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-blue-200/90 shadow-2xs">
                                    <div
                                      className={`relative w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-xs shadow-2xs shrink-0 ${
                                        isYes
                                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                                          : 'border-slate-300 bg-slate-50 text-slate-700'
                                      }`}
                                    >
                                      {isYes ? 'YES' : 'NO'}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black text-slate-900">
                                          {jLLM.verdict}
                                        </span>
                                        <span
                                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                            isYes
                                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                                              : 'bg-slate-100 text-slate-600 border-slate-200'
                                          }`}
                                        >
                                          {isYes ? 'Affirmative' : 'Negative'}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 font-medium">
                                        Generative classification verdict
                                      </p>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* 3. SCORE HIGHLIGHT (DYNAMICALLY COMPUTED GRADIENT TRACK) */}
                              {q.type === 'score' && (() => {
                                const metrics = getScoreMetrics(
                                  undefined,
                                  jLLM.verdict,
                                  q.options,
                                  q.score_min ?? 0.0,
                                  q.score_max ?? 2.0
                                );
                                return (
                                  <div className="space-y-2 bg-white p-4 rounded-xl border border-blue-200/90 shadow-2xs">
                                    <div className="flex items-center justify-between">
                                      <h3 className="text-xl font-black text-blue-950 tracking-tight">
                                        {jLLM.verdict}
                                      </h3>
                                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs">
                                        LLM Score
                                      </span>
                                    </div>

                                    <div className="space-y-1 pt-1">
                                      <div className="relative w-full h-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500">
                                        <div
                                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs transition-all duration-500"
                                          style={{ left: `${metrics.percentage}%` }}
                                        />
                                      </div>
                                      <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                                        {metrics.labels.map((lbl, lIdx) => (
                                          <span
                                            key={lbl + lIdx}
                                            className={
                                              lIdx === 0
                                                ? 'text-emerald-700 font-bold'
                                                : lIdx === metrics.labels.length - 1
                                                ? 'text-rose-700 font-bold'
                                                : 'text-amber-700 font-black'
                                            }
                                          >
                                            {lbl}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* 4. MODEL REASONING BOX */}
                              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                                  Model Rationale / Explanation:
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                                  {jLLM.explanation || 'No reasoning summary provided.'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No LLM output</p>
                          )}
                        </div>


                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Specs & Raw JSON Response Toggle */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span className="mono-font text-[11px]">
                {jev?.model_name || 'jev-1.13.0'} · {(jev?.metrics.latency_ms! / 1000).toFixed(2)}s ·{' '}
                {jev?.metrics.input_tokens} input tokens · 97,712 tokens left
              </span>

              <button
                type="button"
                onClick={() => setShowRawResponse(!showRawResponse)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {showRawResponse ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span>Raw Jev JSON Payload</span>
              </button>
            </div>

            {showRawResponse && (
              <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 text-xs mono-font overflow-x-auto leading-relaxed shadow-inner">
                {jev?.raw_output}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Footer Configuration Actions */}
      <div className="px-6 lg:px-8 py-3.5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onExportConfig}
            className="text-emerald-700 hover:underline font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Configuration</span>
          </button>
          <button
            type="button"
            onClick={onImportConfig}
            className="text-emerald-700 hover:underline font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Import Configuration</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Model judgment, not a guarantee. Review before executing automated downstream triggers.
        </p>
      </div>
    </div>
  );
}
