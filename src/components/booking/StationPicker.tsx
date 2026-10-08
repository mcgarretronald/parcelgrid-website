import React, { useEffect, useMemo, useRef, useState } from 'react';
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

/**
 * App-style station picker: search merges town + shop into one field.
 * Value stored is Agents.id (agentId).
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(
    () => stations.find((s) => s.agentId === String(value)) || null,
    [stations, value],
  );

  const filtered = useMemo(
    () => filterStations(stations, query).slice(0, 80),
    [stations, query],
  );

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onBlur]);

  const display = selected ? stationOptionLabel(selected) : '';

  return (
    <div ref={rootRef} className={`relative z-10 ${open ? 'z-[100]' : ''}`}>
      <button
        type="button"
        data-field={dataField}
        disabled={disabled || loading}
        aria-invalid={hasError || undefined}
        aria-expanded={open}
        onClick={() => {
          if (disabled || loading) return;
          setOpen((v) => !v);
          setQuery('');
        }}
        onBlur={() => {
          // Delay so option click can register
          window.setTimeout(() => {
            if (!rootRef.current?.contains(document.activeElement)) {
              setOpen(false);
              onBlur?.();
            }
          }, 150);
        }}
        className={`flex h-12 w-full items-center justify-between gap-3 rounded-full border bg-white px-5 text-left text-sm outline-none transition-colors ${
          hasError
            ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-200'
            : 'border-black/10 focus-visible:border-[#00473E]/40 focus-visible:ring-2 focus-visible:ring-[#00473E]/15'
        } ${disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
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

      {open && (
        <div className="absolute left-0 right-0 z-[100] mt-2 overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white shadow-[0_16px_40px_rgba(0,71,62,0.12)]">
          <div className="border-b border-black/[0.06] p-3">
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-full border border-black/10 bg-[#f7f8f6] px-4 text-sm text-[#111] outline-none placeholder:text-[#9aa3a0] focus:border-[#00473E]/35 focus:ring-2 focus:ring-[#00473E]/12"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setOpen(false);
                  onBlur?.();
                }
              }}
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#5c6562]">{emptyMessage}</p>
            ) : (
              filtered.map((station) => {
                const active = station.agentId === String(value);
                return (
                  <button
                    key={station.id}
                    type="button"
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
