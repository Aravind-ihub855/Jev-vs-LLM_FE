'use client';

import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Crosshair,
  FileText,
  Mail,
  Shield,
  Bot,
  GitBranch,
  Lock,
  Star,
  Scale,
  Award,
  Layers,
  Database,
  Globe,
  Minimize2
} from 'lucide-react';
import { Preset } from '@/types';

interface ScenarioCarouselProps {
  presets: Preset[];
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
}

export default function ScenarioCarousel({
  presets,
  selectedPresetId,
  onSelectPreset
}: ScenarioCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'screenshot_check':
        return ImageIcon;
      case 'box_find_button':
        return Crosshair;
      case 'long_context_log':
        return FileText;
      case 'support_triage':
      case 'support_ticket_triage':
        return Mail;
      case 'content_moderation':
        return Shield;
      case 'chatbot_intent':
        return Bot;
      case 'model_routing':
        return GitBranch;
      case 'agent_guardrail':
        return Lock;
      case 'review_scoring':
        return Star;
      case 'llm_judge':
        return Scale;
      case 'agent_evaluation':
        return Award;
      case 'entity_matching':
        return Layers;
      case 'rag_evaluation':
      case 'rag_factuality':
        return Database;
      case 'live_web_context':
        return Globe;
      case 'context_compaction':
        return Minimize2;
      default:
        return FileText;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-white/80 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-2.5 card-elevation mb-6">
      <div className="flex items-center gap-2">
        {/* Left Scroll Button */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer shadow-2xs border border-slate-200/80"
          title="Scroll left"
          aria-label="Scroll scenarios left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Horizontal Scroll Area */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 flex-1"
        >
          {presets.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            const IconComponent = getScenarioIcon(preset.id);

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`flex flex-col items-center justify-between min-w-[136px] max-w-[144px] h-[86px] p-2.5 rounded-xl border text-center transition-all cursor-pointer shrink-0 select-none ${
                  isSelected
                    ? 'border-2 border-emerald-500 bg-emerald-50/40 text-emerald-950 shadow-xs ring-2 ring-emerald-500/10'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-2xs'
                }`}
              >
                {/* Icon */}
                <div
                  className={`p-1.5 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Title */}
                <span className="text-[11px] font-bold tracking-tight line-clamp-1 w-full px-1">
                  {preset.title}
                </span>

                {/* Version Tag */}
                {preset.version_tag ? (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {preset.version_tag}
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    {preset.category || 'core'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer shadow-2xs border border-slate-200/80"
          title="Scroll right"
          aria-label="Scroll scenarios right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
