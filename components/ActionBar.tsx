'use client';

import React from 'react';
import { Sparkles, Code, Eye, Loader2 } from 'lucide-react';

interface ActionBarProps {
  onRun: () => void;
  isLoading: boolean;
  onOpenApiModal: () => void;
  onOpenPreviewModal: () => void;
  estimatedTokens: number;
  compareWithLLM: boolean;
  theme?: 'dark' | 'light';
}

export default function ActionBar({
  onRun,
  isLoading,
  onOpenApiModal,
  onOpenPreviewModal,
  estimatedTokens,
  compareWithLLM,
  theme = 'dark'
}: ActionBarProps) {
  const isLight = theme === 'light';

  return (
    <div className={`space-y-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-[#1b253b]'}`}>
      {/* Primary Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRun}
          disabled={isLoading}
          className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] ${
            isLight
              ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-300'
              : 'bg-slate-100 hover:bg-white text-slate-900 shadow-emerald-500/10'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              <span>Running Evaluation...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <span>{compareWithLLM ? 'Run Jev vs Google Gemini' : 'Run Jev'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenApiModal}
          className={`py-2.5 px-4 rounded-xl border font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
            isLight
              ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              : 'bg-[#121929] hover:bg-[#18233a] border-[#222f49] text-slate-300 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-slate-400" />
          <span>Copy API example</span>
        </button>
      </div>

      {/* Token Footprint Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div>
          <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>7,804</span> free tokens left.{' '}
          <span className="text-emerald-500 hover:underline cursor-pointer">Sign in for 100,000 more</span>
        </div>

        <div className="mono-font text-slate-400 text-[11px]">
          This run ~ <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>{estimatedTokens}</span> tokens
        </div>
      </div>

      <div className="flex justify-start">
        <button
          type="button"
          onClick={onOpenPreviewModal}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Request preview</span>
        </button>
      </div>
    </div>
  );
}
