'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, Brain, Zap, ChevronDown, Check } from 'lucide-react';

export interface Model {
  id: string;
  nameKey: string;
  descKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  translationNamespace?: string;
  className?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  value,
  onChange,
  translationNamespace = 'Dashboard.Agents.Create.models',
  className = ''
}) => {
  const t = useTranslations(translationNamespace);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const models: Model[] = [
    { id: 'gpt4', nameKey: 'gpt4', descKey: 'gpt4Desc', icon: Sparkles },
    { id: 'claude', nameKey: 'claude', descKey: 'claudeDesc', icon: Brain },
    { id: 'gemini', nameKey: 'gemini', descKey: 'geminiDesc', icon: Zap },
  ];

  const selectedModel = models.find(m => m.id === value);
  const SelectedIcon = selectedModel?.icon || Sparkles;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-50 border-2 border-transparent hover:bg-white hover:border-slate-200 rounded-xl px-5 py-4 text-base transition-all"
      >
        <div className="flex items-center gap-3">
          {selectedModel && <SelectedIcon className="w-5 h-5 text-slate-900" />}
          <div className="text-left">
            <div className="font-semibold text-slate-900">
              {selectedModel ? t(selectedModel.nameKey) : t('gpt4')}
            </div>
            <div className="text-xs text-slate-500">
              {selectedModel ? t(selectedModel.descKey) : t('gpt4Desc')}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl z-10 overflow-hidden">
          {models.map((model) => {
            const ModelIcon = model.icon;
            const isSelected = value === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  onChange(model.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
              >
                <ModelIcon className="w-5 h-5 text-slate-700" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{t(model.nameKey)}</div>
                  <div className="text-xs text-slate-500">{t(model.descKey)}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-slate-900 ml-auto" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

