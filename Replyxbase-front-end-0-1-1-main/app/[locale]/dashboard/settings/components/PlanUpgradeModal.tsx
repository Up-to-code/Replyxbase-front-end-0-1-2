"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Loader2, Check, Zap } from 'lucide-react';
import { toast } from 'sonner';
import EmbeddedCheckout from '@/components/checkout/EmbeddedCheckout';
import { getAllPlans, upgradePlan, createCheckoutSession, type Plan } from '@/app/actions/settings/billing';

interface PlanUpgradeModalProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  currentPlanId?: string;
  onUpgradeSuccess?: () => void;
}

export const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  open,
  onClose,
  organizationId,
  currentPlanId,
  onUpgradeSuccess,
}) => {
  const t = useTranslations("Dashboard.Settings.Billing");
  const tPricing = useTranslations("Landing.Pricing");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Checkout State
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (open) {
      loadPlans();
    }
  }, [open]);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const result = await getAllPlans();
      if (result.success && result.data) {
        setPlans(result.data);
      } else {
        toast.error(result.error || "Failed to load plans");
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
      toast.error("Failed to load plans");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get features based on slug
  const getFeatures = (slug: string) => {
    switch(slug.toLowerCase()) {
      case 'starter':
        return [
          tPricing("features.5agents"),
          tPricing("features.10kconv"),
          tPricing("features.5members"),
          tPricing("features.allIntegrations")
        ];
      case 'pro':
        return [
           tPricing("features.unlimitedAgents"),
           tPricing("features.50kconv"),
           tPricing("features.unlimitedMembers"),
           tPricing("features.customIntegrations")
        ];
      case 'enterprise':
        return [
            tPricing("features.unlimitedAgents"),
            tPricing("features.unlimitedConv"),
            tPricing("features.unlimitedMembers"),
            tPricing("features.whiteLabel")
        ];
      default:
        return [];
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan");
      return;
    }

    setIsUpgrading(true);
    try {
      const selectedPlan = plans.find(p => p.id === selectedPlanId);

      // If the plan has a Polar Product ID, invoke the checkout flow
      if (selectedPlan?.polarProductId) {
        const result = await createCheckoutSession(selectedPlan.polarProductId, organizationId);
        if (result.success && result.url) {
            setCheckoutUrl(result.url);
            setShowCheckout(true);
            onClose(); // Close the modal to show the checkout
        } else {
             toast.error(result.error || "Failed to start checkout");
        }
        return; // Exit, don't do DB update here
      }

      // Legacy or free plan fallback (Direct DB Update)
      const result = await upgradePlan({
        organizationId,
        planId: selectedPlanId,
      });

      if (result.success) {
        toast.success("Plan upgraded successfully!");
        onUpgradeSuccess?.();
        onClose();
      } else {
        toast.error(result.error || "Failed to upgrade plan");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to upgrade plan");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={t("upgradeModal.title") || "Upgrade Plan"}
        className="max-w-4xl" // Wider modal for feature lists
      >
        <ModalContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No plans available</p>
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, staggerChildren: 0.1 }}
            >
              {plans.map((plan, index) => {
                const isCurrent = plan.id === currentPlanId;
                const isSelected = selectedPlanId === plan.id;
                const features = getFeatures(plan.slug);

                return (
                  <motion.button
                    layout
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: isCurrent ? 1 : 1.02 }}
                    whileTap={{ scale: isCurrent ? 1 : 0.98 }}
                    onClick={() => !isCurrent && setSelectedPlanId(plan.id)}
                    disabled={isCurrent}
                    className={`text-left p-6 rounded-2xl border-2 transition-colors h-full flex flex-col relative ${
                      isCurrent
                        ? 'bg-slate-50 border-slate-200 opacity-75 cursor-default'
                        : isSelected
                        ? 'bg-[#005bbc]/5 border-[#005bbc] ring-0 shadow-[0_0_20px_rgba(0,91,188,0.15)]' // Added subtle glow for selected
                        : 'bg-white border-slate-200 hover:border-[#005bbc]/30 hover:bg-slate-50/50'
                    }`}
                  >
                    {isCurrent && (
                        <div className="absolute top-4 right-4 px-2.5 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full border border-slate-300">
                          Current
                        </div>
                    )}
                     {isSelected && !isCurrent && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4"
                        >
                            <div className="w-6 h-6 bg-[#005bbc] rounded-full flex items-center justify-center text-white">
                                <Check className="w-4 h-4" />
                            </div>
                        </motion.div>
                    )}

                    <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-slate-900">
                        {plan.currency === "USD" ? "$" : plan.currency}{plan.price}
                      </span>
                      <span className="text-sm text-slate-500">/mo</span>
                    </div>

                    <div className="h-px bg-slate-100 my-4 w-full" />

                    <ul className="space-y-3 mb-4 flex-1">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                <Check className="w-4 h-4 text-[#005bbc] mt-0.5 shrink-0" />
                                <span className="leading-tight">{feature}</span>
                            </li>
                        ))}
                    </ul>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </ModalContent>
        <ModalFooter>
          <button
            onClick={onClose}
            disabled={isUpgrading}
            className="px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border-2 border-slate-200 disabled:opacity-50"
          >
            {t("upgradeModal.cancel") || "Cancel"}
          </button>
          <button
            onClick={handleUpgrade}
            disabled={isUpgrading || !selectedPlanId || selectedPlanId === currentPlanId}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#005bbc] hover:bg-[#004a9f] rounded-lg transition-colors border-2 border-[#005bbc] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpgrading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Upgrading...
              </>
            ) : (
              t("upgradeModal.upgrade") || "Upgrade Plan"
            )}
          </button>
        </ModalFooter>
      </Modal>

      <EmbeddedCheckout 
        open={showCheckout} 
        onClose={() => setShowCheckout(false)} 
        checkoutUrl={checkoutUrl || ""} 
      />
    </>
  );
};
