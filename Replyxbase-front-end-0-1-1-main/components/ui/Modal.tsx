import React, { HTMLAttributes, forwardRef, ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, title, children, className = "", ...props }, ref) => {
    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <div
          ref={ref}
          className={`bg-white rounded-2xl border-2 border-slate-200 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col ${className}`}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b-2 border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }
);
Modal.displayName = "Modal";

const ModalHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    />
  )
);
ModalHeader.displayName = "ModalHeader";

const ModalContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`p-6 overflow-y-auto flex-1 ${className}`}
      {...props}
    />
  )
);
ModalContent.displayName = "ModalContent";

const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center justify-end gap-3 p-6 border-t-2 border-slate-200 ${className}`}
      {...props}
    />
  )
);
ModalFooter.displayName = "ModalFooter";

export { Modal, ModalHeader, ModalContent, ModalFooter };

