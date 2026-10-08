import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Loader2, Package } from 'lucide-react';
import { StationPicker } from '../booking/StationPicker';
import {
  fetchDropOffStations,
  fetchPickupStations,
  findStationByAgentId,
  type Station,
} from '../../lib/stations';
import {
  fetchSpecialCategories,
  type ParcelCategory,
} from '../../lib/specialParcels';
import { calculateDeliveryFee } from '../../lib/pricing';
import { NAIROBI_CBD_ORIGIN_AGENT_ID } from '../../lib/nairobiHub';

const fieldLabel = 'mb-2 block text-sm font-semibold text-[#222]';

type FeeMap = Record<number, number | null>;

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

/**
 * Special-item catalog with live route fees.
 * Drop-off defaults to Nairobi CBD (366) without calling it out as a “default”.
 */
export function SpecialItemsRates() {
  const [pickupStations, setPickupStations] = useState<Station[]>([]);
  const [dropoffStations, setDropoffStations] = useState<Station[]>([]);
  const [stationsLoading, setStationsLoading] = useState(true);

  const [dropoffId, setDropoffId] = useState(NAIROBI_CBD_ORIGIN_AGENT_ID);
  const [pickupId, setPickupId] = useState('');

  const [categories, setCategories] = useState<ParcelCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  const [fees, setFees] = useState<FeeMap>({});
  const [feesLoading, setFeesLoading] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setStationsLoading(true);
      try {
        const [pickup, dropoff] = await Promise.all([
          fetchPickupStations(),
          fetchDropOffStations(),
        ]);
        if (!mounted) return;
        setPickupStations(pickup);
        const dropoffs =
          dropoff.length ? dropoff : pickup.filter((s) => s.capability === 'send_collect');
        setDropoffStations(dropoffs);
        const nairobi = findStationByAgentId(dropoffs, NAIROBI_CBD_ORIGIN_AGENT_ID);
        if (nairobi) setDropoffId(nairobi.agentId);
      } finally {
        if (mounted) setStationsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchSpecialCategories()
      .then((list) => {
        if (!mounted) return;
        setCategories(list);
        if (list[0]?.slug) setOpenSlug(list[0].slug);
      })
      .finally(() => {
        if (mounted) setCatsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const subItems = useMemo(
    () => categories.flatMap((c) => c.subItems.map((s) => ({ ...s, categorySlug: c.slug }))),
    [categories],
  );

  useEffect(() => {
    let active = true;
    if (!pickupId || !dropoffId || !subItems.length) {
      setFees({});
      setFeesLoading(false);
      return;
    }

    const pickup = findStationByAgentId(pickupStations, pickupId);
    const dropoff =
      findStationByAgentId(dropoffStations, dropoffId) ||
      findStationByAgentId(dropoffStations, NAIROBI_CBD_ORIGIN_AGENT_ID);
    if (!pickup) return;

    const originAgentId = dropoff
      ? Number(dropoff.agentId) || dropoff.agentId
      : Number(NAIROBI_CBD_ORIGIN_AGENT_ID);
    const originTown = dropoff?.town || 'Nairobi';

    const t = window.setTimeout(() => {
      setFeesLoading(true);
      mapPool(subItems, 6, async (item) => {
        try {
          const result = await calculateDeliveryFee({
            subItemId: item.id,
            originAgentId,
            originTown,
            destinationAgentId: Number(pickup.agentId) || pickup.agentId,
            destinationTown: pickup.town,
          });
          return {
            id: item.id,
            fee: result.totalFee != null && result.totalFee > 0 ? result.totalFee : null,
          };
        } catch {
          return { id: item.id, fee: null };
        }
      }).then((rows) => {
        if (!active) return;
        const next: FeeMap = {};
        for (const row of rows) next[row.id] = row.fee;
        setFees(next);
        setFeesLoading(false);
      });
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(t);
    };
  }, [pickupId, dropoffId, subItems, pickupStations, dropoffStations]);

  const hasRoute = Boolean(pickupId && dropoffId);

  function displayPrice(itemId: number, catalogPrice: number): string {
    if (!hasRoute) {
      return catalogPrice > 0 ? `from KES ${catalogPrice.toLocaleString()}` : '—';
    }
    if (feesLoading && fees[itemId] == null) return '…';
    const live = fees[itemId];
    if (live != null) return `KES ${live.toLocaleString()}`;
    if (catalogPrice > 0) return `KES ${catalogPrice.toLocaleString()}`;
    return 'Quote on request';
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={fieldLabel}>Drop-off point</label>
          <StationPicker
            stations={dropoffStations}
            value={dropoffId}
            loading={stationsLoading}
            placeholder="Where you hand in the parcel…"
            searchPlaceholder="e.g. Nairobi, Kitengela…"
            onChange={(id) => setDropoffId(id)}
          />
        </div>
        <div>
          <label className={fieldLabel}>Destination</label>
          <StationPicker
            stations={pickupStations}
            value={pickupId}
            loading={stationsLoading}
            placeholder="Where your buyer collects…"
            searchPlaceholder="e.g. Nakuru, Mombasa…"
            onChange={(id) => setPickupId(id)}
          />
        </div>
      </div>

      {!hasRoute && (
        <p className="mt-3 text-sm text-[#5c6562]">
          Pick a destination to see live special-item rates for that route.
        </p>
      )}
      {hasRoute && feesLoading && (
        <p className="mt-3 flex items-center gap-2 text-sm text-[#5c6562]">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Updating rates for this route…
        </p>
      )}

      {catsLoading ? (
        <p className="mt-8 text-sm text-[#5c6562]">Loading special item rates…</p>
      ) : categories.length === 0 ? (
        <p className="mt-8 text-sm text-[#5c6562]">
          Use the calculator above and describe your item (e.g. cooker, 55 inch TV) to see live
          special rates.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {categories.map((cat) => {
            const open = openSlug === cat.slug;
            const panelId = `special-cat-${cat.slug}`;
            return (
              <li
                key={cat.slug}
                className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenSlug(open ? null : cat.slug)}
                  className="flex w-full items-center gap-2 bg-[#fafbfa] px-4 py-3 text-left transition-colors hover:bg-[#f3f5f3]"
                >
                  <Package className="size-4 shrink-0 text-[#00473E]" aria-hidden />
                  <span className="min-w-0 flex-1 font-[Sora] text-sm font-semibold text-[#111]">
                    {cat.name}
                  </span>
                  <span className="text-xs text-[#9aa3a0]">
                    {cat.subItems.length} size{cat.subItems.length === 1 ? '' : 's'}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-[#00473E] transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                    aria-hidden
                  />
                </button>
                {open && (
                  <ul id={panelId} className="divide-y divide-black/[0.04] border-t border-black/[0.05]">
                    {cat.subItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                      >
                        <span className="text-[#3d4542]">{item.label}</span>
                        <span className="shrink-0 font-bold tabular-nums text-[#00473E]">
                          {displayPrice(item.id, item.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
