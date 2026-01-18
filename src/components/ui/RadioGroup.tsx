"use client";

import { createContext, useContext, ReactNode } from "react";

interface RadioGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  children,
  className = "",
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div role="radiogroup" className={`space-y-2 ${className}`}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioOptionProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function RadioOption({
  value,
  children,
  className = "",
}: RadioOptionProps) {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioOption must be used within a RadioGroup");
  }

  const isSelected = context.value === value;

  return (
    <label
      className={`
        flex items-center gap-3 cursor-pointer select-none
        p-3 rounded-lg border transition-all duration-200
        ${
          isSelected
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
            : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
        }
        ${className}
      `}
    >
      <div className="relative">
        <input
          type="radio"
          name={context.name}
          value={value}
          checked={isSelected}
          onChange={() => context.onChange(value)}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5 rounded-full border-2 transition-all duration-200
            flex items-center justify-center
            ${
              isSelected
                ? "border-[var(--color-primary)]"
                : "border-[var(--color-border)]"
            }
          `}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
          )}
        </div>
      </div>
      <span className="text-sm text-[var(--color-text)]">{children}</span>
    </label>
  );
}
