/**
 * Weight bands — same source as the ParcelGrid app
 * (GET /pricing-services/api/pricing/weight-bands, Standard tier).
 */

export type WeightBandOption = {
  id: number;
  label: string; // UI: "0.0 – 2.0 kg"
  value: string; // API: "0.0 - 2.0"
  minWeight: number;
  maxWeight: number;
};

const WEIGHT_BANDS_FN = '/api/weight-bands';

/** Standard Pricing — matches pricing-service feeCalculation default (tier 2). */
const STANDARD_TIER_ID = 2;

function formatFixed(n: number): string {
  return Number(n).toFixed(1);
}

/** App-style label / value from min–max. */
export function formatWeightBand(minWeight: number, maxWeight: number): {
  label: string;
  value: string;
} {
  const min = formatFixed(minWeight);
  const max = formatFixed(maxWeight);
  return {
    label: `${min} – ${max} kg`,
    value: `${min} - ${max}`,
  };
}

/**
 * Last-resort Standard tier bands (pricing-service tier 2) so the calculator
 * still works when Netlify/Vite pricing proxies are unreachable in production nginx.
 */
const FALLBACK_STANDARD_BANDS: WeightBandOption[] = [
  { id: 1, minWeight: 0, maxWeight: 2, ...formatWeightBand(0, 2) },
  { id: 2, minWeight: 2.1, maxWeight: 5, ...formatWeightBand(2.1, 5) },
  { id: 3, minWeight: 5.1, maxWeight: 10, ...formatWeightBand(5.1, 10) },
  { id: 4, minWeight: 10.1, maxWeight: 15, ...formatWeightBand(10.1, 15) },
  { id: 5, minWeight: 15.1, maxWeight: 20, ...formatWeightBand(15.1, 20) },
  { id: 6, minWeight: 20.1, maxWeight: 25, ...formatWeightBand(20.1, 25) },
  { id: 7, minWeight: 25.1, maxWeight: 30, ...formatWeightBand(25.1, 30) },
  { id: 21, minWeight: 30.1, maxWeight: 40, ...formatWeightBand(30.1, 40) },
  { id: 22, minWeight: 40.1, maxWeight: 50, ...formatWeightBand(40.1, 50) },
];

function asArray(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
  }
  return [];
}

function normalizeBands(raw: any[]): WeightBandOption[] {
  const standard = raw.filter(
    (b) => Number(b.pricingTierId) === STANDARD_TIER_ID && b.deletedAt == null,
  );
  const source = standard.length ? standard : raw.filter((b) => b.deletedAt == null);

  const byRange = new Map<string, WeightBandOption>();
  for (const b of source) {
    const min = Number(b.minWeight);
    const max = Number(b.maxWeight);
    if (!Number.isFinite(min) || !Number.isFinite(max)) continue;
    // Already-normalized option from our Netlify/Vite proxy
    if (b.label && b.value != null && b.minWeight != null) {
      const value = String(b.value);
      if (!byRange.has(value)) {
        byRange.set(value, {
          id: Number(b.id) || byRange.size + 1,
          label: String(b.label),
          value,
          minWeight: min,
          maxWeight: max,
        });
      }
      continue;
    }
    const { label, value } = formatWeightBand(min, max);
    if (byRange.has(value)) continue;
    byRange.set(value, {
      id: Number(b.id) || byRange.size + 1,
      label,
      value,
      minWeight: min,
      maxWeight: max,
    });
  }

  return [...byRange.values()].sort((a, b) => a.minWeight - b.minWeight || a.maxWeight - b.maxWeight);
}

async function parseBandsResponse(res: Response): Promise<WeightBandOption[]> {
  if (!res.ok) return [];
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }
  const arr = asArray(data);
  if (!arr.length) return [];
  if (arr[0]?.label && arr[0]?.value != null && arr[0]?.minWeight != null) {
    return normalizeBands(arr);
  }
  return normalizeBands(arr);
}

/**
 * Load weight bands for the booking picker.
 * Same catalog as the app: pricing weight-bands, Standard tier (id 2).
 */
export async function fetchWeightBands(): Promise<WeightBandOption[]> {
  // Dev Vite middleware / Netlify function — token kept server-side
  try {
    const fromFn = await parseBandsResponse(
      await fetch(WEIGHT_BANDS_FN, { headers: { Accept: 'application/json' } }),
    );
    if (fromFn.length) return fromFn;
  } catch {
    /* use fallback */
  }

  return FALLBACK_STANDARD_BANDS;
}
