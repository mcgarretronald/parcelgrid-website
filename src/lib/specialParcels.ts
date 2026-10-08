/**
 * Special parcel categories — same catalog + detection as the ParcelGrid vendor app.
 * Source: GET /pricing-services/api/pricing/custom-parcels
 */

export type ParcelSubItem = {
  id: number;
  label: string;
  price: number;
};

export type ParcelCategory = {
  id?: number;
  name: string;
  slug: string;
  subItems: ParcelSubItem[];
};

export type DetectionResult = {
  category: ParcelCategory;
  /** Set only when exactly one sub-item matches the description. */
  subItem: ParcelSubItem | null;
};

const AUTH_TOKEN_URL =
  'https://app.escrowcourier.com/website-backend-services/api/auth/token';
const CUSTOM_PARCELS_DIRECT =
  'https://app.escrowcourier.com/pricing-services/api/pricing/custom-parcels';
const CUSTOM_PARCELS_PROXY = '/custom-parcels-api';
const CUSTOM_PARCELS_FN = '/api/custom-parcels';

function asArray(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
  }
  return [];
}

function normalizeCategory(raw: any): ParcelCategory | null {
  if (!raw) return null;
  const name = String(raw.name || '').trim();
  const slug = String(raw.slug || '').trim();
  if (!name || !slug) return null;
  const subItems: ParcelSubItem[] = (Array.isArray(raw.subItems) ? raw.subItems : [])
    .map((s: any) => ({
      id: Number(s.id),
      label: String(s.label || s.name || '').trim(),
      price: Number(s.price ?? s.flatRate ?? 0),
    }))
    .filter((s: ParcelSubItem) => Number.isFinite(s.id) && s.id > 0 && s.label);
  return {
    id: raw.id != null ? Number(raw.id) : undefined,
    name,
    slug,
    subItems,
  };
}

async function fetchWebsiteToken(): Promise<string | null> {
  try {
    const res = await fetch(AUTH_TOKEN_URL, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token || data.access_token || data.bearer_token || data.data?.token || null;
  } catch {
    return null;
  }
}

async function parseCategories(res: Response): Promise<ParcelCategory[]> {
  if (!res.ok) return [];
  const data = await res.json();
  return asArray(data)
    .map(normalizeCategory)
    .filter((c): c is ParcelCategory => !!c && c.subItems.length > 0);
}

export async function fetchSpecialCategories(): Promise<ParcelCategory[]> {
  // Dev Vite middleware / Netlify function — token kept server-side
  try {
    const fromFn = await parseCategories(
      await fetch(CUSTOM_PARCELS_FN, { headers: { Accept: 'application/json' } }),
    );
    if (fromFn.length) return fromFn;
  } catch {
    /* continue */
  }

  const token = await fetchWebsiteToken();
  const authHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (import.meta.env.DEV && token) {
    try {
      const fromProxy = await parseCategories(
        await fetch(CUSTOM_PARCELS_PROXY, { headers: authHeaders }),
      );
      if (fromProxy.length) return fromProxy;
    } catch {
      /* continue */
    }
  }

  if (token) {
    try {
      const fromDirect = await parseCategories(
        await fetch(CUSTOM_PARCELS_DIRECT, { headers: authHeaders }),
      );
      if (fromDirect.length) return fromDirect;
    } catch {
      /* continue */
    }
  }

  return [];
}

function fuzzyElectronics(
  categories: ParcelCategory[],
  slugSearch: string,
  subKeywords: string[],
): DetectionResult | null {
  for (const category of categories) {
    if (!category.slug.toLowerCase().includes(slugSearch)) continue;
    const matching = category.subItems.filter((item) => {
      const label = item.label.toLowerCase();
      return subKeywords.some((kw) => label.includes(kw));
    });
    return {
      category,
      subItem: matching.length === 1 ? matching[0] : null,
    };
  }
  return null;
}

/**
 * Port of DeliveryPriceService.detectSpecialItemFromDescription from the vendor app.
 * Typing "COOKER" / "55 inch TV" surfaces the matching category + size options.
 */
export function detectSpecialItemFromDescription(
  text: string,
  categories: ParcelCategory[],
): DetectionResult | null {
  const trimmed = String(text || '').trim();
  if (!trimmed || !categories.length) return null;
  const lowerText = trimmed.toLowerCase();

  if (lowerText.includes('phone')) {
    return fuzzyElectronics(categories, 'electronic', ['phone']);
  }
  if (lowerText.includes('laptop') || lowerText.includes('macbook')) {
    return fuzzyElectronics(categories, 'electronic', ['laptop']);
  }
  if (lowerText.includes('dispenser')) {
    return fuzzyElectronics(categories, 'electronic', ['dispenser']);
  }

  for (const category of categories) {
    const catName = category.name.toLowerCase();
    const catSlug = category.slug.toLowerCase();

    const keywords = catName
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3)
      .map((w) => (w.endsWith('s') && w.length > 3 ? w.slice(0, -1) : w));

    keywords.push(catSlug);
    if (catSlug.includes('fridge')) keywords.push('refrigerator');
    if (catSlug.includes('tv')) keywords.push('television');
    if (catSlug.includes('mattress')) keywords.push('mattress', 'matress', 'bed');
    if (catSlug.includes('bike')) keywords.push('bicycle', 'cycle');
    if (catSlug.includes('cooker')) keywords.push('cooker', 'stove', 'jiko');

    const matchesCategory = keywords.some((kw) => lowerText.includes(kw));
    if (!matchesCategory || category.subItems.length === 0) continue;

    const descriptionNumbers = [...lowerText.matchAll(/\d+/g)].map((m) => Number(m[0]));
    const matchedSubItems: ParcelSubItem[] = [];

    for (const subItem of category.subItems) {
      const subLabel = subItem.label.toLowerCase();
      const labelNumbers = [...subLabel.matchAll(/\d+/g)].map((m) => Number(m[0]));
      let matchesItem = descriptionNumbers.some((number) => {
        if (labelNumbers.includes(number)) return true;
        return (
          labelNumbers.length >= 2 &&
          number >= labelNumbers[0] &&
          number <= labelNumbers[1]
        );
      });

      if (!matchesItem && catSlug.includes('bike')) {
        matchesItem =
          (lowerText.includes('electric') && subLabel.includes('electric')) ||
          (lowerText.includes('fat') && subLabel.includes('fat')) ||
          (lowerText.includes('adult') && subLabel.includes('adult')) ||
          (lowerText.includes('small') && subLabel.includes('small'));
      }

      if (matchesItem) matchedSubItems.push(subItem);
    }

    return {
      category,
      subItem: matchedSubItems.length === 1 ? matchedSubItems[0] : null,
    };
  }

  return null;
}
