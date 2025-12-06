"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Loader2, Check, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { getAllPlans, upgradePlan, type Plan } from '@/app/actions/settings/billing';

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
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

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

  const handleUpgrade = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan");
      return;
    }

    setIsUpgrading(true);
    try {
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
    <Modal
      open={open}
      onClose={onClose}
      title={t("upgradeModal.title") || "Upgrade Plan"}
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
          <div className="space-y-4">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentPlanId;
              const isSelected = selectedPlanId === plan.id;

              return (
                <button
                  key={plan.id}
                  onClick={() => !isCurrent && setSelectedPlanId(plan.id)}
                  disabled={isCurrent}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    isCurrent
                      ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#005bbc]/10 border-[#005bbc]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                        {isCurrent && (
                          <span className="px-2.5 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full border-2 border-slate-300">
                            Current
                          </span>
                        )}
                        {isSelected && !isCurrent && (
                          <Check className="w-5 h-5 text-[#005bbc]" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-slate-900">
                          {plan.currency === "USD" ? "$" : plan.currency}{plan.price}
                        </span>
                        <span className="text-sm text-slate-500">/month</span>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#005bbc]" />
                          <span>{plan.orgLimit} Organization{plan.orgLimit !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#005bbc]" />
                          <span>{plan.agentLimit} Agent{plan.agentLimit !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
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
  );
};

