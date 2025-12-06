"use client";

import React, { useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useOrganizationStore, useUserStore } from "@/stores";

export function ErrorBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const { error: orgError } = useOrganizationStore();
  const { error: userError } = useUserStore();

  const error = orgError || userError;

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!error || !isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 px-4 py-2 bg-red-50 border-b-2 border-red-200 animate-in slide-in-from-top">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm font-medium text-red-900">{error}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-red-100 rounded-lg transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}

