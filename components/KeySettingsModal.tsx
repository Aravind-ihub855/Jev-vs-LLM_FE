'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Check, ExternalLink, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';

interface KeySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  typesafeKey: string;
  setTypesafeKey: (key: string) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
}

export default function KeySettingsModal({
  isOpen,
  onClose,
  typesafeKey,
  setTypesafeKey,
  geminiKey,
  setGeminiKey
}: KeySettingsModalProps) {
  const [localTypesafe, setLocalTypesafe] = useState(typesafeKey);
  const [localGemini, setLocalGemini] = useState(geminiKey);
  const [showJevKey, setShowJevKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalTypesafe(typesafeKey);
    setLocalGemini(geminiKey);
  }, [typesafeKey, geminiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    setTypesafeKey(localTypesafe.trim());
    setGeminiKey(localGemini.trim());
    localStorage.setItem('jev_typesafe_key', localTypesafe.trim());
    localStorage.setItem('jev_gemini_key', localGemini.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setLocalTypesafe('');
    setLocalGemini('');
    setTypesafeKey('');
    setGeminiKey('');
    localStorage.removeItem('jev_typesafe_key');
    localStorage.removeItem('jev_gemini_key');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Key className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Model API Credentials
              </h3>
              <p className="text-xs text-slate-500 font-medium">Configure keys for live real-time evaluations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          <p className="text-xs text-slate-600 leading-relaxed">
            Provide your live API keys to benchmark against real <strong className="text-slate-900 font-bold">TypeSafe AI Jev</strong> and <strong className="text-slate-900 font-bold">Google Gemini API</strong> endpoints. Keys are stored locally in your browser session.
          </p>

          {/* Card 1: Jev Model API Key */}
          <div className="p-4 rounded-2xl border-2 border-emerald-500/20 bg-emerald-50/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shadow-2xs">
                  J
                </span>
                <span className="font-extrabold text-slate-900">Jev Model API Key (JEVMODEL_API_KEY)</span>
              </div>
              <a
                href="https://jevmodel.org/dashboard/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <span>jevmodel.org/dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showJevKey ? 'text' : 'password'}
                value={localTypesafe}
                onChange={(e) => setLocalTypesafe(e.target.value)}
                placeholder="sk-... (JEVMODEL_API_KEY)"
                className="w-full text-xs font-mono bg-white border border-emerald-300/80 rounded-xl px-3.5 py-2.5 pr-10 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowJevKey(!showJevKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                {showJevKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>Endpoint: https://jevmodel.org/v1/systemone</span>
              <span className="text-emerald-700 font-semibold">{localTypesafe ? '✓ Key entered' : 'Using backend key'}</span>
            </div>
          </div>

          {/* Card 2: Gemini API Key */}
          <div className="p-4 rounded-2xl border-2 border-blue-500/20 bg-blue-50/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="font-extrabold text-slate-900">Google Gemini API Key (GEMINI_API_KEY)</span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 hover:underline"
              >
                <span>Get Gemini Key (AI Studio)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={localGemini}
                onChange={(e) => setLocalGemini(e.target.value)}
                placeholder="AIzaSy... (Gemini API Key)"
                className="w-full text-xs font-mono bg-white border border-blue-300/80 rounded-xl px-3.5 py-2.5 pr-10 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>Executes completions via Google Generative Language API</span>
              <span className="text-blue-700 font-semibold">{localGemini ? '✓ Key entered' : 'Using backend key'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <span>If keys are left blank, the workbench falls back to backend environment variables or live demo routing.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            Clear Keys (Use Defaults)
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-md shadow-slate-900/10 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save and Apply</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
