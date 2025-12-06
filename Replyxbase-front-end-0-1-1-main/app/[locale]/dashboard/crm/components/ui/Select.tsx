import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ElementType;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useOutsideClick(() => setIsOpen(false));

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2.5 bg-white border-2 rounded-xl transition-all duration-200 ${
          isOpen 
            ? 'border-[#005bbc]' 
            : 'border-slate-200 hover:border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`flex items-center gap-2 truncate ${!selectedOption ? 'text-slate-400' : 'text-slate-900'}`}>
          {selectedOption?.icon && <selectedOption.icon className="w-4 h-4 text-slate-500" />}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-200 rounded-xl overflow-hidden py-1 max-h-60 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                  option.value === value
                    ? 'bg-[#005bbc]/10 text-[#005bbc] font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {option.icon && <option.icon className={`w-4 h-4 ${option.value === value ? 'text-[#005bbc]' : 'text-slate-400'}`} />}
                  {option.label}
                </div>
                {option.value === value && <Check className="w-4 h-4 text-[#005bbc]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
