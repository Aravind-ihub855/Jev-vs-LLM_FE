'use client';

import React from 'react';
import Image from 'next/image';
import { Layers, Zap, Key, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Preset } from '@/types';

interface HeaderProps {
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  presets: Preset[];
  backendOnline: boolean;
  hasLiveKeys: boolean;
  onOpenKeyModal: () => void;
}

export default function Header({
  selectedPresetId,
  onSelectPreset,
  presets,
  backendOnline,
  hasLiveKeys,
  onOpenKeyModal
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-6 py-3.5 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1680px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* LEFT CORNER: SNS SQUARE LOGO + JEV 1.13 STABLE BADGE */}
        <div className="flex items-center gap-3.5">
          <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
            <Image
              src="/square_logo_black.png"
              alt="SNS SQUARE"
              width={105}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Jev 1.13 Stable Badge matching reference screenshot */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs">
              <span className="w-5 h-5 rounded bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center">
                J
              </span>
              <span className="text-xs font-bold text-slate-800 tracking-tight">Jev 1.13</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Stable
              </span>
            </div>

            <span className="text-slate-300 font-light">vs</span>

            {/* Gemini 3.5 Flash Lite Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-200/80 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-bold text-blue-900 tracking-tight">Gemini 3.5 Flash Lite</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                LLM
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTROLS: PRESET SELECTOR & LIVE STATUS */}
        <div className="flex items-center flex-wrap gap-2.5 text-xs">
          {/* Preset Selector */}
          <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-[11px] font-medium">Scenario:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-slate-800">
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Live Dual Engine Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px]">Both Models Online</span>
          </div>

          {/* API Keys Configuration Button */}
          <button
            type="button"
            onClick={onOpenKeyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-[11px]">API Keys</span>
            {hasLiveKeys && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                Connected
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
