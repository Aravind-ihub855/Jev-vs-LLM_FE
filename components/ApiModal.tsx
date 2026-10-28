'use client';

import React, { useState } from 'react';
import { X, Check, Copy, Terminal, Code2 } from 'lucide-react';
import { QuestionConfig } from '@/types';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  textToJudge: string;
  questions: QuestionConfig[];
  model: string;
}

export default function ApiModal({
  isOpen,
  onClose,
  textToJudge,
  questions,
  model
}: ApiModalProps) {
  const [lang, setLang] = useState<'python' | 'curl' | 'typescript'>('python');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getSnippet = () => {
    const payload = {
      model,
      text_to_judge: textToJudge,
      questions: questions.map((q) => ({
        id: q.id,
        key: q.key,
        type: q.type,
        question: q.question,
        options: q.options
      }))
    };

    if (lang === 'python') {
      return `import requests
import os

url = "https://jevmodel.org/v1/systemone"

payload = {
    "state": ${JSON.stringify(textToJudge)},
    "model": "jev-latest",
    "questions": {
        "verdict": {
            "type": "choice",
            "instructions": "Using only the reference, assess candidate answer.",
            "criteria": {
                "Supported": "Backed by reference",
                "Contradicted": "Conflicts with reference"
            }
        },
        "direct_address": {
            "type": "noul",
            "instructions": "Does candidate directly address the question?"
        }
    }
}

headers = {
    "Authorization": f"Bearer {os.environ.get('JEVMODEL_API_KEY')}",
    "Content-Type": "application/json"
}
response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
    }

    if (lang === 'curl') {
      return `curl https://jevmodel.org/v1/systemone \\
  -H "Authorization: Bearer $JEVMODEL_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "state": ${JSON.stringify(textToJudge)},
    "model": "jev-latest",
    "questions": {
      "verdict": {
        "type": "choice",
        "instructions": "Assess factual claims",
        "criteria": {
          "Supported": "Claim backed by reference",
          "Contradicted": "Claim conflicts"
        }
      },
      "direct_address": {
        "type": "noul",
        "instructions": "Does it address question directly?"
      }
    }
  }'`;
    }

    return `const response = await fetch("http://127.0.0.1:8008/api/evaluate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "${model}",
    compare_with_llm: true,
    text_to_judge: ${JSON.stringify(textToJudge)},
    questions: ${JSON.stringify(payload.questions, null, 2)}
  })
});

const data = await response.json();
console.log("Jev Judgments:", data.jev_result.judgments);
console.log("Benchmark Delta:", data.comparison_delta);`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[#222f49] bg-[#0c121e] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-[#1b253b] flex items-center justify-between bg-[#0e1626]">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200">API Integration Snippet</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[#131b2c] p-1 rounded-lg border border-[#23314c] text-xs">
              <button
                type="button"
                onClick={() => setLang('python')}
                className={`px-3 py-1 rounded transition-colors font-medium ${
                  lang === 'python' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
                }`}
              >
                Python SDK
              </button>
              <button
                type="button"
                onClick={() => setLang('curl')}
                className={`px-3 py-1 rounded transition-colors font-medium ${
                  lang === 'curl' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
                }`}
              >
                cURL
              </button>
              <button
                type="button"
                onClick={() => setLang('typescript')}
                className={`px-3 py-1 rounded transition-colors font-medium ${
                  lang === 'typescript' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
                }`}
              >
                TypeScript
              </button>
            </div>

            <button
              type="button"
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-lg bg-[#141d2f] hover:bg-[#1a263e] border border-[#253452] text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#080d17] border border-[#1b253b] text-xs mono-font text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
            {getSnippet()}
          </pre>
        </div>
      </div>
    </div>
  );
}
