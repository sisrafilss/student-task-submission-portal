'use client';

import { getIconComponent } from '@/lib/icon-mapper';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

export interface SelectFilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
}

export interface SelectFilterProps {
  paramName: string;
  placeholder?: string;
  options: SelectFilterOption[];
  allLabel?: string;
  icon?: string;
  prefix?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  iconClassName?: string;
  debounceMs?: number;
}

export default function SelectFilter({
  paramName,
  placeholder = 'Select option',
  options,
  allLabel = 'All Options',
  icon,
  prefix,
  className = '',
  triggerClassName = '',
  iconClassName = '',
  debounceMs = 300,
}: SelectFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const generatedId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Current active value from URL params
  const currentUrlValue = searchParams.get(paramName) || 'All';

  // Build full options array including the "All" category option
  const allCategoryOption: SelectFilterOption = useMemo(
    () => ({ label: allLabel, value: 'All' }),
    [allLabel]
  );

  const fullOptions = useMemo(
    () => [allCategoryOption, ...options],
    [allCategoryOption, options]
  );

  // Identify currently active option
  const selectedOption = useMemo(() => {
    return fullOptions.find((opt) => opt.value === currentUrlValue) || allCategoryOption;
  }, [fullOptions, currentUrlValue, allCategoryOption]);

  const targetLabel = selectedOption.label;

  // Input value state for live typing
  const [inputValue, setInputValue] = useState(targetLabel);
  const [prevValue, setPrevValue] = useState(currentUrlValue);

  if (currentUrlValue !== prevValue) {
    setPrevValue(currentUrlValue);
    if (!isFocused) {
      setInputValue(targetLabel);
    }
  }

  const debouncedSearch = useDebounce(inputValue, debounceMs);

  // Filter options based on user typing
  const filteredOptions = useMemo(() => {
    if (!isFocused || !inputValue.trim()) {
      return fullOptions;
    }
    const query = debouncedSearch.toLowerCase().trim();
    return fullOptions.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [fullOptions, debouncedSearch, inputValue, isFocused]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        setInputValue(selectedOption.label);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, selectedOption]);

  // Scroll active item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      activeEl?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  // Apply selection and update URL
  const handleSelectOption = useCallback(
    (option: SelectFilterOption) => {
      const params = new URLSearchParams(searchParams.toString());

      if (option.value === 'All') {
        params.delete(paramName);
      } else {
        params.set(paramName, option.value);
      }
      params.set('page', '1');

      setInputValue(option.label);
      setIsOpen(false);
      setIsFocused(false);
      setHighlightedIndex(-1);

      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [paramName, router, searchParams]
  );

  const handleFocus = () => {
    if (isPending) return;
    setIsFocused(true);
    setIsOpen(true);
    setInputValue('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isPending) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
        setIsFocused(true);
        setInputValue('');
        setHighlightedIndex(0);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        } else if (filteredOptions.length > 0 && inputValue.trim()) {
          const exact = filteredOptions.find(
            (o) => o.label.toLowerCase() === inputValue.toLowerCase().trim()
          );
          if (exact) handleSelectOption(exact);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setIsFocused(false);
        setInputValue(selectedOption.label);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const activePlaceholder = isFocused ? selectedOption.label : placeholder;

  return (
    <div ref={containerRef} className={cn('relative w-auto min-w-[150px] sm:min-w-[170px]', className)}>
      {/* Combobox Trigger Box */}
      <div
        onClick={() => {
          if (!isPending) {
            inputRef.current?.focus();
            if (!isOpen) setIsOpen(true);
          }
        }}
        className={cn(
          'border-input bg-card text-foreground flex h-9 w-full items-center overflow-hidden rounded-lg border transition-colors shadow-xs',
          'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
          'hover:bg-muted/30 cursor-text',
          isPending && 'opacity-60 cursor-not-allowed',
          triggerClassName
        )}
      >
        {/* Left Icon with subtle vertical divider */}
        {icon && (
          <div className="border-border text-muted-foreground flex h-full shrink-0 items-center justify-center border-r px-2 bg-muted/20">
            {React.createElement(getIconComponent(icon), {
              className: cn('size-3.5 shrink-0', iconClassName),
            })}
          </div>
        )}

        {/* Optional Prefix */}
        {prefix && <div className="flex h-full shrink-0 items-center pl-2 pr-0">{prefix}</div>}

        {/* Live Search & Filter Input */}
        <input
          ref={inputRef}
          id={generatedId}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${generatedId}-listbox`}
          aria-autocomplete="list"
          disabled={isPending}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!isOpen) setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={activePlaceholder}
          autoComplete="off"
          className="placeholder:text-muted-foreground text-foreground h-full min-w-0 flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-xs md:text-sm outline-none whitespace-nowrap overflow-hidden text-ellipsis font-medium"
        />

        {/* Right Chevron Button */}
        <button
          type="button"
          tabIndex={-1}
          aria-label="Toggle options"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            if (!isPending) {
              if (isOpen) {
                setIsOpen(false);
                setIsFocused(false);
                setInputValue(selectedOption.label);
              } else {
                inputRef.current?.focus();
                handleFocus();
              }
            }
          }}
          className="text-muted-foreground hover:text-foreground flex h-full shrink-0 items-center justify-center px-2 transition-colors cursor-pointer"
        >
          <ChevronDown
            className={cn('size-3.5 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>
      </div>

      {/* Suggestions Dropdown Popup (Auto-fits full option content width) */}
      {isOpen && (
        <div
          id={`${generatedId}-listbox`}
          role="listbox"
          className="bg-popover text-popover-foreground border-border absolute left-0 top-full z-50 mt-1.5 w-max min-w-full max-w-sm sm:max-w-md rounded-lg border p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95"
        >
          <div ref={listRef} className="max-h-56 overflow-y-auto space-y-0.5 py-0.5 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="text-muted-foreground px-3 py-3 text-center text-xs">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.value === currentUrlValue;
                const isHighlighted = index === highlightedIndex;
                const ItemIcon = opt.icon;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectOption(opt)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap',
                      isHighlighted && !isSelected && 'bg-muted/80 text-foreground',
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-muted/70 font-normal'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {opt.badge}
                      {ItemIcon && <ItemIcon className="size-3.5 shrink-0 text-muted-foreground" />}
                      <span>{opt.label}</span>
                    </span>
                    {isSelected && (
                      <Check className="text-primary size-3.5 shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
