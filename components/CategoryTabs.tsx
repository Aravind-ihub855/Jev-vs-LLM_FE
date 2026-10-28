'use client';

import React from 'react';
import { Mail, Shield, GitBranch, ShieldAlert, Star, Scale, Check } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function CategoryTabs({ activeCategory, onSelectCategory }: CategoryTabsProps) {
  const categories = [
    { id: 'support_triage', label: 'Support triage', icon: Mail },
    { id: 'content_moderation', label: 'Content moderation', icon: Shield },
    { id: 'model_routing', label: 'Model routing', icon: GitBranch },
    { id: 'agent_guardrail', label: 'Agent guardrail', icon: ShieldAlert },
    { id: 'review_scoring', label: 'Review scoring', icon: Star },
    { id: 'llm_judge', label: 'LLM judge', icon: Scale },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
