"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import { Check } from "lucide-react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, checked, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId =
      id || label?.replace(/\s+/g, "-").toLowerCase() || generatedId;

    return (
      <label
        htmlFor={checkboxId}
        className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              w-5 h-5 rounded border-2 transition-all duration-200
              flex items-center justify-center
              ${
                checked
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                  : "bg-white border-[var(--color-border)] peer-hover:border-[var(--color-primary)]"
              }
            `}
          >
            {checked && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
        </div>
        {label && (
          <span className="text-sm text-[var(--color-text)]">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
