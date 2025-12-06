import React from 'react';
import { Trash2, FileText } from 'lucide-react';
import { useRTL } from '@/hooks/useRTL';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
  onMarkAsDraft: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onDelete, onMarkAsDraft }) => {
  const { isRTL } = useRTL();
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div 
        className="fixed z-50 bg-white rounded-xl border-2 border-slate-200 py-1 w-48 animate-in fade-in zoom-in-95 duration-100"
        style={{ top: y, [isRTL ? 'right' : 'left']: x }}
      >
        <button
          onClick={() => {
            onMarkAsDraft();
            onClose();
          }}
          className={`w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}
        >
          <FileText className="w-4 h-4" />
          Mark as Draft
        </button>
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className={`w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}
        >
          <Trash2 className="w-4 h-4" />
          Delete Conversation
        </button>
      </div>
    </>
  );
};
