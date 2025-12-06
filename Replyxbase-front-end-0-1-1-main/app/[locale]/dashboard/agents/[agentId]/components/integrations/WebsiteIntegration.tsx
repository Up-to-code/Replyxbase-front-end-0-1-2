import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Copy, Check, Globe, MessageSquare, Palette, Calendar, Phone, UserPlus, Code2, Settings, Shield, Monitor, HelpCircle, Plus, Trash2, ChevronRight, Languages, Link as LinkIcon, Edit2, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { Agent } from '@prisma/client';
import { updateAgent } from '@/app/actions/agent';
import { useRouter } from 'next/navigation';

interface WebsiteIntegrationProps {
  agent: Agent;
  onBack: () => void;
}

interface FAQ {
  question: string;
  answer: string;
}

interface WidgetAction {
  id: string;
  label: string;
  type: 'booking' | 'call' | 'link';
  value: string;
  icon: 'calendar' | 'phone' | 'user' | 'link' | 'message';
}

interface AgentConfig {
  website?: {
    color?: string;
    position?: 'left' | 'right';
    launcherStyle?: 'circle' | 'pill';
    launcherText?: string;
    logo?: string;
    theme?: 'light' | 'dark';
    language?: 'en' | 'ar';
    welcomeMessage?: string;
    allowedDomains?: string;
    removeBranding?: boolean;
    faqs?: FAQ[];
    actions?: WidgetAction[];
    domain?: string;
  };
}

