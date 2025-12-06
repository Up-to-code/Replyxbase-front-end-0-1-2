"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, Check, Zap, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { getBillingInfo, getAllPlans, type BillingInfo, type Plan } from '@/app/actions/settings/billing';
import { Organization } from '@prisma/client';
import { PlanUpgradeModal } from './PlanUpgradeModal';

interface BillingSettingsProps {
  organization: Organization;
}

export const BillingSettings: React.FC<BillingSettingsProps> = ({ organization }) => {
  const t = useTranslations("Dashboard.Settings.Billing");
  const [isLoading, setIsLoading] = useState(true);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, [organization.id]);

  const loadBillingData = async () => {
    setIsLoading(true);
    try {
      const [billingResult, plansResult] = await Promise.all([
        getBillingInfo(organization.id),
        getAllPlans(),
      ]);

      if (billingResult.success && billingResult.data) {
        setBillingInfo(billingResult.data);
      } else {
        toast.error(billingResult.error || "Failed to load billing information");
      }

      if (plansResult.success && plansResult.data) {
        setAvailablePlans(plansResult.data);
      }
    } catch (error) {
      console.error("Failed to load billing data:", error);
      toast.error("Failed to load billing data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeSuccess = () => {
    loadBillingData(); // Reload billing data after upgrade
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-10">
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse mb-3" />
          <div className="h-5 w-96 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-8">
          <div className="bg-[#005bbc] rounded-xl p-8 h-48 animate-pulse" />
          <div className="bg-white border-2 border-slate-200 rounded-xl p-8 h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  const currentPlan = billingInfo?.currentPlan;
  const nextBillingDate = billingInfo?.nextBillingDate;

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900">{t("title")}</h2>
        <p className="text-base text-slate-500 mt-2">{t("description")}</p>
      </div>

      <div className="space-y-8">
        {/* Current Plan */}
        {currentPlan ? (
        <div className="bg-[#005bbc] rounded-xl p-8 text-white relative overflow-hidden border-2 border-[#005bbc]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-4 border-2 border-white/20">
                <Zap className="w-3 h-3 text-white" />
                  <span>{currentPlan.name}</span>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {currentPlan.currency === "USD" ? "$" : currentPlan.currency}{currentPlan.price}
                  <span className="text-lg text-white/80 font-normal">/mo</span>
                </h3>
                {nextBillingDate && (
                  <p className="text-white/80 text-sm">
                    Billed monthly. Next billing date: {nextBillingDate.toLocaleDateString()}
                  </p>
                )}
                <div className="mt-4 space-y-1 text-sm text-white/80">
                  <p>Organizations: {currentPlan.orgLimit}</p>
                  <p>Agents: {currentPlan.agentLimit}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUpgradeModalOpen(true)}
                className="bg-white text-[#005bbc] hover:bg-slate-50 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors border-2 border-white"
              >
              Upgrade Plan
            </button>
          </div>
        </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-8 border-2 border-slate-200 text-center">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Plan</h3>
            <p className="text-slate-500">Select a plan to get started</p>
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">{t("paymentMethods.title")}</h3>
            <button 
              onClick={() => toast.info("Payment method management coming soon!")}
              className="text-sm font-semibold text-[#005bbc] hover:text-[#004a9f]"
            >
              + Add Method
            </button>
          </div>

          <div className="space-y-4">
            {billingInfo?.paymentMethods && billingInfo.paymentMethods.length > 0 ? (
              billingInfo.paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-50 rounded flex items-center justify-center border-2 border-slate-200">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                      <p className="text-sm font-bold text-slate-900">{method.type} ending in {method.last4}</p>
                      <p className="text-xs text-slate-500">Expiry {method.expiry}</p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border-2 border-slate-200">Default</span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center border-2 border-slate-200">
                  <CreditCard className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">No payment methods</p>
                <p className="text-xs text-slate-500">Add a payment method to manage your billing</p>
              </div>
            )}
          </div>
        </div>

        {/* Plan Upgrade Modal */}
        <PlanUpgradeModal
          open={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          organizationId={organization.id}
          currentPlanId={billingInfo?.currentPlan?.id}
          onUpgradeSuccess={handleUpgradeSuccess}
        />

        {/* Billing History */}
        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
          <div className="p-8 border-b-2 border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">{t("history.title")}</h3>
          </div>
          {billingInfo?.billingHistory && billingInfo.billingHistory.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-8 text-xs font-bold text-slate-500 uppercase">Invoice</th>
                <th className="text-left py-4 px-8 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="text-left py-4 px-8 text-xs font-bold text-slate-500 uppercase">Amount</th>
                <th className="text-right py-4 px-8 text-xs font-bold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {billingInfo.billingHistory.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-8 text-sm font-medium text-slate-900">{invoice.invoice || invoice.id}</td>
                    <td className="py-4 px-8 text-sm text-slate-500">{invoice.date.toLocaleDateString()}</td>
                    <td className="py-4 px-8 text-sm font-medium text-slate-900">${invoice.amount.toFixed(2)}</td>
                  <td className="py-4 px-8 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border-2 ${
                        invoice.status === "paid" 
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {invoice.status === "paid" && <Check className="w-3 h-3" />}
                        {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center border-2 border-slate-200">
                <Check className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600 mb-1">No billing history</p>
              <p className="text-xs text-slate-500">Your billing history will appear here once you have transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
