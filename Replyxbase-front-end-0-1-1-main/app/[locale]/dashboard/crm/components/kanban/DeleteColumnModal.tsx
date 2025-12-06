import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface DeleteColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  columnTitle: string;
}

export const DeleteColumnModal: React.FC<DeleteColumnModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  columnTitle
}) => {
  const modalRef = useOutsideClick(onClose);
  const t = useTranslations("Dashboard.CRM.Kanban.DeleteColumn");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-2xl border-2 border-slate-200 max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#EF4444]/10 rounded-full flex items-center justify-center border-2 border-[#EF4444]/20">
                  <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{t("title") || "Delete Column"}</h3>
                  <p className="text-sm text-slate-600">{t("subtitle") || "This action cannot be undone."}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-6 border-2 border-slate-200">
                <p className="font-medium text-slate-900 text-center">"{columnTitle}"</p>
              </div>
              
              <p className="text-slate-700 mb-6">
                {t("confirmation") || "Are you sure you want to delete this column? All bookings in this column should be moved first."}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                >
                  {t("cancel") || "Cancel"}
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white border-2 border-[#EF4444] rounded-xl font-medium transition-all duration-200"
                >
                  {t("delete") || "Delete Column"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
