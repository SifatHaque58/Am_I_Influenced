import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { KeyRound, Shield, AlertCircle, Cpu, ChevronDown } from 'lucide-react';

const MODELS = [
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (OpenAI)' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Anthropic)' },
  { id: 'google/gemini-2.0-flash', name: 'Gemini 2.0 Flash (Google)' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B (Meta)' },
  { id: 'mistralai/mistral-large', name: 'Mistral Large' },
  { id: 'custom', name: 'Enter Custom Model ID...' },
];

export const AISettingsPanel: React.FC = () => {
  const { aiSettings, updateAISettings } = useStore();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customModelId, setCustomModelId] = useState('');

  // Sync internal state with store on mount or when model changes
  useEffect(() => {
    const isKnownModel = MODELS.some(m => m.id === aiSettings.model && m.id !== 'custom');
    if (!isKnownModel && aiSettings.model) {
      setShowCustomInput(true);
      setCustomModelId(aiSettings.model);
    }
  }, []);

  const handleModelChange = (id: string) => {
    if (id === 'custom') {
      setShowCustomInput(true);
      // Don't update store yet, wait for input
    } else {
      setShowCustomInput(false);
      updateAISettings({ model: id });
    }
  };

  const handleCustomModelBlur = () => {
    if (customModelId.trim()) {
      updateAISettings({ model: customModelId.trim() });
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 p-6 md:p-10 rounded-[2rem] shadow-2xl border border-slate-800 relative overflow-hidden transition-all duration-500">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
        <Shield size={160} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-primary-500/10 p-3 rounded-2xl">
            <KeyRound className="text-primary-400" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">AI Configuration</h3>
            <p className="text-slate-500 text-sm font-medium">Power your insights with OpenRouter</p>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 my-8" />

        <div className="space-y-8 max-w-2xl">
          {/* API Key */}
          <div className="group">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">
                API Key
              </label>
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                Get Key →
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={aiSettings.apiKey}
                onChange={(e) => updateAISettings({ apiKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all group-hover:border-slate-700 font-mono text-sm"
              />
            </div>
          </div>

          {/* Model Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Intelligence Model
              </label>
              <div className="relative">
                <select
                  value={showCustomInput ? 'custom' : aiSettings.model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all appearance-none cursor-pointer group-hover:border-slate-700 pr-12"
                >
                  {MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                  {showCustomInput && !MODELS.find(m => m.id === aiSettings.model) && (
                    <option value={aiSettings.model}>{aiSettings.model} (Active)</option>
                  )}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {showCustomInput && (
              <div className="group animate-in fade-in slide-in-from-left-4 duration-300">
                <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                  Custom Model ID
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600">
                    <Cpu size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. deepseek/deepseek-chat"
                    value={customModelId}
                    onChange={(e) => setCustomModelId(e.target.value)}
                    onBlur={handleCustomModelBlur}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all group-hover:border-slate-700 font-mono text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
            {/* Remember Toggle */}
            <div className="flex items-center gap-4 bg-slate-950/50 px-6 py-3 rounded-2xl border border-slate-800/50 group hover:border-slate-700 transition-colors w-full sm:w-auto">
              <button
                onClick={() => updateAISettings({ isRemembered: !aiSettings.isRemembered })}
                className={`w-11 h-6 rounded-full transition-all relative ${aiSettings.isRemembered ? 'bg-primary-500 shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${aiSettings.isRemembered ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">Remember credentials</span>
            </div>

            <div className="flex items-center gap-3 text-slate-500">
              <Shield size={16} className="text-primary-500" />
              <span className="text-[10px] uppercase font-bold tracking-[0.1em]">Privacy Shield Active</span>
            </div>
          </div>
          
          <div className="bg-primary-500/5 rounded-2xl p-5 flex gap-4 items-start border border-primary-500/10">
            <AlertCircle className="text-primary-400 shrink-0 mt-0.5" size={20} />
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Data Safety: Only your scores and categorical summaries are sent to OpenRouter. No personally identifiable information is ever shared or stored on external servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

