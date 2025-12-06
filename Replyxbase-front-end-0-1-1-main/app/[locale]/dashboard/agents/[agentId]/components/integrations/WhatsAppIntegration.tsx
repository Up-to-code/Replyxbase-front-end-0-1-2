import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Copy, Check, MessageCircle, Key, ExternalLink, Save, AlertCircle, CheckCircle2, Loader2, Info, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { Agent } from '@prisma/client';
import { updateAgent } from '@/app/actions/agent';
import { useRouter } from 'next/navigation';

interface WhatsAppIntegrationProps {
  agent: Agent;
  onBack: () => void;
}

export const WhatsAppIntegration: React.FC<WhatsAppIntegrationProps> = ({ agent, onBack }) => {
  const router = useRouter();
  const t = useTranslations("Dashboard.Agents.Detail.integrations.whatsapp");
  const config = useMemo(() => {
    return (agent.config as { whatsapp?: { phoneId?: string; token?: string } })?.whatsapp || {};
  }, [agent.config]);

  const [phoneId, setPhoneId] = useState(config.phoneId || '');
  const [token, setToken] = useState(config.token || '');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(!!(config.phoneId && config.token));

  const webhookUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/whatsapp/${agent.id}`;
  const verifyToken = agent.id; // Using agent ID as verify token for simplicity

  // Track changes
  useEffect(() => {
    const hasChanged = phoneId !== (config.phoneId || '') || token !== (config.token || '');
    setHasChanges(hasChanged);
  }, [phoneId, token, config]);

  // Validate phone number ID
  const validatePhoneId = (id: string): boolean => {
    return /^\d+$/.test(id.trim()) && id.trim().length >= 10;
  };

  // Validate access token
  const validateToken = (tokenValue: string): boolean => {
    return tokenValue.trim().length >= 20 && tokenValue.startsWith('EAAG');
  };

  const handleCopy = (text: string, type: 'url' | 'token') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
    toast.success(t('codeCopied'));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!phoneId.trim()) {
      errors.phoneId = 'Phone Number ID is required';
    } else if (!validatePhoneId(phoneId)) {
      errors.phoneId = 'Invalid Phone Number ID format. Must be numeric and at least 10 digits';
    }
    
    if (!token.trim()) {
      errors.token = 'Access Token is required';
    } else if (!validateToken(token)) {
      errors.token = 'Invalid Access Token format. Must start with EAAG and be at least 20 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    setIsSaving(true);
    setValidationErrors({});
    
    try {
      const newConfig = {
        ...(agent.config as Record<string, unknown> || {}),
        whatsapp: {
          phoneId: phoneId.trim(),
          token: token.trim()
        }
      };

      await updateAgent(agent.id, { config: newConfig });
      
      toast.success(t('settingsSaved'));
      setHasChanges(false);
      setLastSaved(new Date());
      setIsConnected(true);
      router.refresh();
    } catch (error) {
      console.error('Failed to save settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(t('settingsSaveError') + (errorMessage ? `: ${errorMessage}` : ''));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-slate-900 text-lg">{t('title')}</h3>
              {isConnected && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs font-medium border-2 border-[#10B981]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Connected
                </div>
              )}
            </div>
            <p className="text-sm text-slate-600">{t('subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Unsaved changes</span>
            </div>
          )}
          {lastSaved && !hasChanges && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#005bbc] hover:bg-[#004a9f] text-white border-2 border-[#005bbc] font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('saving')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t('saveConfiguration')}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b-2 border-slate-200 bg-[#10B981]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{t('configSteps')}</h3>
              <p className="text-sm text-slate-600">{t('configStepsDesc')}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Step 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#005bbc] text-white flex items-center justify-center font-bold text-sm border-2 border-[#005bbc]">1</div>
              <h4 className="font-bold text-slate-900 text-lg">{t('step1')}</h4>
            </div>
            <div className="ml-12 space-y-6">
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                {t('step1Desc')} <a href="#" className="text-[#005bbc] hover:underline inline-flex items-center gap-1 font-medium">Meta Developer Portal <ExternalLink className="w-3 h-3" /></a>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                    {t('phoneNumberId')}
                    <div className="group relative">
                      <Info className="w-4 h-4 text-slate-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-xs rounded-lg z-10">
                        Find this in your Meta Business App settings under WhatsApp &gt; API Setup
                      </div>
                    </div>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={phoneId}
                      onChange={(e) => {
                        setPhoneId(e.target.value);
                        setHasChanges(true);
                        setValidationErrors({...validationErrors, phoneId: ''});
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 outline-none transition-all ${validationErrors.phoneId ? 'border-red-500' : ''}`}
                      placeholder={t('phoneNumberIdPlaceholder')}
                    />
                  </div>
                  {validationErrors.phoneId && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.phoneId}</p>
                  )}
                  {phoneId && validatePhoneId(phoneId) && (
                    <p className="text-xs text-[#10B981] mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Valid format
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                    {t('accessToken')}
                    <div className="group relative">
                      <Info className="w-4 h-4 text-slate-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-xs rounded-lg z-10">
                        Generate a permanent token from Meta Developer Portal. Never share this token publicly.
                      </div>
                    </div>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={token}
                      onChange={(e) => {
                        setToken(e.target.value);
                        setHasChanges(true);
                        setValidationErrors({...validationErrors, token: ''});
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 outline-none transition-all ${validationErrors.token ? 'border-red-500' : ''}`}
                      placeholder={t('accessTokenPlaceholder')}
                    />
                  </div>
                  {validationErrors.token && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.token}</p>
                  )}
                  {token && validateToken(token) && (
                    <p className="text-xs text-[#10B981] mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Valid format
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-slate-200" />

          {/* Step 2 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#005bbc] text-white flex items-center justify-center font-bold text-sm border-2 border-[#005bbc]">2</div>
              <h4 className="font-bold text-slate-900 text-lg">{t('step2')}</h4>
            </div>
            <div className="ml-12 space-y-6">
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                {t('step2Desc')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border-2 border-slate-200 hover:border-[#005bbc]/30 transition-colors group">
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">{t('callbackUrl')}</label>
                  <div className="flex items-center justify-between gap-3 bg-slate-50 p-2 rounded-lg border-2 border-slate-200">
                    <code className="text-sm font-mono text-slate-900 truncate flex-1">{webhookUrl}</code>
                    <button onClick={() => handleCopy(webhookUrl, 'url')} className="p-1.5 hover:bg-white rounded-md transition-all text-slate-500 hover:text-[#005bbc]">
                      {copiedUrl ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-slate-200 hover:border-[#005bbc]/30 transition-colors group">
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">{t('verifyToken')}</label>
                  <div className="flex items-center justify-between gap-3 bg-slate-50 p-2 rounded-lg border-2 border-slate-200">
                    <code className="text-sm font-mono text-slate-900 truncate flex-1">{verifyToken}</code>
                    <button onClick={() => handleCopy(verifyToken, 'token')} className="p-1.5 hover:bg-white rounded-md transition-all text-slate-500 hover:text-[#005bbc]">
                      {copiedToken ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t-2 border-slate-200">
          {isConnected && (
            <div className="mb-4 p-4 bg-[#10B981]/10 border-2 border-[#10B981]/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 mb-1">Connection Active</p>
                  <p className="text-xs text-slate-600">
                    Your WhatsApp integration is connected and ready to receive messages. Make sure your webhook is configured in Meta Developer Portal.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#005bbc] hover:bg-[#004a9f] text-white border-2 border-[#005bbc] font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('saveConfiguration')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
