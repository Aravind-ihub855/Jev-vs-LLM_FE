'use client';

import React, { useRef, useState } from 'react';
import { Image as ImageIcon, RotateCcw, Upload, X } from 'lucide-react';

interface TextToJudgeProps {
  value: string;
  onChange: (val: string) => void;
  onReset: () => void;
  imagePreview: string | null;
  onImageChange: (img: string | null) => void;
  theme?: 'dark' | 'light';
}

export default function TextToJudge({
  value,
  onChange,
  onReset,
  imagePreview,
  onImageChange,
  theme = 'dark'
}: TextToJudgeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const maxLimit = 8000;
  const currentLength = value.length;
  const isLight = theme === 'light';

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center text-xs font-bold">
            1
          </div>
          <h2 className={`text-sm font-semibold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
            Text to judge
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-emerald-500 hover:underline font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            Add image
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset example
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div
        className={`relative rounded-xl border focus-within:border-emerald-500 transition-all shadow-inner ${
          isLight
            ? 'border-slate-200 bg-white focus-within:ring-2 focus-within:ring-emerald-500/20'
            : 'border-[#1f2a40] bg-[#090e18] focus-within:border-emerald-500/80'
        }`}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='{\n  "user_question": "...",\n  "reference": "...",\n  "candidate_answer": "..."\n}'
          rows={9}
          spellCheck={false}
          className={`w-full bg-transparent px-4 py-3 text-xs mono-font resize-y focus:outline-none leading-relaxed ${
            isLight ? 'text-slate-800 placeholder:text-slate-400' : 'text-slate-200 placeholder:text-slate-600'
          }`}
        />

        {/* Character Limit Badge */}
        <div
          className={`px-4 py-2 border-t flex justify-end items-center rounded-b-xl ${
            isLight ? 'border-slate-100 bg-slate-50/80' : 'border-[#182235] bg-[#070b13]/80'
          }`}
        >
          <span className="text-[11px] text-slate-400 mono-font">
            <span className={currentLength > maxLimit ? 'text-rose-500 font-bold' : isLight ? 'text-slate-700' : 'text-slate-300'}>
              {currentLength.toLocaleString()}
            </span>{' '}
            / {maxLimit.toLocaleString()} guest limit
          </span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {/* Multimodal Image Dropzone */}
      {imagePreview ? (
        <div
          className={`relative rounded-xl border p-3 flex items-center gap-3 ${
            isLight ? 'border-emerald-200 bg-emerald-50/50' : 'border-emerald-500/30 bg-[#0e1625]'
          }`}
        >
          <img
            src={imagePreview}
            alt="Preview"
            className="w-16 h-16 rounded-lg object-cover border border-slate-300 dark:border-[#23314c]"
          />
          <div className="flex-1">
            <p className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Attached image for multimodal judgment
            </p>
            <p className="text-[11px] text-slate-400">Jev 1.14 visual grounding enabled</p>
          </div>
          <button
            type="button"
            onClick={() => onImageChange(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-xl border border-dashed transition-all p-3.5 flex items-center justify-between gap-3 cursor-pointer ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/10'
              : isLight
              ? 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-slate-50'
              : 'border-[#222f47] hover:border-emerald-500/50 bg-[#090e18]/60 hover:bg-[#0c121e]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <p className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Add an image — PNG or JPEG
              </p>
              <p className="text-[11px] text-slate-400">
                Drop it here or click. Ask choice, yes/no or score questions about it, or add a Box question to locate something.
              </p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 shrink-0">
            1.14
          </span>
        </div>
      )}
    </div>
  );
}
