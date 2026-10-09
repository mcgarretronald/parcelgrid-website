import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  filterStations,
  stationOptionLabel,
  type Station,
} from '../../lib/stations';

type StationPickerProps = {
  stations: Station[];
  value: string;
  onChange: (agentId: string, station: Station | null) => void;
  onBlur?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  error?: string | null;
  hasError?: boolean;
  dataField?: string;
  disabled?: boolean;
};

type MenuPos = { top: number; left: number; width: number; maxHeight: number; openUp: boolean };

/**
 * App-style station picker: search merges town + shop into one field.
 * Dropdown is portalled so parent cards never clip the list.
 */
export function StationPicker({
  stations,
  value,
  onChange,
  onBlur,
  placeholder = 'Search town or station…',
  searchPlaceholder = 'Type a town or shop name…',
  emptyMessage = 'No stations match your search',
  loading = false,
  error = null,
  hasError = false,
  dataField,
  disabled = false,
}: StationPickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState<MenuPos | null>(null);

  const selected = useMemo(
    () => stations.find((s) => s.agentId === String(value)) || null,
    [stations, value],
  );

  const filtered = useMemo(
    () => filterStations(stations, query).slice(0, 80),
    [stations, query],
  );

  const updatePos = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 8;
    const preferred = 320;
    const spaceBelow = window.innerHeight - rect.bottom - gap - 12;
    const spaceAbove = rect.top - gap - 12;
    const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(160, Math.min(preferred, openUp ? spaceAbove : spaceBelow));
    setPos({
      top: openUp ? rect.top - gap : rect.bottom + gap,
      left: rect.left,
      width: rect.width,
      maxHeight,
      openUp,
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    updatePos();
    const onScrollOrResize = () => updatePos();
    window.addEventListener('resize', onScrollOrResize);
    // Capture scroll from any ancestor (form card, page, etc.)
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
      onBlur?.();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        onBlur?.();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onBlur]);

  const display = selected ? stationOptionLabel(selected) : '';

  const menu =
    open && pos && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            role="listbox"
            className="fixed z-[9999] overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white shadow-[0_16px_40px_rgba(0,71,62,0.18)]"
            style={{
              left: pos.left,
              width: pos.width,
              maxHeight: pos.maxHeight,
              ...(pos.openUp
                ? { bottom: window.innerHeight - pos.top, top: 'auto' }
                : { top: pos.top }),
            }}
          >
            <div className="border-b border-black/[0.06] p-3">
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-full border border-black/10 bg-[#f7f8f6] px-4 text-sm text-[#111] outline-none placeholder:text-[#9aa3a0] focus:border-[#00473E]/35 focus:ring-2 focus:ring-[#00473E]/12"
              />
            </div>
            <div
              className="overflow-y-auto overscroll-contain"
              style={{ maxHeight: Math.max(100, pos.maxHeight - 64) }}
            >
              {filtered.length === 0 ? (
                <p className="px-4 py-4 text-sm text-[#5c6562]">
                  {query.trim()
                    ? emptyMessage
                    : 'Start typing a town or shop name'}
                </p>
              ) : (
                filtered.map((station) => {
                  const active = station.agentId === String(value);
                  return (
                    <button
                      key={station.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`block w-full px-4 py-3 text-left transition-colors hover:bg-[#00473E]/[0.06] ${
                        active ? 'bg-[#00473E]/[0.08]' : ''
                      }`}
                      onClick={() => {
                        onChange(station.agentId, station);
                        setOpen(false);
                        setQuery('');
                      }}
                    >
                      <span className="block break-words font-[Sora] text-sm font-semibold tracking-[-0.02em] text-[#111]">
                        {station.town}
                      </span>
                      <span className="mt-0.5 block break-words text-sm text-[#00473E]">
                        {station.businessName}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#5c6562] line-clamp-2 break-words">
                        {station.address}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        data-field={dataField}
        disabled={disabled || loading}
        aria-invalid={hasError || undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          if (disabled || loading) return;
          setOpen((v) => !v);
          setQuery('');
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
            display ? 'font-medium text-[#00473E]' : 'text-[#9aa3a0]'
          }`}
        >
          {loading ? 'Loading stations…' : display || placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className={`size-3.5 shrink-0 fill-[#00473E] transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </button>

      {menu}

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
