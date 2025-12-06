/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

/**
 * Props for the InputField component.
 */
interface InputFieldProps {
  /** Label for the input field */
  label: string;
  /** Value of the input field */
  value: any;
  /** Callback when the value changes */
  onChange: (e: any) => void;
  /** Type of the input field (text, select, textarea, etc.) */
  type?: string;
  /** Options for select input */
  options?: string[];
  /** Number of rows for textarea */
  rows?: number;
  /** Additional props */
  [key: string]: any;
}

/**
 * A reusable input field component that supports text, select, and textarea types.
 */
export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  options = [],
  rows = 1,
  ...props 
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
    {type === 'select' ? (
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] rounded-xl focus:outline-none focus:ring-0 transition-all"
        {...props}
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] rounded-xl focus:outline-none focus:ring-0 transition-all resize-none"
        {...props}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] rounded-xl focus:outline-none focus:ring-0 transition-all"
        {...props}
      />
    )}
  </div>
);