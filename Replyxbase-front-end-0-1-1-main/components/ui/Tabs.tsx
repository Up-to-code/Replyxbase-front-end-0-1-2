import React, { HTMLAttributes, forwardRef, createContext, useContext, useState, ReactNode } from "react";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value: controlledValue, onValueChange, children, className = "", ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;
    const handleValueChange = (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-xl bg-slate-50 p-1 border-2 border-slate-200 ${className}`}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className = "", children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.value === value;

    return (
      <button
        ref={ref}
        onClick={() => context.onValueChange(value)}
        className={`
          inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium
          transition-all focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20
          ${isActive 
            ? "bg-white text-[#005bbc] border-2 border-[#005bbc]/20" 
            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className = "", children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.value !== value) return null;

    return (
      <div
        ref={ref}
        className={`mt-4 focus:outline-none ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };

