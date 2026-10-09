import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectPickerProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  hasError?: boolean;
  error?: string | null;
  dataField?: string;
  emptyMessage?: string;
  /** Optional hint under the closed trigger when no error */
  className?: string;
};

/**
 * Custom select matching StationPicker / booking form styling.
 * Native <select> menus can't be rounded — this one can.
 */
export function SelectPicker({
  options,
  value,
  onChange,
  onBlur,
  placeholder = 'Select…',
  disabled = false,
  loading = false,
  hasError = false,
  error = null,
  dataField,
  emptyMessage = 'No options available',
  className = '',
}: SelectPickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value) || null;
  const display = selected?.label || '';

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onBlur]);

  return (
    <div ref={rootRef} className={`relative z-10 ${open ? 'z-[100]' : ''} ${className}`}>
      <button
        type="button"
        data-field={dataField}
        disabled={disabled || loading}
        aria-invalid={hasError || undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => {
          if (disabled || loading) return;
          setOpen((v) => !v);
        }}
        className={`flex h-12 w-full items-center justify-between gap-3 rounded-full border bg-white px-5 text-left text-sm outline-none transition-colors ${
          hasError
            ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-200'
            : 'border-black/10 focus-visible:border-[#00473E]/40 focus-visible:ring-2 focus-visible:ring-[#00473E]/15'
        } ${disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${
          open ? 'border-[#00473E]/40 ring-2 ring-[#00473E]/15' : ''
        }`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${
            display ? 'font-medium text-[#111]' : 'text-[#9aa3a0]'
          }`}
        >
          {loading ? 'Loading…' : display || placeholder}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-[#00473E] transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-[100] mt-2 overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white shadow-[0_16px_40px_rgba(0,71,62,0.12)]"
        >
          <div className="max-h-64 overflow-y-auto py-1.5">
            {options.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#5c6562]">{emptyMessage}</p>
            ) : (
              options.map((opt) => {
                const active = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    disabled={opt.disabled}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${
                      opt.disabled
                        ? 'cursor-not-allowed text-[#9aa3a0]'
                        : active
                          ? 'bg-[#00473E]/[0.08] font-semibold text-[#00473E]'
                          : 'text-[#222] hover:bg-[#00473E]/[0.06]'
                    }`}
                    onClick={() => {
                      if (opt.disabled) return;
                      // Do not call onBlur here — parent state may not have
                      // committed yet, so blur validation would see a stale empty value.
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <span className="min-w-0 flex-1 break-words">{opt.label}</span>
                    {active && <Check className="size-4 shrink-0 text-[#00473E]" aria-hidden />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
