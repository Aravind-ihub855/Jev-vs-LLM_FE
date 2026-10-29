'use client';

import React from 'react';
import Image from 'next/image';
import {
  Mail,
  Shield,
  GitBranch,
  ShieldAlert,
  Star,
  Scale,
  Key,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  Layers
} from 'lucide-react';
import { Preset } from '@/types';

interface SidebarProps {
  presets: Preset[];
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  backendOnline: boolean;
  hasLiveKeys: boolean;
  onOpenKeyModal: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  presets,
  selectedPresetId,
  onSelectPreset,
  backendOnline,
  hasLiveKeys,
  onOpenKeyModal,
  isCollapsed,
  onToggleCollapse
}: SidebarProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'screenshot_check':
        return Star;
      case 'box_find_button':
        return Layers;
      case 'long_context_log':
        return Sparkles;
      case 'support_triage':
      case 'support_ticket_triage':
        return Mail;
      case 'content_moderation':
        return Shield;
      case 'chatbot_intent':
        return Sparkles;
      case 'agent_routing':
        return Bot;
      case 'model_routing':
        return GitBranch;
      case 'agent_guardrail':
        return ShieldAlert;
      case 'review_scoring':
        return Star;
      case 'llm_judge':
        return Scale;
      case 'agent_evaluation':
        return Zap;
      case 'entity_matching':
        return Layers;
      case 'rag_evaluation':
      case 'rag_factuality':
        return Sparkles;
      default:
        return Scale;
    }
  };

  return (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-72'
        } bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex flex-col shrink-0 min-h-screen sticky top-0 h-screen transition-all duration-300 ease-in-out z-30 shadow-xs select-none`}
    >
      {/* Sticky Top Header: SNS SQUARE Logo & Single Collapse Button */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2 sticky top-0 bg-white/95 z-10">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="bg-white rounded-xl p-2 border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0">
              <img
                src="/square_logo_black.png"
                alt="SNS SQUARE"
                className="h-8 max-h-8 w-auto object-contain"
              />
            </div>
          </div>
        ) : (
          <div
            title="SNS SQUARE"
            className="bg-white rounded-xl p-1.5 border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0 mx-auto"
          >
            <img
              src="/square_logo_black.png"
              alt="SNS SQUARE"
              className="h-7 max-h-7 w-auto object-contain"
            />
          </div>
        )}

        {/* Single Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ${isCollapsed ? 'mx-auto mt-2' : ''
            }`}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Model Status Pills */}
      {!isCollapsed ? (
        <div className="px-4 py-3 border-b border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white border border-emerald-200/90 flex items-center justify-center p-0.5 shadow-2xs shrink-0">
                <img
                  src="/TypeSafe_AI_Symbol_0.svg"
                  alt="Jev (TypeSafe AI)"
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span className="text-xs font-bold text-slate-800">Jev 1.13</span>
            </div>
            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Decision Model
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/60 border border-blue-200/70">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white border border-blue-200/90 flex items-center justify-center p-0.5 shadow-2xs shrink-0">
                <img
                  src="/gemini-color.svg"
                  alt="Google Gemini"
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span className="text-xs font-bold text-slate-800">Gemini 3.5</span>
            </div>
            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
              LLM
            </span>
          </div>
        </div>
      ) : (
        <div className="py-2.5 border-b border-slate-100 flex flex-col items-center gap-2">
          <div
            title="Jev 1.13 (Decision Model)"
            className="w-8 h-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center p-1 shadow-2xs"
          >
            <img
              src="/TypeSafe_AI_Symbol_0.svg"
              alt="Jev (TypeSafe AI)"
              className="w-5 h-5 object-contain"
            />
          </div>
          <div
            title="Gemini 3.5 Flash Lite"
            className="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center p-1 shadow-2xs"
          >
            <img
              src="/gemini-color.svg"
              alt="Google Gemini"
              className="w-5 h-5 object-contain"
            />
          </div>
        </div>
      )}

      {/* Middle: USE CASES MENU (Spacious & De-congested) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {!isCollapsed && (
          <div className="px-3 pt-2 pb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mono-font">
              Use Cases
            </span>
            <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              {presets.length}
            </span>
          </div>
        )}

        {presets.map((preset) => {
          const Icon = getIcon(preset.id);
          const isSelected = selectedPresetId === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              title={isCollapsed ? `${preset.title}: ${preset.description}` : preset.description}
              className={`w-full text-left transition-all rounded-xl cursor-pointer flex items-center gap-2.5 ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                } ${isSelected
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'hover:bg-slate-100/70 text-slate-700 hover:text-slate-900 font-medium'
                }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected
                  ? 'bg-white/15 text-white'
                  : 'bg-slate-100 text-slate-500'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
                  <p className="text-xs truncate leading-snug">{preset.title}</p>
                  {preset.version_tag && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                      {preset.version_tag}
                    </span>
                  )}
                </div>
              )}

              {!isCollapsed && isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Section: Keys & Token Balance */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 space-y-2 text-xs">
        {!isCollapsed ? (
          <>

            <button
              type="button"
              onClick={onOpenKeyModal}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>API Key Settings</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span
              title="97,712 tokens remaining"
              className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
            />
            <button
              type="button"
              onClick={onOpenKeyModal}
              title="API Key Settings"
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
