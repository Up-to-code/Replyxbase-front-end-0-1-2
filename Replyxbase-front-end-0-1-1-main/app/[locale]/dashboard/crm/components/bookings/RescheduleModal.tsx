import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time: string) => Promise<void>;
  currentDate: Date;
  currentTime: string;
  isLoading?: boolean;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentDate,
  currentTime,
  isLoading
}) => {
  const t = useTranslations("Common"); // Assuming common translations or specific ones
  const format = useFormatter();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    
    await onConfirm(new Date(date), time);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border-2 border-slate-200"
            >
              <div className="p-6 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900">Reschedule Booking</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Current Schedule */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border-2 border-slate-100">
                    <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current</div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                             <Calendar className="w-4 h-4 text-slate-400" />
                             {format.dateTime(new Date(currentDate), { year: 'numeric', month: 'numeric', day: 'numeric' })}
                        </div>
                         <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                             <Clock className="w-4 h-4 text-slate-400" />
                             {currentTime}
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                    <div className="space-y-1 text-right">
                         <div className="text-xs font-semibold text-[#005bbc] uppercase tracking-wider">New</div>
                         <div className="flex items-center justify-end gap-2 text-sm font-bold text-[#005bbc]">
                             {date ? format.dateTime(new Date(date), { year: 'numeric', month: 'numeric', day: 'numeric' }) : 'Select Date'}
                        </div>
                         <div className="flex items-center justify-end gap-2 text-sm font-bold text-[#005bbc]">
                             {time || 'Select Time'}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Select New Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-[#005bbc] focus:ring-0 font-medium text-slate-900"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Select New Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-[#005bbc] focus:ring-0 font-medium text-slate-900"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !date || !time}
                    className="flex-1 px-4 py-3 bg-[#005bbc] text-white font-bold rounded-xl hover:bg-[#004a9f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Confirm Reschedule
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
