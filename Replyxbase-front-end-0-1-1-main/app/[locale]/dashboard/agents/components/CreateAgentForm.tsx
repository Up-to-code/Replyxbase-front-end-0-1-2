'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createAgent } from '@/app/actions/agent';
import { Upload, MessageSquare, Check, Calendar, Users, ChevronDown, Loader2, Sparkles, ArrowRight, Building, ShoppingBag, HeartPulse, Cpu, Banknote, MoreHorizontal } from 'lucide-react';
import { ModelSelector } from '@/components/ui/ModelSelector';

export const CreateAgentForm: React.FC = () => {
  const t = useTranslations("Dashboard.Agents.Create");
  const [step, setStep] = useState(1);
  // Channels state - reserved for future channel selection UI (step 3)
  const [channels] = useState<string[]>([]);
  // Default all capabilities to selected
  const [capabilities, setCapabilities] = useState<string[]>(['crm', 'booking', 'support']);
  const [selectedModel, setSelectedModel] = useState('gpt4');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);

  const industries = [
    { id: 'realEstate', label: 'industries.realEstate', icon: Building },
    { id: 'ecommerce', label: 'industries.ecommerce', icon: ShoppingBag },
    { id: 'healthcare', label: 'industries.healthcare', icon: HeartPulse },
    { id: 'technology', label: 'industries.technology', icon: Cpu },
    { id: 'finance', label: 'industries.finance', icon: Banknote },
    { id: 'other', label: 'industries.other', icon: MoreHorizontal },
  ];

  const toggleCapability = (cap: string) => {
    setCapabilities(prev => 
      prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]
    );
  };

  const [isSuccess, setIsSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleImprovePrompt = async () => {
    setIsImproving(true);
    // Simulate AI improvement
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsImproving(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!name.trim()) {
        throw new Error("Name is required");
      }

      // Map channels to boolean flags
      const isWebsiteEnabled = channels.includes('website');
      const isWhatsappEnabled = channels.includes('whatsapp');
      const isDmEnabled = channels.includes('dm');

      // Generate system prompt as CSV if not provided
      let finalSystemPrompt = systemPrompt;
      if (!finalSystemPrompt.trim()) {
        // Helper to get industry label
        const industryObj = industries.find(i => i.id === selectedIndustry);
        const industryLabel = industryObj ? t(industryObj.label) : selectedIndustry;

        // Helper to get capability labels
        const capabilityLabels = capabilities.map(capId => {
          const capObj = [
            { id: 'crm', label: 'capabilitiesList.crm' },
            { id: 'booking', label: 'capabilitiesList.booking' },
            { id: 'support', label: 'capabilitiesList.support' },
          ].find(c => c.id === capId);
          return capObj ? t(capObj.label) : capId;
        });

        const lines = [
          `Name,${name}`,
          `Role,Assistant`,
          `Industry,${industryLabel}`,
          `Capabilities,${capabilityLabels.join('|')}`,
          `Model,${getModelName(selectedModel)}`,
          `Language,${t("common.create") === "إنشاء الوكيل" ? "Arabic" : "English"}` // Infer language context
        ];
        finalSystemPrompt = lines.join('\n');
      }

      await createAgent({
        name,
        role: 'assistant', // Default role
        isWebsiteEnabled,
        isWhatsappEnabled,
        isDmEnabled,
        systemPrompt: finalSystemPrompt,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error('Error creating agent:', error);
      setError(error instanceof Error ? error.message : "Failed to create agent");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
        <div className="w-24 h-24 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in border-2 border-[#10B981]/20">
          <Check className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t("successTitle")}</h2>
        <p className="text-slate-600 mb-8">{t("successSubtitle")}</p>
        <button 
          onClick={() => window.location.href = '/dashboard/agents'}
          className="bg-[#005bbc] hover:bg-[#004a9f] text-white border-2 border-[#005bbc] px-8 py-3 rounded-xl text-sm font-semibold transition-all"
        >
          {t("goToDashboard")}
        </button>
      </div>
    );
  }

  // Get model name for CSV export
  const getModelName = (modelId: string): string => {
    const modelKey = `models.${modelId}` as keyof typeof t;
    return t(modelKey) || modelId;
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Vertical Steps Sidebar */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="sticky top-8 space-y-1">
          {[1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left border-2
                ${step === s 
                  ? 'bg-[#005bbc] text-white border-[#005bbc]' 
                  : 'text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                ${step === s 
                  ? 'bg-white text-[#005bbc] border-white' 
                  : 'bg-transparent border-slate-200'}`}>
                {s}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${step === s ? 'text-white' : 'text-slate-900'}`}>
                  {s === 1 ? t("steps.1") : t("steps.2")}
                </span>
                <span className={`text-xs ${step === s ? 'text-slate-200' : 'text-slate-500'}`}>
                  {s === 1 ? t("basicInfo.title") : t("knowledge.title")}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white border-2 border-slate-200 rounded-2xl p-8 min-h-[600px]">
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t("basicInfo.title")}</h2>
              <p className="text-slate-600 mt-2">{t("basicInfo.subtitle")}</p>
              {error && (
                <div className="mt-4 p-4 bg-[#EF4444]/10 text-[#EF4444] border-2 border-[#EF4444]/20 rounded-xl text-sm font-medium animate-fade-in">
                  {error}
                </div>
              )}
            </div>

            <div className="grid gap-8">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-900">{t("form.name")}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("form.namePlaceholder")}
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 rounded-xl px-5 py-4 text-base transition-all"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-900">{t("form.model")}</label>
                <ModelSelector
                  value={selectedModel}
                  onChange={setSelectedModel}
                  translationNamespace="Dashboard.Agents.Create.models"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-900">{t("form.capabilities")}</label>
                <div className="grid gap-3">
                  {[
                    { id: 'crm', icon: Users, label: 'capabilitiesList.crm' },
                    { id: 'booking', icon: Calendar, label: 'capabilitiesList.booking' },
                    { id: 'support', icon: MessageSquare, label: 'capabilitiesList.support' },
                  ].map((cap) => {
                    const Icon = cap.icon;
                    const isSelected = capabilities.includes(cap.id);
                    return (
                      <button
                        key={cap.id}
                        onClick={() => toggleCapability(cap.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left rtl:text-right
                          ${isSelected 
                            ? 'border-[#005bbc] bg-[#005bbc]/10' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border-2 ${isSelected ? 'bg-white border-[#005bbc]/20' : 'bg-slate-100 border-slate-200'}`}>
                            <Icon className="w-5 h-5 text-slate-700" />
                          </div>
                          <span className="font-semibold text-slate-900">{t(cap.label)}</span>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-[#005bbc]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t("knowledge.title")}</h2>
              <p className="text-slate-600 mt-2">{t("knowledge.subtitle")}</p>
            </div>

            <div className="max-w-2xl space-y-8">
              <div className="grid gap-2 relative">
                <label className="text-sm font-semibold text-slate-900">{t("industry")}</label>
                <button 
                  onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
                  className="w-full flex items-center justify-between bg-slate-50 border-2 border-transparent hover:bg-white hover:border-slate-200 rounded-xl px-5 py-4 text-base transition-all"
                >
                  <div className="flex items-center gap-3">
                    {selectedIndustry ? (
                      <>
                        {(() => {
                          const industry = industries.find(i => i.id === selectedIndustry);
                          const Icon = industry?.icon;
                          return Icon ? <Icon className="w-5 h-5 text-slate-900" /> : null;
                        })()}
                        <span className="font-semibold text-slate-900">
                          {industries.find(i => i.id === selectedIndustry) 
                            ? t(industries.find(i => i.id === selectedIndustry)!.label)
                            : ''}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-500">{t("industry")}</span>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isIndustryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isIndustryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl z-10 overflow-hidden max-h-60 overflow-y-auto">
                    {industries.map((industry) => (
                      <button
                        key={industry.id}
                        onClick={() => {
                          setSelectedIndustry(industry.id);
                          setIsIndustryDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                      >
                        <industry.icon className="w-5 h-5 text-slate-700" />
                        <span className="font-semibold text-slate-900">{t(industry.label)}</span>
                        {selectedIndustry === industry.id && <Check className="w-4 h-4 text-slate-900 ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-900">{t("knowledge.systemPromptLabel")}</label>
                  <button
                    onClick={handleImprovePrompt}
                    disabled={isImproving}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#005bbc] hover:text-[#004a9f] hover:bg-[#005bbc]/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-[#005bbc]/20"
                  >
                    {isImproving ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {t("knowledge.improveWithAI")}
                  </button>
                </div>
                <textarea 
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder={t("knowledge.systemPromptPlaceholder")}
                  className="w-full h-32 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 rounded-xl px-5 py-4 text-base transition-all resize-none"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-[#005bbc]/10 text-[#005bbc] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border-2 border-[#005bbc]/20">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{t("knowledge.uploadTitle")}</h3>
                <p className="text-slate-600 mt-2 text-sm max-w-xs mx-auto">{t("knowledge.uploadDesc")}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-8 mt-8 border-t-2 border-slate-200">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-colors
              ${step === 1 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-100'
              }`}
            disabled={step === 1}
          >
            {t("common.back")}
          </button>

          <button
            onClick={() => step < 2 ? setStep(prev => prev + 1) : handleSubmit()}
            disabled={isSubmitting}
            className={`bg-[#005bbc] hover:bg-[#004a9f] text-white border-2 border-[#005bbc] px-8 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed
              ${isSubmitting ? 'pl-6 pr-8' : ''}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('common.creating')}
              </>
            ) : (
              <>
                {step === 2 ? t("common.create") : t("common.next")}
                {step < 2 && <ArrowRight className="w-4 h-4 rtl:rotate-180" />} 
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
