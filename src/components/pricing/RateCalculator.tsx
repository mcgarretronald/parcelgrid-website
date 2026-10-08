import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { StationPicker } from '../booking/StationPicker';
import { SelectPicker } from '../ui/SelectPicker';
import {
  fetchDropOffStations,
  fetchPickupStations,
  findStationByAgentId,
  type Station,
} from '../../lib/stations';
import { fetchWeightBands, type WeightBandOption } from '../../lib/weightBands';
import {
  detectSpecialItemFromDescription,
  fetchSpecialCategories,
  type DetectionResult,
  type ParcelCategory,
  type ParcelSubItem,
} from '../../lib/specialParcels';
import { calculateDeliveryFee } from '../../lib/pricing';
import { NAIROBI_CBD_ORIGIN_AGENT_ID } from '../../lib/nairobiHub';

const fieldLabel = 'mb-2 block text-sm font-semibold text-[#222]';
const hint = 'mt-1.5 text-xs text-[#5c6562]';
const textareaClass =
  'w-full resize-none rounded-[1.5rem] border border-black/10 bg-white px-5 py-3.5 text-sm text-[#111] outline-none transition-colors placeholder:text-[#9aa3a0] focus:border-[#00473E]/40 focus:ring-2 focus:ring-[#00473E]/15';

/**
 * Public rate calculator — drop-off + pickup + weight or special item.
 * Defaults drop-off to Nairobi CBD Offices (agent 366), same as the app.
 */
