"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
  placeholder?: string;
  error?: string;
}

export function TagInput({
  tags,
  onAddTag,
  onRemoveTag,
  placeholder = "入力してEnter",
  error,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed) {
        if (!tags.includes(trimmed)) {
          onAddTag(trimmed);
        }
        setInputValue("");
      }
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      onRemoveTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      if (!tags.includes(trimmed)) {
        onAddTag(trimmed);
      }
      setInputValue("");
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          flex flex-wrap gap-2 p-3 rounded-lg
          border bg-white
          focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 focus-within:border-[var(--color-primary)]
          transition-all duration-200
          ${error ? "border-[var(--color-error)]" : "border-[var(--color-border)]"}
        `}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(index)}
              className="hover:bg-[var(--color-primary)]/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] bg-transparent"
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