export const WebsiteIntegration: React.FC<WebsiteIntegrationProps> = ({ agent, onBack }) => {
  const router = useRouter();
  const t = useTranslations("Dashboard.Agents.Detail.integrations.website");
  const config = useMemo(() => {
    return (agent.config as AgentConfig)?.website || {};
  }, [agent.config]);

  // Navigation
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'settings' | 'install'>('design');

  // Design State
  const [color, setColor] = useState(config.color || '#2563eb');
  const [position, setPosition] = useState<'left' | 'right'>(config.position || 'right');
  const [launcherStyle, setLauncherStyle] = useState<'circle' | 'pill'>(config.launcherStyle || 'circle');
  const [launcherText, setLauncherText] = useState(config.launcherText || t('launcherTextDefault'));
  const [logo, setLogo] = useState(config.logo || '');
  const [theme] = useState<'light' | 'dark'>(config.theme || 'light');

  // Content State (FAQ)
  const [faqs, setFaqs] = useState<FAQ[]>(config.faqs || []);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // Settings State
  const [domain] = useState(config.domain || 'example.com');
  const [welcomeMessage, setWelcomeMessage] = useState(config.welcomeMessage || t('welcomeMessageDefault'));
  const [allowedDomains, setAllowedDomains] = useState(config.allowedDomains || '');
  const [removeBranding, setRemoveBranding] = useState(config.removeBranding || false);
  const [language, setLanguage] = useState<'en' | 'ar'>(config.language || 'en');
  
  // Actions State
  const [actions, setActions] = useState<WidgetAction[]>(config.actions || [
    { id: '1', label: t('actionDefaultLabel'), type: 'booking', value: '', icon: 'calendar' }
  ]);
  const [editingAction, setEditingAction] = useState<WidgetAction | null>(null);

  // UI State
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewTab, setPreviewTab] = useState<'chat' | 'help'>('chat');
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const embedCode = `<script>
  window.replyxbaseConfig = {
    agentId: "${agent.id}",
    color: "${color}",
    position: "${position}",
    launcherStyle: "${launcherStyle}",
    launcherText: "${launcherText}",
    logo: "${logo}",
    theme: "${theme}",
    language: "${language}",
    welcomeMessage: "${welcomeMessage}",
    removeBranding: ${removeBranding},
    actions: ${JSON.stringify(actions)},
    faqs: ${JSON.stringify(faqs)}
  };
</script>
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success(t('codeCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  // Track changes
  useEffect(() => {
    const currentConfig = {
      color,
      position,
      launcherStyle,
      launcherText,
      logo,
      welcomeMessage,
      allowedDomains,
      removeBranding,
      language,
      faqs,
      actions
    };
    
    const originalConfig = config || {};
    const hasChanged = JSON.stringify(currentConfig) !== JSON.stringify(originalConfig);
    setHasChanges(hasChanged);
  }, [color, position, launcherStyle, launcherText, logo, welcomeMessage, allowedDomains, removeBranding, language, faqs, actions, config]);

  // Validate URL
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate color
  const validateColor = (colorValue: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue);
  };

  // Validate domain list
  const validateDomains = (domains: string): boolean => {
    if (!domains.trim()) return true;
    const domainList = domains.split(',').map(d => d.trim()).filter(Boolean);
    return domainList.every(domain => {
      // Basic domain validation
      return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(domain);
    });
  };

  const handleAddFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }
    
    if (newQuestion.length > 200) {
      toast.error('Question is too long (max 200 characters)');
      return;
    }
    
    if (newAnswer.length > 1000) {
      toast.error('Answer is too long (max 1000 characters)');
      return;
    }

    setFaqs([...faqs, { question: newQuestion.trim(), answer: newAnswer.trim() }]);
    setNewQuestion('');
    setNewAnswer('');
    setHasChanges(true);
  };

  const handleDeleteFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleAddAction = () => {
    const newAction: WidgetAction = {
      id: Date.now().toString(),
      label: t('newAction'),
      type: 'link',
      value: '',
      icon: 'link'
    };
    setActions([...actions, newAction]);
    setEditingAction(newAction);
  };

  const handleUpdateAction = (action: WidgetAction) => {
    // Clear previous errors for this action
    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`action_${action.id}_`)) {
        delete newErrors[key];
      }
    });
    
    // Validate action
    const errors: Record<string, string> = {};
    
    if (!action.label.trim()) {
      errors[`action_${action.id}_label`] = 'Label is required';
    }
    
    if (action.type === 'call' && !action.value.trim()) {
      errors[`action_${action.id}_phone`] = 'Phone number is required';
    } else if (action.type === 'call' && action.value.trim() && !/^\+?[\d\s\-()]+$/.test(action.value)) {
      errors[`action_${action.id}_phone`] = 'Invalid phone number format';
    }
    
    if (action.type === 'link' && !action.value.trim()) {
      errors[`action_${action.id}_url`] = 'URL is required';
    } else if (action.type === 'link' && action.value.trim() && !validateUrl(action.value)) {
      errors[`action_${action.id}_url`] = 'Invalid URL format';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors({...newErrors, ...errors});
    } else {
      setValidationErrors(newErrors);
    }
    
    setActions(actions.map(a => a.id === action.id ? action : a));
    setHasChanges(true);
  };

  const handleDeleteAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
    if (editingAction?.id === id) setEditingAction(null);
    setHasChanges(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate color
    if (!validateColor(color)) {
      errors.color = 'Invalid color format. Use hex format (e.g., #005bbc)';
    }
    
    // Validate logo URL if provided
    if (logo && !validateUrl(logo)) {
      errors.logo = 'Invalid logo URL format';
    }
    
    // Validate welcome message
    if (!welcomeMessage.trim()) {
      errors.welcomeMessage = 'Welcome message is required';
    } else if (welcomeMessage.length > 500) {
      errors.welcomeMessage = 'Welcome message is too long (max 500 characters)';
    }
    
    // Validate launcher text for pill style
    if (launcherStyle === 'pill' && !launcherText.trim()) {
      errors.launcherText = 'Launcher text is required for pill style';
    } else if (launcherText.length > 50) {
      errors.launcherText = 'Launcher text is too long (max 50 characters)';
    }
    
    // Validate domains
    if (!validateDomains(allowedDomains)) {
      errors.allowedDomains = 'Invalid domain format. Use comma-separated list (e.g., example.com, myapp.com)';
    }
    
    // Validate actions
    actions.forEach((action) => {
      if (!action.label.trim()) {
        errors[`action_${action.id}_label`] = 'Action label is required';
      }
      if (action.type === 'call' && !/^\+?[\d\s\-()]+$/.test(action.value)) {
        errors[`action_${action.id}_phone`] = 'Invalid phone number format';
      }
      if (action.type === 'link' && !validateUrl(action.value)) {
        errors[`action_${action.id}_url`] = 'Invalid URL format';
      }
    });
    
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
      const newConfig: AgentConfig = {
        ...(agent.config as AgentConfig || {}),
        website: {
          domain,
          color,
          position,
          launcherStyle,
          launcherText,
          logo,
          theme,
          language,
          welcomeMessage: welcomeMessage.trim(),
          allowedDomains: allowedDomains.trim(),
          removeBranding,
          faqs: faqs.map(faq => ({
            question: faq.question.trim(),
            answer: faq.answer.trim()
          })),
          actions: actions.map(action => ({
            ...action,
            label: action.label.trim(),
            value: action.value.trim()
          }))
        }
      };

      await updateAgent(agent.id, { config: newConfig });
      
      toast.success(t('settingsSaved'));
      setHasChanges(false);
      setLastSaved(new Date());
      router.refresh();
    } catch (error) {
      console.error('Failed to save settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(t('settingsSaveError') + (errorMessage ? `: ${errorMessage}` : ''));
    } finally {
      setIsSaving(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'user': return <UserPlus className="w-4 h-4" />;
      case 'link': return <LinkIcon className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{t('title')}</h3>
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
            className="flex items-center gap-2 px-6 py-2.5 bg-[#005bbc] hover:bg-[#004a9f] text-white border-2 border-[#005bbc] rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('saving')}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {t('saveChanges')}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 flex flex-col bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b-2 border-slate-200">
            <button 
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'design' ? 'border-[#005bbc] text-[#005bbc]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              <Palette className="w-4 h-4" />
              {t('tabs.design')}
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'content' ? 'border-[#005bbc] text-[#005bbc]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              <HelpCircle className="w-4 h-4" />
              {t('tabs.content')}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'border-[#005bbc] text-[#005bbc]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              <Settings className="w-4 h-4" />
              {t('tabs.settings')}
            </button>
            <button 
              onClick={() => setActiveTab('install')}
              className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'install' ? 'border-[#005bbc] text-[#005bbc]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              <Code2 className="w-4 h-4" />
              {t('tabs.install')}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {activeTab === 'design' && (
              <div className="space-y-8 animate-fade-in">
                {/* Brand Color */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {t('design.brandColor')}
                    <div className="group relative">
                      <Info className="w-4 h-4 text-slate-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-xs rounded-lg z-10">
                        Choose a color that matches your brand. This will be used for the widget header and launcher button.
                      </div>
                    </div>
                  </label>
                  <div className="flex gap-3">
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden border-2 border-slate-200">
                      <input 
                        type="color" 
                        value={color}
                        onChange={(e) => {
                          setColor(e.target.value);
                          setHasChanges(true);
                        }}
                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                      />
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={color}
                        onChange={(e) => {
                          setColor(e.target.value);
                          setHasChanges(true);
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 outline-none transition-all uppercase font-mono text-sm ${validationErrors.color ? 'border-red-500' : ''}`}
                        placeholder="#005bbc"
                      />
                      {validationErrors.color && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.color}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Launcher Style */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900">{t('design.launcherStyle')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setLauncherStyle('circle')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${launcherStyle === 'circle' ? 'border-[#005bbc] bg-[#005bbc]/10 text-[#005bbc]' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-current opacity-20" />
                      <span className="text-xs font-medium">{t('design.circle')}</span>
                    </button>
                    <button 
                      onClick={() => setLauncherStyle('pill')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${launcherStyle === 'pill' ? 'border-[#005bbc] bg-[#005bbc]/10 text-[#005bbc]' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                    >
                      <div className="w-12 h-6 rounded-full bg-current opacity-20" />
                      <span className="text-xs font-medium">{t('design.pill')}</span>
                    </button>
                  </div>
                  {launcherStyle === 'pill' && (
                    <div>
                      <input 
                        type="text" 
                        value={launcherText}
                        onChange={(e) => {
                          setLauncherText(e.target.value);
                          setHasChanges(true);
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 outline-none transition-all text-sm ${validationErrors.launcherText ? 'border-red-500' : ''}`}
                        placeholder={t('design.launcherTextPlaceholder')}
                        maxLength={50}
                      />
                      {validationErrors.launcherText && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.launcherText}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">{launcherText.length}/50 characters</p>
                    </div>
                  )}
                </div>

                {/* Position */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900">{t('design.position')}</label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setPosition('left')}
                      className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${position === 'left' ? 'bg-white text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      {t('design.bottomLeft')}
                    </button>
                    <button 
                      onClick={() => setPosition('right')}
                      className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${position === 'right' ? 'bg-white text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      {t('design.bottomRight')}
                    </button>
                  </div>
                </div>

                {/* Logo */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900">{t('design.customLogo')}</label>
                  <div className="flex gap-3">
                    <input 
                      type="url" 
                      value={logo}
                      onChange={(e) => {
                        setLogo(e.target.value);
                        setHasChanges(true);
                      }}
                      className={`flex-1 px-4 py-2.5 rounded-lg bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 outline-none transition-all text-sm ${validationErrors.logo ? 'border-red-500' : ''}`}
                      placeholder={t('design.logoPlaceholder')}
                    />
                  </div>
                  {validationErrors.logo && (
                    <p className="text-xs text-red-500">{validationErrors.logo}</p>
                  )}
                  <p className="text-xs text-slate-500">{t('design.logoHint')}</p>
                  {logo && validateUrl(logo) && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-lg border-2 border-slate-200">
                      <p className="text-xs font-medium text-slate-700 mb-1">Preview:</p>
                      <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-slate-200 bg-white relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={logo} 
                          alt="Logo preview" 
                          className="w-full h-full object-cover"
                          onError={() => setValidationErrors({...validationErrors, logo: 'Failed to load image. Please check the URL.'})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-8 animate-fade-in">
                {/* Welcome Message */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {t('content.welcomeMessage')}
                    <span className="text-xs font-normal text-slate-500">({welcomeMessage.length}/500)</span>
                  </label>
                  <textarea 
                    value={welcomeMessage}
                    onChange={(e) => {
                      setWelcomeMessage(e.target.value);
                      setHasChanges(true);
                    }}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 outline-none transition-all resize-none h-24 text-sm ${validationErrors.welcomeMessage ? 'border-red-500' : ''}`}
                    placeholder={t('content.welcomeMessagePlaceholder')}
                    maxLength={500}
                  />
                  {validationErrors.welcomeMessage && (
                    <p className="text-xs text-red-500">{validationErrors.welcomeMessage}</p>
                  )}
                </div>

                {/* FAQ Editor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-900">{t('content.faqs')}</label>
                    <span className="text-xs text-slate-500">{t('content.questionsCount', { count: faqs.length })}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200 group hover:border-slate-300 transition-all">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1 flex-1">
                            <p className="font-semibold text-sm text-gray-900">{faq.question}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{faq.answer}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteFaq(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl space-y-3 bg-slate-50/50">
                    <input 
                      type="text" 
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white border-2 border-slate-200 focus:border-[#005bbc] focus:ring-0 outline-none text-sm"
                      placeholder={t('content.questionPlaceholder')}
                    />
                    <textarea 
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white border-2 border-slate-200 focus:border-[#005bbc] focus:ring-0 outline-none text-sm h-20 resize-none"
                      placeholder={t('content.answerPlaceholder')}
                    />
                    <button 
                      onClick={handleAddFaq}
                      disabled={!newQuestion.trim() || !newAnswer.trim()}
                      className="w-full py-2 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-900 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      {t('content.addQuestion')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8 animate-fade-in">
                {/* Language */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-slate-600" />
                    {t('settings.language')}
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      {t('settings.english')}
                    </button>
                    <button 
                      onClick={() => setLanguage('ar')}
                      className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${language === 'ar' ? 'bg-white text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      {t('settings.arabic')}
                    </button>
                  </div>
                </div>

                {/* Custom Actions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-900">{t('settings.actions')}</label>
                    <button 
                      onClick={handleAddAction}
                      className="text-xs font-medium text-[#005bbc] hover:text-[#004a9f] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      {t('settings.addAction')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {actions.map((action) => (
                      <div key={action.id} className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
                        <div className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                            {getIcon(action.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{action.label}</p>
                            <p className="text-xs text-slate-500 capitalize">{action.type}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => setEditingAction(editingAction?.id === action.id ? null : action)}
                              className={`p-1.5 rounded-lg transition-colors ${editingAction?.id === action.id ? 'bg-[#005bbc]/10 text-[#005bbc]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAction(action.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {editingAction?.id === action.id && (
                          <div className="p-4 border-t-2 border-slate-200 bg-slate-50/50 space-y-3 animate-slide-down">
                            <div>
                              <label className="text-xs font-medium text-slate-700 mb-1 block">{t('settings.actionLabel')}</label>
                              <input 
                                type="text" 
                                value={action.label}
                                onChange={(e) => {
                                  const updatedAction = { ...action, label: e.target.value };
                                  handleUpdateAction(updatedAction);
                                }}
                                className={`w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 focus:border-[#005bbc] focus:ring-0 outline-none text-sm ${validationErrors[`action_${action.id}_label`] ? 'border-red-500' : ''}`}
                                maxLength={50}
                              />
                              {validationErrors[`action_${action.id}_label`] && (
                                <p className="text-xs text-red-500 mt-1">
                                  {validationErrors[`action_${action.id}_label`]}
                                </p>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-medium text-slate-700 mb-1 block">{t('settings.actionType')}</label>
                                <select 
                                  value={action.type}
                                  onChange={(e) => handleUpdateAction({ ...action, type: e.target.value as 'booking' | 'call' | 'link' })}
                                  className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 focus:border-[#005bbc] focus:ring-0 outline-none text-sm"
                                >
                                  <option value="booking">{t('settings.booking')}</option>
                                  <option value="call">{t('settings.call')}</option>
                                  <option value="link">{t('settings.link')}</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-slate-700 mb-1 block">{t('settings.actionIcon')}</label>
                                <select 
                                  value={action.icon}
                                  onChange={(e) => handleUpdateAction({ ...action, icon: e.target.value as 'calendar' | 'phone' | 'user' | 'link' | 'message' })}
                                  className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 focus:border-[#005bbc] focus:ring-0 outline-none text-sm"
                                >
                                  <option value="calendar">{t('settings.iconCalendar')}</option>
                                  <option value="phone">{t('settings.iconPhone')}</option>
                                  <option value="user">{t('settings.iconUser')}</option>
                                  <option value="link">{t('settings.iconLink')}</option>
                                  <option value="message">{t('settings.iconMessage')}</option>
                                </select>
                              </div>
                            </div>
                            {action.type !== 'booking' && (
                              <div>
                                <label className="text-xs font-medium text-slate-700 mb-1 block">
                                  {action.type === 'call' ? t('settings.phoneNumber') : t('settings.url')}
                                </label>
                                <input 
                                  type={action.type === 'call' ? 'tel' : 'url'}
                                  value={action.value}
                                  onChange={(e) => {
                                    const updatedAction = { ...action, value: e.target.value };
                                    handleUpdateAction(updatedAction);
                                  }}
                                  className={`w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 focus:border-[#005bbc] focus:ring-0 outline-none text-sm ${validationErrors[`action_${action.id}_${action.type === 'call' ? 'phone' : 'url'}`] ? 'border-red-500' : ''}`}
                                  placeholder={action.type === 'call' ? t('settings.phonePlaceholder') : t('settings.urlPlaceholder')}
                                />
                                {validationErrors[`action_${action.id}_${action.type === 'call' ? 'phone' : 'url'}`] && (
                                  <p className="text-xs text-red-500 mt-1">
                                    {validationErrors[`action_${action.id}_${action.type === 'call' ? 'phone' : 'url'}`]}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-600" />
                    {t('settings.allowedDomains')}
                    <div className="group relative">
                      <Info className="w-4 h-4 text-slate-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-xs rounded-lg z-10">
                        Restrict widget loading to specific domains for security. Leave empty to allow all domains.
                      </div>
                    </div>
                  </label>
                  <textarea 
                    value={allowedDomains}
                    onChange={(e) => {
                      setAllowedDomains(e.target.value);
                      setHasChanges(true);
                    }}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 outline-none transition-all resize-none h-24 text-sm font-mono ${validationErrors.allowedDomains ? 'border-red-500' : ''}`}
                    placeholder={t('settings.domainsPlaceholder')}
                  />
                  {validationErrors.allowedDomains && (
                    <p className="text-xs text-red-500">{validationErrors.allowedDomains}</p>
                  )}
                  <p className="text-xs text-slate-500">{t('settings.domainsHint')}</p>
                </div>

                {/* Branding */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{t('settings.removeBranding')}</span>
                    <input type="checkbox" checked={removeBranding} onChange={(e) => setRemoveBranding(e.target.checked)} className="rounded border-slate-300 text-[#005bbc] focus:ring-[#005bbc]" />
                  </label>
                  <p className="text-xs text-slate-500">{t('settings.brandingHint')}</p>
                </div>
              </div>
            )}

            {activeTab === 'install' && (
              <div className="space-y-6 animate-fade-in">
                {/* Instructions Card */}
                <div className="p-5 bg-[#005bbc]/10 rounded-xl border-2 border-[#005bbc]/20 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#005bbc] text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 mb-1">{t('install.title')}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {t('install.description')}{' '}
                        <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">&lt;{t('install.descriptionCode')}&gt;</code>
                        {' '}{t('install.descriptionEnd')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Code Block */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-900">Embed Code</label>
                    <button 
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                        copied 
                          ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
                          : 'bg-[#005bbc] hover:bg-[#004a9f] text-white border-[#005bbc]'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="relative group">
                    <pre className="bg-slate-900 text-slate-100 p-5 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed border-2 border-slate-700 min-h-[200px]">
                      <code>{embedCode}</code>
                    </pre>
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium bg-slate-800/50 px-2 py-1 rounded border border-slate-700">
                        {embedCode.length} chars
                      </span>
                    </div>
                  </div>
                  
                  {copied && (
                    <div className="p-3 bg-[#10B981]/10 border-2 border-[#10B981]/20 rounded-lg flex items-center gap-2 text-sm text-[#10B981] animate-fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Code copied! Paste it in your website&apos;s <code className="bg-white/20 px-1.5 py-0.5 rounded">&lt;head&gt;</code> section.</span>
                    </div>
                  )}
                </div>

                {/* Quick Steps */}
                <div className="space-y-4 pt-4 border-t-2 border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900">Quick Steps:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#005bbc]/10 text-[#005bbc] flex items-center justify-center shrink-0 text-xs font-bold border-2 border-[#005bbc]/20">
                        1
                      </div>
                      <p className="text-sm text-slate-600 flex-1 pt-0.5">Click &quot;Copy Code&quot; button above</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#005bbc]/10 text-[#005bbc] flex items-center justify-center shrink-0 text-xs font-bold border-2 border-[#005bbc]/20">
                        2
                      </div>
                      <p className="text-sm text-slate-600 flex-1 pt-0.5">Open your website&apos;s HTML file or CMS editor</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#005bbc]/10 text-[#005bbc] flex items-center justify-center shrink-0 text-xs font-bold border-2 border-[#005bbc]/20">
                        3
                      </div>
                      <p className="text-sm text-slate-600 flex-1 pt-0.5">Paste the code just before the closing <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">&lt;/head&gt;</code> tag</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#005bbc]/10 text-[#005bbc] flex items-center justify-center shrink-0 text-xs font-bold border-2 border-[#005bbc]/20">
                        4
                      </div>
                      <p className="text-sm text-slate-600 flex-1 pt-0.5">Save and publish your website. The widget will appear automatically!</p>
                    </div>
                  </div>
                </div>

                {/* Example HTML */}
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                  <p className="text-xs font-bold text-slate-700 mb-2">Example HTML structure:</p>
                  <pre className="text-xs text-slate-600 font-mono leading-relaxed">
{`<html>
  <head>
    <!-- Your other head content -->
    ${embedCode.split('\n').slice(0, 2).join('\n    ')}
    ...
  </head>
  <body>
    <!-- Your website content -->
  </body>
</html>`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-8 bg-slate-50 rounded-xl border-2 border-slate-200 p-8 flex items-end justify-end min-h-[600px] relative overflow-hidden">
          <div className="absolute inset-0 pattern-grid-lg opacity-[0.03]" />
          
          {/* Preview Header */}
          <div className="p-4 border-b-2 border-slate-200/50 bg-white/50 backdrop-blur-sm flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Monitor className="w-4 h-4" />
              {t('preview.livePreview')}
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
               <span className="text-xs font-medium text-slate-600">{t('preview.connected')}</span>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="flex-1 relative p-8">
            {/* Mock Website Content */}
            <div className="max-w-3xl mx-auto space-y-8 opacity-20 pointer-events-none select-none filter blur-[1px]">
               <div className="h-12 w-48 bg-slate-300 rounded-lg" />
               <div className="h-64 w-full bg-slate-200 rounded-2xl" />
               <div className="space-y-4">
                 <div className="h-4 w-full bg-slate-200 rounded" />
                 <div className="h-4 w-3/4 bg-slate-200 rounded" />
                 <div className="h-4 w-5/6 bg-slate-200 rounded" />
               </div>
            </div>

            {/* Widget Preview */}
            <div className={`absolute bottom-8 ${position === 'left' ? 'left-8' : 'right-8'} flex flex-col items-end gap-4 transition-all duration-500`}>
              
              {/* Chat Window */}
              <div className="w-[380px] bg-white rounded-2xl border-2 border-slate-200 flex flex-col max-h-[600px] animate-slide-up origin-bottom-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {/* Header */}
                <div className="p-5 flex items-center justify-between text-white transition-colors duration-300" style={{ backgroundColor: color }}>
                  <div className="flex items-center gap-4">
                    {logo ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo} alt="Logo" className="w-full h-full object-cover" onError={(e: React.SyntheticEvent<HTMLImageElement>) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-base">{t('preview.supportAgent')}</h4>
                      <div className="flex items-center gap-1.5 opacity-90">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                        <p className="text-xs font-medium">{t('preview.online')}</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors" aria-label="Widget settings">
                    <Globe className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-white border-b-2 border-slate-200">
                  <button 
                    onClick={() => setPreviewTab('chat')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${previewTab === 'chat' ? 'border-[#005bbc] text-[#005bbc]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
                    style={{ borderColor: previewTab === 'chat' ? color : 'transparent', color: previewTab === 'chat' ? color : undefined }}
                  >
                    {t('preview.chat')}
                  </button>
                  <button 
                    onClick={() => setPreviewTab('help')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${previewTab === 'help' ? 'border-[#005bbc] text-[#005bbc]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
                    style={{ borderColor: previewTab === 'help' ? color : 'transparent', color: previewTab === 'help' ? color : undefined }}
                  >
                    {t('preview.help')}
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 bg-slate-50 p-5 flex flex-col gap-5 overflow-y-auto min-h-[300px]">
                  {previewTab === 'chat' ? (
                    <>
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 border-2 border-slate-300" />
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none text-sm text-slate-800 leading-relaxed border-2 border-slate-200">
                          {welcomeMessage}
                          {/* Render Actions */}
                          {actions.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-3">
                              {actions.map((action) => (
                                <button 
                                  key={action.id}
                                  className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                                >
                                  {getIcon(action.icon)}
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      {faqs.length > 0 ? (
                        faqs.map((faq, i) => (
                          <div key={i} className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
                            <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors">
                              <span className="font-medium text-sm text-slate-900">{faq.question}</span>
                              <ChevronRight className={`w-4 h-4 text-slate-400 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-400 text-sm">
                          {t('preview.noFaqs')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {previewTab === 'chat' && (
                  <div className="p-4 border-t-2 border-slate-200 bg-white">
                    <div className="bg-slate-50 rounded-full px-5 py-3 text-sm text-slate-400 border-2 border-slate-200 text-right">
                      {t('preview.typeMessage')}
                    </div>
                    {!removeBranding && (
                      <div className="flex justify-center mt-2">
                         <span className="text-[10px] text-slate-400 font-medium">{t('preview.poweredBy')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Launcher */}
              <div 
                className={`border-2 border-slate-200 cursor-pointer hover:scale-105 transition-transform duration-200 flex items-center justify-center text-white ${launcherStyle === 'pill' ? 'rounded-full px-6 py-3 gap-2' : 'w-14 h-14 rounded-full'}`}
                style={{ backgroundColor: color }}
              >
                <MessageSquare className={`${launcherStyle === 'pill' ? 'w-5 h-5' : 'w-7 h-7'}`} />
                {launcherStyle === 'pill' && <span className="font-bold text-sm">{launcherText}</span>}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