export function RateCalculator() {
  const [pickupStations, setPickupStations] = useState<Station[]>([]);
  const [dropoffStations, setDropoffStations] = useState<Station[]>([]);
  const [stationsLoading, setStationsLoading] = useState(true);

  const [weightBands, setWeightBands] = useState<WeightBandOption[]>([]);
  const [weightBandsLoading, setWeightBandsLoading] = useState(true);

  const [specialCategories, setSpecialCategories] = useState<ParcelCategory[]>([]);
  const [description, setDescription] = useState('');
  const [detected, setDetected] = useState<DetectionResult | null>(null);
  const [specialSubItem, setSpecialSubItem] = useState<ParcelSubItem | null>(null);

  const [dropoffId, setDropoffId] = useState(NAIROBI_CBD_ORIGIN_AGENT_ID);
  const [pickupId, setPickupId] = useState('');
  const [weightRange, setWeightRange] = useState('');

  const [fee, setFee] = useState<number | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [feeNote, setFeeNote] = useState<string | null>(null);

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
    fetchWeightBands()
      .then((bands) => {
        if (mounted) setWeightBands(bands);
      })
      .finally(() => {
        if (mounted) setWeightBandsLoading(false);
      });
    fetchSpecialCategories().then((cats) => {
      if (mounted) setSpecialCategories(cats);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const applyDetection = (text: string, cats: ParcelCategory[] = specialCategories) => {
    const result = detectSpecialItemFromDescription(text, cats);
    setDetected(result);
    if (!result) {
      setSpecialSubItem(null);
      return;
    }
    if (result.subItem) {
      setSpecialSubItem(result.subItem);
      setWeightRange('');
    } else {
      setSpecialSubItem((prev) =>
        prev && result.category.subItems.some((s) => s.id === prev.id) ? prev : null,
      );
    }
  };

  useEffect(() => {
    if (!specialCategories.length || !description.trim()) return;
    applyDetection(description, specialCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialCategories]);

  useEffect(() => {
    let active = true;
    const hasSpecial = Boolean(specialSubItem?.id);
    const hasWeight = Boolean(weightRange);
    if (!pickupId || (!hasSpecial && !hasWeight)) {
      setFee(null);
      setFeeError(null);
      setFeeNote(null);
      setFeeLoading(false);
      return;
    }

    const controller = new AbortController();
    const run = async () => {
      setFeeLoading(true);
      setFeeError(null);
      try {
        const pickup = findStationByAgentId(pickupStations, pickupId);
        if (!pickup) {
          setFeeError('Pickup point not found');
          setFeeLoading(false);
          return;
        }
        const dropoff =
          findStationByAgentId(dropoffStations, dropoffId) ||
          findStationByAgentId(dropoffStations, NAIROBI_CBD_ORIGIN_AGENT_ID);
        const payload: Parameters<typeof calculateDeliveryFee>[0] = {
          destinationAgentId: Number(pickup.agentId) || pickup.agentId,
          destinationTown: pickup.town,
          originAgentId: dropoff
            ? Number(dropoff.agentId) || dropoff.agentId
            : Number(NAIROBI_CBD_ORIGIN_AGENT_ID),
          originTown: dropoff?.town || 'Nairobi',
        };
        if (hasSpecial) {
          payload.subItemId = specialSubItem!.id;
        } else {
          payload.weightRange = weightRange.replace(/\s*kg$/i, '').trim();
          if (pickup.distanceFromHQ) payload.distance = pickup.distanceFromHQ;
        }

        const result = await calculateDeliveryFee(payload, controller.signal);
        if (!active) return;
        if (result.totalFee != null && result.totalFee > 0) {
          setFee(result.totalFee);
          setFeeNote(
            hasSpecial
              ? `Special rate · ${specialSubItem!.label}`
              : result.weightBandLabel
                ? `Weight · ${result.weightBandLabel}`
                : null,
          );
        } else {
          setFee(null);
          setFeeError(result.error || 'Could not calculate this route');
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        if (active) {
          setFee(null);
          setFeeError(err?.message || 'Could not calculate this route');
        }
      } finally {
        if (active) setFeeLoading(false);
      }
    };

    const t = window.setTimeout(run, 350);
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(t);
    };
  }, [
    pickupId,
    dropoffId,
    weightRange,
    specialSubItem,
    pickupStations,
    dropoffStations,
  ]);

  return (
    <div className="rounded-[1.75rem] border border-black/[0.07] bg-white shadow-[0_18px_40px_rgba(7,20,16,0.08)]">
      <div className="overflow-hidden rounded-t-[1.75rem] border-b border-black/[0.05] bg-[#071410] px-5 py-4 sm:px-6">
        <p className="font-[Sora] text-lg font-semibold tracking-[-0.02em] text-white">
          Live Rate Calculator
        </p>
        <p className="mt-1 text-sm text-white/65">
          Build your quote in seconds based on actual transit routes.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div>
            <label className={fieldLabel}>Drop-off Point (e.g., Nairobi CBD Hubs)</label>
            <StationPicker
              stations={dropoffStations}
              value={dropoffId}
              loading={stationsLoading}
              placeholder="Nairobi CBD Offices"
              searchPlaceholder="e.g. Nairobi, Ronald Ngala…"
              onChange={(id) => setDropoffId(id)}
            />
            <p className={hint}>Ronald Ngala, Moi Avenue, or Taveta Road — or any send station.</p>
          </div>

          <div>
            <label className={fieldLabel}>Destination Station (e.g., Nakuru, Mombasa)</label>
            <StationPicker
              stations={pickupStations}
              value={pickupId}
              loading={stationsLoading}
              placeholder="Where your buyer collects…"
              searchPlaceholder="e.g. Nakuru, Mombasa, Bamburi…"
              onChange={(id) => setPickupId(id)}
            />
            <p className={hint}>Any ParcelGrid collection station across 300+ towns.</p>
          </div>

          <div>
            <label className={fieldLabel}>Parcel Weight (e.g., 0–2kg)</label>
            <SelectPicker
              value={weightRange}
              placeholder={
                specialSubItem
                  ? 'Using special item rate'
                  : weightBandsLoading
                    ? 'Loading…'
                    : 'Select weight'
              }
              options={weightBands.map((b) => ({ value: b.value, label: b.label }))}
              loading={weightBandsLoading}
              disabled={Boolean(specialSubItem) || weightBandsLoading}
              onChange={(value) => {
                setWeightRange(value);
                if (value) setSpecialSubItem(null);
              }}
            />
          </div>

          <div>
            <label className={fieldLabel}>Or describe a special item</label>
            <textarea
              value={description}
              rows={2}
              placeholder="e.g. cooker, 55 inch TV, mattress 6x6…"
              className={textareaClass}
              onChange={(e) => {
                const text = e.target.value;
                setDescription(text);
                applyDetection(text);
              }}
            />
            {detected && detected.category.subItems.length > 0 && (
              <div className="mt-3 space-y-2 rounded-2xl bg-[#f3f5f3] p-3">
                <p className="text-sm font-semibold text-[#00473E]">
                  {detected.category.name} — pick size / type
                </p>
                <div className="flex flex-wrap gap-2">
                  {detected.category.subItems.map((item) => {
                    const active = specialSubItem?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSpecialSubItem(item);
                          setWeightRange('');
                        }}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          active
                            ? 'bg-[#00473E] text-white'
                            : 'bg-white text-[#00473E] ring-1 ring-black/10'
                        }`}
                      >
                        {item.label}
                        {item.price > 0 ? ` · KES ${item.price.toLocaleString()}` : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex min-h-[22rem] flex-col justify-between gap-6 rounded-[1.5rem] bg-[#071410] p-5 text-white sm:min-h-[24rem] sm:p-6">
          <div className="flex flex-1 flex-col justify-center">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#E9FF15] uppercase">
              Estimated courier fee
            </p>
            {feeLoading ? (
              <p className="mt-8 flex items-center gap-2 text-sm text-white/70">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Calculating…
              </p>
            ) : feeError ? (
              <p className="mt-8 text-sm text-amber-200">{feeError}</p>
            ) : fee != null ? (
              <div className="mt-6">
                <p className="font-[Sora] text-5xl font-bold leading-none tracking-[-0.04em] sm:text-6xl">
                  <span className="mr-2 text-2xl font-semibold tracking-normal text-white/55 sm:text-3xl">
                    KES
                  </span>
                  {fee.toLocaleString()}
                </p>
                {feeNote && (
                  <p className="mt-4 text-sm font-medium text-white/60">{feeNote}</p>
                )}
              </div>
            ) : (
              <p className="mt-8 max-w-[16rem] text-sm leading-relaxed text-white/65">
                Choose a destination station and a weight band or special item to see your live rate.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs leading-relaxed text-white/50">
              *Final fee is confirmed at booking. Standard prepaid shipping via M-Pesa. If using Pay
              on Delivery (COD), standard escrow handling fees apply.
            </p>
            <Link
              to="/book-parcel"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E9FF15] px-5 text-sm font-semibold text-[#111] transition hover:bg-[#f3ff6a]"
            >
              Book This Parcel
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
