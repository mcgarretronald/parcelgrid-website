import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../components/ui/input';
import {
  ArrowLeft,
  ArrowRight,
  Package,
  User,
  MapPin,
  CheckCircle,
  Loader2,
  Truck,
} from 'lucide-react';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { kenyaMobileError, normalizeKenyaMobile } from '../lib/phone';
import {
  fetchDropOffStations,
  fetchPickupStations,
  findStationByAgentId,
  stationOptionLabel,
  type Station,
} from '../lib/stations';
import { fetchWeightBands, type WeightBandOption } from '../lib/weightBands';
import {
  detectSpecialItemFromDescription,
  fetchSpecialCategories,
  type DetectionResult,
  type ParcelCategory,
  type ParcelSubItem,
} from '../lib/specialParcels';
import { calculateDeliveryFee } from '../lib/pricing';
import { StationPicker } from '../components/booking/StationPicker';
import { SelectPicker } from '../components/ui/SelectPicker';

const BOOKING_STEPS = [
  { id: 1, label: 'You & stations' },
  { id: 2, label: 'Parcel details' },
  { id: 3, label: 'Review & pay' },
] as const;

const fieldLabelClass = 'mb-2 block text-sm font-semibold text-[#222]';
const fieldHintClass = 'mt-1.5 text-xs text-[#5c6562]';
const fieldErrorClass = 'mt-1.5 text-xs font-medium text-red-600';
const inputClass =
  'h-12 w-full rounded-full border border-black/10 bg-white px-5 text-sm text-[#111] shadow-none outline-none transition-colors placeholder:text-[#9aa3a0] focus-visible:border-[#00473E]/40 focus-visible:ring-2 focus-visible:ring-[#00473E]/15';
const inputErrorClass =
  'h-12 w-full rounded-full border border-red-400 bg-white px-5 text-sm text-[#111] shadow-none outline-none transition-colors placeholder:text-[#9aa3a0] focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-200';
const selectClass =
  'h-12 w-full appearance-none rounded-full border border-black/10 bg-white px-5 text-sm text-[#111] outline-none transition-colors focus:border-[#00473E]/40 focus:ring-2 focus:ring-[#00473E]/15';
const selectErrorClass =
  'h-12 w-full appearance-none rounded-full border border-red-400 bg-white px-5 text-sm text-[#111] outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-200';
const textareaClass =
  'w-full resize-none rounded-[1.5rem] border border-black/10 bg-white px-5 py-3.5 text-sm text-[#111] outline-none transition-colors placeholder:text-[#9aa3a0] focus:border-[#00473E]/40 focus:ring-2 focus:ring-[#00473E]/15';
const sectionTitleClass =
  'flex items-center gap-2 font-[Sora] text-lg font-semibold tracking-[-0.02em] text-[#111]';

interface FormData {
  // You (sender)
  vendorName: string;
  vendorPhone: string;

  // Receiver
  customerName: string;
  customerPhone: string;

  /** Drop-off station Agents.id — where you hand in the parcel */
  dropoffPoint: string;
  /** Pickup station Agents.id — where they collect */
  pickupPoint: string;
  /** Derived from selected pickup town (for order payload) */
  customerCounty: string;

  // Package Details
  packageType: string;
  packageTypeOther: string;
  weightRange: string;
  packageValue: string;
  isFragile: boolean;
  isSpillProne: boolean;
  /** Free-text description — drives special-item detection like the vendor app */
  specialInstructions: string;
  /** Selected special sub-item id when description matches a catalog item */
  specialSubItemId: string;
}

type FieldErrors = Partial<Record<keyof FormData, string>>;

const BookingPage: React.FC = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const location = useLocation();

  // Station picker dropdown styles (kept lean for the custom radio select)
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-radio-select {
        position: relative;
        user-select: none;
      }
      .custom-radio-selected {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-height: 48px;
        padding: 12px 20px;
        border-radius: 9999px;
        border: 1px solid rgba(0,0,0,0.1);
        background: white;
        cursor: pointer;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .custom-radio-selected:hover,
      .custom-radio-select.open .custom-radio-selected,
      .custom-radio-selected.active {
        border-color: rgba(0, 71, 62, 0.35);
        box-shadow: 0 0 0 3px rgba(0, 71, 62, 0.1);
      }
      .custom-radio-select.has-error .custom-radio-selected {
        border-color: #f87171;
        box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.2);
      }
      .custom-radio-select.has-error .custom-radio-selected:hover,
      .custom-radio-select.has-error.open .custom-radio-selected {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
      }
      .custom-radio-arrow {
        width: 14px;
        height: 14px;
        fill: #00473E;
        flex-shrink: 0;
        transition: transform 0.2s ease;
      }
      .custom-radio-select.open .custom-radio-arrow {
        transform: rotate(180deg);
      }
      .custom-radio-options {
        display: none;
        position: absolute;
        z-index: 30;
        left: 0;
        right: 0;
        margin-top: 8px;
        max-height: 260px;
        overflow-y: auto;
        border-radius: 1.5rem;
        border: 1px solid rgba(0,0,0,0.08);
        background: white;
        box-shadow: 0 16px 40px rgba(0, 71, 62, 0.12);
      }
      .custom-radio-select.open .custom-radio-options {
        display: block;
      }
      .custom-radio-option {
        padding: 12px 16px;
        font-size: 14px;
        color: #222;
        cursor: pointer;
        border-bottom: 1px solid rgba(0,0,0,0.04);
      }
      .custom-radio-option:last-child {
        border-bottom: none;
      }
      .custom-radio-option:hover,
      .custom-radio-option.selected {
        background: rgba(0, 71, 62, 0.06);
        color: #00473E;
        font-weight: 600;
      }
      .custom-radio-option.disabled {
        color: #5c6562;
        cursor: default;
        font-weight: 500;
      }
      .booking-select-unused {
        /* placeholder to keep patch unique */
        background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      }
      
      .custom-select option:not(:first-child):not(:disabled) {
        background: linear-gradient(to right, white 0%, #fafafa 100%);
        position: relative;
      }
      
      .custom-select option:hover,
      .custom-select option:focus,
      .custom-select option:checked {
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        color: #00473E;
        font-weight: 600;
        border-left: 4px solid #00473E;
        padding-left: 16px;
      }
      
      .custom-select option:disabled {
        color: #9ca3af;
        font-style: italic;
        background: #fef3c7;
        border-left: 3px solid #f59e0b;
      }
      
      .custom-select:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #f9fafb;
      }
      
      @keyframes selectPulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(0, 71, 62, 0.2);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(0, 71, 62, 0);
        }
      }
      
      .custom-select.has-value {
        background-color: #f0fdf4;
        border-color: #00473E;
      }
      
      /* Custom Radio Dropdown Styles */
      .custom-radio-select {
        width: 100%;
        cursor: pointer;
        position: relative;
        transition: 300ms;
        color: #1f2937;
        border-radius: 8px;
      }

      .custom-radio-selected {
        background: #ffffff;
        padding: 12px 20px;
        border-radius: 9999px;
        border: 1px solid rgba(0,0,0,0.1);
        position: relative;
        z-index: 10;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      
      .custom-radio-selected:hover {
        border-color: #00473E;
        box-shadow: 0 4px 6px -1px rgba(0, 71, 62, 0.1);
      }

      .custom-radio-selected.active {
        border-color: #00473E;
        background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
        box-shadow: 0 4px 12px -1px rgba(0, 71, 62, 0.15);
      }

      .custom-radio-arrow {
        height: 20px;
        width: 20px;
        fill: #00473E;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .custom-radio-select.open .custom-radio-arrow {
        transform: rotate(180deg);
      }

      .custom-radio-options {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        padding: 8px;
        background: white;
        border: 2px solid #00473E;
        position: absolute;
        width: 100%;
        max-height: 280px;
        overflow-y: auto;
        top: calc(100% + 4px);
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        box-shadow: 0 10px 25px -5px rgba(0, 71, 62, 0.2), 0 8px 10px -6px rgba(0, 71, 62, 0.1);
      }

      .custom-radio-select.open .custom-radio-options {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
      }

      .custom-radio-option {
        border-radius: 6px;
        padding: 12px 14px;
        transition: all 200ms ease;
        background-color: white;
        font-size: 14px;
        line-height: 1.5;
        cursor: pointer;
        border-left: 3px solid transparent;
        margin-bottom: 4px;
      }
      
      .custom-radio-option:hover {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border-left-color: #00473E;
        padding-left: 18px;
        transform: translateX(2px);
      }

      .custom-radio-option.selected {
        background: linear-gradient(135deg, #00473E 0%, #005a4d 100%);
        color: white;
        font-weight: 600;
        border-left-color: #e9ff15;
        box-shadow: 0 2px 8px rgba(0, 71, 62, 0.3);
      }

      .custom-radio-option.disabled {
        color: #9ca3af;
        font-style: italic;
        background: #fef3c7;
        border-left-color: #f59e0b;
        cursor: not-allowed;
      }

      .custom-radio-option.disabled:hover {
        transform: none;
        padding-left: 14px;
      }

      .custom-radio-options::-webkit-scrollbar {
        width: 6px;
      }

      .custom-radio-options::-webkit-scrollbar-track {
        background: #f3f4f6;
        border-radius: 3px;
      }

      .custom-radio-options::-webkit-scrollbar-thumb {
        background: #00473E;
        border-radius: 3px;
      }

      .custom-radio-options::-webkit-scrollbar-thumb:hover {
        background: #005a4d;
      }
      
      /* Typing Animation Styles */
      @keyframes typing1 {
        0% {
          width: 0;
        }
        25%, 45% {
          width: 100%;
        }
        60% {
          width: 0;
        }
        60.01%, 100% {
          width: 0;
        }
      }

      @keyframes typing2 {
        0%, 60% {
          width: 0;
        }
        75%, 95% {
          width: 100%;
        }
        100% {
          width: 0;
        }
      }

      @keyframes blink-caret {
        50% {
          border-color: transparent;
        }
      }

      @keyframes show1 {
        0%, 50% {
          opacity: 1;
          visibility: visible;
        }
        50.01%, 100% {
          opacity: 0;
          visibility: hidden;
        }
      }

      @keyframes show2 {
        0%, 50% {
          opacity: 0;
          visibility: hidden;
        }
        50.01%, 100% {
          opacity: 1;
          visibility: visible;
        }
      }

      .typing-container {
        position: relative;
        min-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .typing-animation {
        font-family: 'Consolas', 'Monaco', monospace;
        font-weight: 700;
        border-right: 0.15em solid #E9FF15;
        width: 0;
        white-space: nowrap;
        overflow: hidden;
        margin: 0 auto;
        display: inline-block;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: clamp(0.75rem, 3.5vw, 2rem);
        max-width: 95%;
      }

      @media (min-width: 640px) {
        .typing-animation {
          font-size: clamp(1rem, 3.5vw, 2rem);
        }
      }

      @media (min-width: 1024px) {
        .typing-animation {
          font-size: clamp(1.25rem, 2.5vw, 2rem);
        }
      }

      @media (min-width: 1280px) {
        .typing-animation {
          font-size: clamp(1.5rem, 2vw, 2rem);
        }
      }

      .typing-animation.line1 {
        animation: 
          typing1 12s steps(39, end) infinite,
          blink-caret 0.75s step-end infinite,
          show1 12s step-end infinite;
      }

      .typing-animation.line2 {
        animation: 
          typing2 12s steps(36, end) infinite,
          blink-caret 0.75s step-end infinite,
          show2 12s step-end infinite;
      }
      
      /* Truck Loader Styles */
      .loader {
        width: 100%;
        max-width: 100%;
        height: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
      }
      
      .truckWrapper {
        width: 100%;
        max-width: 95vw;
        height: 150px;
        display: flex;
        flex-direction: column;
        position: relative;
        align-items: center;
        justify-content: flex-end;
        overflow-x: hidden;
      }
      
      .truckBody {
        width: 40%;
        min-width: 130px;
        height: fit-content;
        margin-bottom: 6px;
        animation: motion 1s linear infinite;
      }
      
      .truckTires {
        width: 40%;
        min-width: 130px;
        height: fit-content;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 10px 0px 15px;
        position: absolute;
        bottom: 0;
      }
      
      .truckTires svg {
        width: 24px;
      }
      
      .road {
        width: 100%;
        height: 1.5px;
        background-color: #282828;
        position: relative;
        bottom: 0;
        align-self: flex-end;
        border-radius: 3px;
      }
      
      .road::before {
        content: "";
        position: absolute;
        width: 20px;
        height: 100%;
        background-color: #282828;
        right: -50%;
        border-radius: 3px;
        animation: roadAnimation 1.4s linear infinite;
        border-left: 10px solid white;
      }
      
      .road::after {
        content: "";
        position: absolute;
        width: 10px;
        height: 100%;
        background-color: #282828;
        right: -65%;
        border-radius: 3px;
        animation: roadAnimation 1.4s linear infinite;
        border-left: 4px solid white;
      }
      
      .lampPost {
        position: absolute;
        bottom: 0;
        right: -90px;
        height: 90px;
        animation: lampPostAnimation 1.4s linear infinite;
      }
      
      /* Desktop view - slower lamp post animation */
      @media (min-width: 768px) {
        .lampPost {
          animation: lampPostAnimation 3s linear infinite;
        }
      }
      
      /* Mobile view - full screen animation section */
      @media (max-width: 1023px) {
        .mobile-animation-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
      }
      
      /* Animated Scroll Indicator */
      .scrolldown {
        --color: #E9FF15;
        --sizeX: 24px;
        --sizeY: 40px;
        position: relative;
        width: var(--sizeX);
        height: var(--sizeY);
        border: calc(var(--sizeX) / 10) solid var(--color);
        border-radius: 50px;
        box-sizing: border-box;
        margin: 0 auto;
        cursor: pointer;
      }
      
      @media (min-width: 1024px) {
        .scrolldown {
          --sizeX: 30px;
          --sizeY: 50px;
        }
      }

      .scrolldown::before {
        content: "";
        position: absolute;
        top: 30px;
        left: 50%;
        width: 6px;
        height: 6px;
        margin-left: -3px;
        background-color: var(--color);
        border-radius: 100%;
        animation: scrolldown-anim 2s infinite;
        box-sizing: border-box;
        box-shadow: 0px 5px 3px 1px rgba(233, 255, 21, 0.4);
      }

      @keyframes scrolldown-anim {
        0% {
          opacity: 0;
          height: 6px;
        }
        40% {
          opacity: 1;
          height: 10px;
        }
        80% {
          transform: translate(0, -20px);
          height: 10px;
          opacity: 0;
        }
        100% {
          height: 3px;
          opacity: 0;
        }
      }

      .chevrons {
        padding: 6px 0 0 0;
        margin-left: -3px;
        margin-top: 48px;
        width: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .chevrondown {
        margin-top: -6px;
        position: relative;
        border: solid var(--color);
        border-width: 0 3px 3px 0;
        display: inline-block;
        width: 10px;
        height: 10px;
        transform: rotate(45deg);
      }

      .chevrondown:nth-child(odd) {
        animation: pulse54012 500ms ease infinite alternate;
      }

      .chevrondown:nth-child(even) {
        animation: pulse54012 500ms ease infinite alternate 250ms;
      }

      @keyframes pulse54012 {
        from {
          opacity: 0;
        }
        to {
          opacity: 0.5;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    vendorName: '',
    vendorPhone: '',
    customerName: '',
    customerPhone: '',
    dropoffPoint: '',
    pickupPoint: '',
    customerCounty: '',
    packageType: '',
    packageTypeOther: '',
    weightRange: '',
    packageValue: '',
    isFragile: false,
    isSpillProne: false,
    specialInstructions: '',
    specialSubItemId: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const [pickupStations, setPickupStations] = useState<Station[]>([]);
  const [dropoffStations, setDropoffStations] = useState<Station[]>([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [stationsError, setStationsError] = useState<string | null>(null);

  const [weightBands, setWeightBands] = useState<WeightBandOption[]>([]);
  const [weightBandsLoading, setWeightBandsLoading] = useState(true);
  const [weightBandsError, setWeightBandsError] = useState<string | null>(null);

  const [specialCategories, setSpecialCategories] = useState<ParcelCategory[]>([]);
  const [detectedSpecial, setDetectedSpecial] = useState<DetectionResult | null>(null);
  const [selectedSpecialSubItem, setSelectedSpecialSubItem] = useState<ParcelSubItem | null>(null);

  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [feeNote, setFeeNote] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setStationsLoading(true);
      setStationsError(null);
      try {
        const [pickup, dropoff] = await Promise.all([
          fetchPickupStations(),
          fetchDropOffStations(),
        ]);
        if (!mounted) return;
        setPickupStations(pickup);
        setDropoffStations(dropoff.length ? dropoff : pickup.filter((s) => s.capability === 'send_collect'));
      } catch (err) {
        console.error('Failed to load stations', err);
        if (mounted) setStationsError('Could not load stations. Refresh and try again.');
      } finally {
        if (mounted) setStationsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setWeightBandsLoading(true);
      setWeightBandsError(null);
      try {
        const bands = await fetchWeightBands();
        if (!mounted) return;
        setWeightBands(bands);
        if (!bands.length) {
          setWeightBandsError('Could not load weight ranges. Refresh and try again.');
        }
      } catch (err) {
        console.error('Failed to load weight bands', err);
        if (mounted) setWeightBandsError('Could not load weight ranges. Refresh and try again.');
      } finally {
        if (mounted) setWeightBandsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchSpecialCategories()
      .then((cats) => {
        if (!mounted) return;
        setSpecialCategories(cats);
      })
      .catch((err) => console.error('Failed to load special categories', err));
    return () => {
      mounted = false;
    };
  }, []);

  // Re-run detection once the catalog loads (e.g. user typed "COOKER" before fetch finished)
  useEffect(() => {
    if (!specialCategories.length || !formData.specialInstructions.trim()) return;
    applyDescriptionDetection(formData.specialInstructions);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when catalog arrives
  }, [specialCategories]);

  const applyDescriptionDetection = (text: string) => {
    const result = detectSpecialItemFromDescription(text, specialCategories);
    setDetectedSpecial(result);
    if (!result) {
      setSelectedSpecialSubItem(null);
      setFormData((prev) =>
        prev.specialSubItemId ? { ...prev, specialSubItemId: '' } : prev,
      );
      return;
    }
    if (result.subItem) {
      setSelectedSpecialSubItem(result.subItem);
      setFormData((prev) => ({
        ...prev,
        specialSubItemId: String(result.subItem!.id),
        // Special items are priced by size, not weight band
        weightRange: '',
      }));
    } else {
      // Category matched but size unclear — keep previous selection if still in this category
      setSelectedSpecialSubItem((prev) => {
        if (prev && result.category.subItems.some((s) => s.id === prev.id)) return prev;
        return null;
      });
      setFormData((prev) => {
        const stillValid =
          prev.specialSubItemId &&
          result.category.subItems.some((s) => String(s.id) === prev.specialSubItemId);
        return stillValid ? prev : { ...prev, specialSubItemId: '' };
      });
    }
  };

  const selectSpecialSubItem = (item: ParcelSubItem) => {
    setSelectedSpecialSubItem(item);
    setFormData((prev) => ({
      ...prev,
      specialSubItemId: String(item.id),
      weightRange: '',
    }));
    setFieldError('weightRange', null);
  };

  const selectedPickup = useMemo(
    () => findStationByAgentId(pickupStations, formData.pickupPoint),
    [pickupStations, formData.pickupPoint],
  );
  const selectedDropoff = useMemo(
    () => findStationByAgentId(dropoffStations, formData.dropoffPoint),
    [dropoffStations, formData.dropoffPoint],
  );


  const packageTypes = [
    'Box',
    'Non-woven bag',
    'Sack',
    'Wrapped with cellotape',
    'Not sealed',
    'Other',
  ];

  const validateField = (field: keyof FormData, data: FormData = formData): string | null => {
    switch (field) {
      case 'vendorName':
        return data.vendorName.trim() ? null : 'Enter your full name';
      case 'vendorPhone':
        return kenyaMobileError(data.vendorPhone);
      case 'customerName':
        return data.customerName.trim() ? null : 'Enter the receiver name';
      case 'customerPhone':
        return kenyaMobileError(data.customerPhone);
      case 'dropoffPoint':
        return data.dropoffPoint ? null : 'Select where you will drop off the parcel';
      case 'pickupPoint':
        return data.pickupPoint ? null : 'Select where they will pick up the parcel';
      case 'packageType':
        return data.packageType ? null : 'Select a package type';
      case 'packageTypeOther':
        if (data.packageType !== 'Other') return null;
        return data.packageTypeOther.trim() ? null : 'Specify the package type';
      case 'weightRange':
        if (data.specialSubItemId) return null;
        return data.weightRange
          ? null
          : 'Select a weight range (or describe a special item below)';
      case 'packageValue':
        if (!data.packageValue || Number(data.packageValue) <= 0) {
          return 'Enter a package value greater than 0';
        }
        return null;
      case 'specialInstructions':
        if (detectedSpecial && !data.specialSubItemId) {
          return `Pick a ${detectedSpecial.category.name} size / type`;
        }
        return null;
      default:
        return null;
    }
  };

  const setFieldError = (field: keyof FormData, message: string | null) => {
    setFieldErrors((prev) => {
      if (!message) {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return { ...prev, [field]: message };
    });
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Live-clear / update error once the field has been blurred
      if (touched[field]) {
        const message = validateField(field, next);
        queueMicrotask(() => setFieldError(field, message));
      }
      if (field === 'packageType' && value !== 'Other') {
        queueMicrotask(() => setFieldError('packageTypeOther', null));
      }
      return next;
    });
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldError(field, validateField(field));
  };

  const fieldClass = (field: keyof FormData, kind: 'input' | 'select' = 'input') => {
    const base = kind === 'select' ? selectClass : inputClass;
    const errored = kind === 'select' ? selectErrorClass : inputErrorClass;
    return fieldErrors[field] ? errored : base;
  };

  // Live fee — same rules as the vendor app (weight band OR special sub-item + route)
  useEffect(() => {
    let active = true;
    const hasSpecial = Boolean(formData.specialSubItemId);
    const hasWeight = Boolean(formData.weightRange);
    const hasPickup = Boolean(formData.pickupPoint);

    if (!hasPickup || (!hasSpecial && !hasWeight)) {
      setDeliveryFee(null);
      setFeeError(null);
      setFeeNote(null);
      setFeeLoading(false);
      return;
    }

    const controller = new AbortController();

    const calculate = async () => {
      setFeeLoading(true);
      setFeeError(null);
      setFeeNote(null);

      try {
        const pickup = findStationByAgentId(pickupStations, formData.pickupPoint);
        if (!pickup) {
          setFeeError('Selected pickup point not found');
          setFeeLoading(false);
          return;
        }

        const dropoff = findStationByAgentId(dropoffStations, formData.dropoffPoint);
        const payload: Parameters<typeof calculateDeliveryFee>[0] = {
          destinationAgentId: Number(pickup.agentId) || pickup.agentId,
          destinationTown: pickup.town,
        };
        if (dropoff) {
          payload.originAgentId = Number(dropoff.agentId) || dropoff.agentId;
          payload.originTown = dropoff.town;
        } else {
          payload.originTown = 'Nairobi';
        }

        if (hasSpecial) {
          payload.subItemId = Number(formData.specialSubItemId);
        } else {
          payload.weightRange = formData.weightRange.replace(/\s*kg$/i, '').trim();
          if (pickup.distanceFromHQ) payload.distance = pickup.distanceFromHQ;
        }

        const result = await calculateDeliveryFee(payload, controller.signal);
        if (!active) return;

        if (result.totalFee != null && result.totalFee > 0) {
          setDeliveryFee(result.totalFee);
          setFeeNote(
            hasSpecial && selectedSpecialSubItem
              ? `Special rate · ${selectedSpecialSubItem.label}`
              : result.weightBandLabel
                ? `Weight band · ${result.weightBandLabel}`
                : null,
          );
        } else {
          setDeliveryFee(null);
          setFeeError(result.error || 'Unable to calculate delivery fee');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Delivery fee error', err);
        if (active) {
          setDeliveryFee(null);
          setFeeError(err.message || 'Failed to calculate delivery fee');
        }
      } finally {
        if (active) setFeeLoading(false);
      }
    };

    const timer = setTimeout(calculate, 350);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [
    formData.pickupPoint,
    formData.dropoffPoint,
    formData.weightRange,
    formData.specialSubItemId,
    pickupStations,
    dropoffStations,
    selectedSpecialSubItem,
  ]);

  const stepFields = (currentStep: number): (keyof FormData)[] => {
    if (currentStep === 1) {
      return ['vendorName', 'vendorPhone', 'customerName', 'customerPhone', 'dropoffPoint', 'pickupPoint'];
    }
    if (currentStep === 2) {
      const fields: (keyof FormData)[] = ['packageType', 'packageValue'];
      if (formData.packageType === 'Other') fields.push('packageTypeOther');
      if (formData.specialSubItemId) {
        // special item selected — weight optional
      } else if (detectedSpecial) {
        fields.push('specialInstructions');
      } else {
        fields.push('weightRange');
      }
      return fields;
    }
    return [];
  };

  const validateStep = (currentStep: number): string | null => {
    const fields = stepFields(currentStep);
    const nextErrors: FieldErrors = { ...fieldErrors };
    let firstError: string | null = null;

    for (const field of fields) {
      const message = validateField(field);
      if (message) {
        nextErrors[field] = message;
        if (!firstError) firstError = message;
      } else {
        delete nextErrors[field];
      }
    }

    setFieldErrors(nextErrors);
    setTouched((prev) => {
      const next = { ...prev };
      for (const field of fields) next[field] = true;
      return next;
    });

    return firstError;
  };

  const handleNext = () => {
    const error = validateStep(step);
    if (!error) {
      setFieldErrors({});
      setTouched({});
      setStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Focus first invalid field in this step
      const firstBad = stepFields(step).find((f) => validateField(f));
      if (firstBad) {
        const el = document.querySelector<HTMLElement>(`[data-field="${firstBad}"]`);
        el?.focus();
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const extractTrackingNo = (orderData: any): string | undefined =>
    orderData?.trackingNo ||
    orderData?.trackingNumber ||
    orderData?.tracking_no ||
    orderData?.data?.trackingNo ||
    orderData?.data?.trackingNumber ||
    orderData?.data?.tracking_no ||
    orderData?.data?.order?.[0]?.trackingNo ||
    orderData?.data?.order?.[0]?.trackingNumber ||
    orderData?.order?.trackingNo ||
    orderData?.order?.trackingNumber ||
    orderData?.error?.details?.existingOrderTrackingNo ||
    orderData?.error?.existingOrderTrackingNo;

  const extractOrderId = (orderData: any): string | number | undefined =>
    orderData?.id ||
    orderData?.orderId ||
    orderData?._id ||
    orderData?.data?.id ||
    orderData?.data?.orderId ||
    orderData?.data?.order?.[0]?.id;

  const createBookingOrder = async (orderPayload: Record<string, unknown>) => {
    const body = JSON.stringify({
      ...orderPayload,
      bookingSource: 'website',
      fromWebsite: true,
    });
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Booking-Source': 'website',
    };

    // Same-origin proxy (Vite middleware / Netlify) — avoids CORS on localhost
    try {
      const viaProxy = await fetch('/api/booking-agent-orders', {
        method: 'POST',
        headers,
        body,
      });
      const text = await viaProxy.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        /* HTML SPA fallback — try direct */
      }
      if (data && (viaProxy.ok || viaProxy.status === 409)) {
        return { ok: viaProxy.ok, status: viaProxy.status, data };
      }
      if (viaProxy.ok === false && data?.error && viaProxy.status !== 404) {
        return { ok: false, status: viaProxy.status, data };
      }
    } catch {
      /* fall through to direct */
    }

    // Production domain: website-backend allows escrowcourier.com Origin
    let authToken = '';
    try {
      const tokenResponse = await fetch(
        'https://app.escrowcourier.com/website-backend-services/api/auth/token',
        { headers: { Accept: 'application/json' } },
      );
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        authToken =
          tokenData.token || tokenData.access_token || tokenData.bearer_token || '';
      }
    } catch {
      /* continue without token */
    }

    const direct = await fetch(
      'https://app.escrowcourier.com/website-backend-services/api/booking-agent-orders',
      {
        method: 'POST',
        headers: {
          ...headers,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body,
      },
    );
    const directText = await direct.text();
    let directData: any = {};
    try {
      directData = JSON.parse(directText);
    } catch {
      throw new Error(directText || `Booking failed (${direct.status})`);
    }
    return { ok: direct.ok, status: direct.status, data: directData };
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitError(null);

    const pickup = findStationByAgentId(pickupStations, formData.pickupPoint);
    const dropoff = findStationByAgentId(dropoffStations, formData.dropoffPoint);

    const vendorPhone = normalizeKenyaMobile(formData.vendorPhone);
    const customerPhone = normalizeKenyaMobile(formData.customerPhone);
    if (!vendorPhone || !customerPhone) {
      setSubmitError('Enter valid Kenyan mobiles for you and the receiver (07… / 01…)');
      return;
    }
    if (!pickup || !dropoff) {
      setSubmitError('Select both a drop-off point and a pickup point');
      return;
    }
    if (!deliveryFee || deliveryFee <= 0) {
      setSubmitError('Delivery fee is missing — go back and confirm weight or special item.');
      return;
    }

    const destinationTown = pickup.town || formData.customerCounty;
    const dropoffLabel = stationOptionLabel(dropoff);
    const parcelDescription =
      formData.specialInstructions?.trim() ||
      (formData.packageType === 'Other' ? formData.packageTypeOther : formData.packageType) ||
      'Parcel';

    const orderPayload = {
      vendorName: formData.vendorName,
      vendorPhone,
      senderName: formData.vendorName,
      senderPhone: vendorPhone,
      customerName: formData.customerName,
      customerPhone,
      customerAddress: destinationTown,
      customerCounty: destinationTown,
      destinationTown,
      pickupPointId: pickup.agentId,
      pickupPointName: pickup.businessName,
      agentId: Number(pickup.agentId) || pickup.agentId,
      originAgentId: Number(dropoff.agentId) || dropoff.agentId,
      dropoffPoint: dropoffLabel,
      packagingType:
        formData.packageType === 'Other' ? formData.packageTypeOther : formData.packageType,
      parcelDescription,
      weightRange: formData.specialSubItemId
        ? selectedSpecialSubItem?.label || 'SPECIAL'
        : formData.weightRange,
      distanceRange: pickup.distanceFromHQ || 0,
      parcelValue: parseFloat(formData.packageValue),
      shippingCharges: deliveryFee,
      isFragile: formData.isFragile,
      isSpillProne: formData.isSpillProne,
      specialInstructions: formData.specialInstructions,
      ...(formData.specialSubItemId
        ? {
            subItemId: Number(formData.specialSubItemId),
            specialItemId: Number(formData.specialSubItemId),
          }
        : {}),
    };

    setSubmitting(true);
    localStorage.setItem('currentBookingForm', JSON.stringify(formData));

    try {
      const result = await createBookingOrder(orderPayload);
      const orderData = result.data;

      // Duplicate unpaid booking — continue to payment with existing tracking
      const trackingNo = extractTrackingNo(orderData);
      const orderId = extractOrderId(orderData);

      if (!result.ok && result.status !== 409) {
        const message =
          orderData?.error?.message ||
          orderData?.message ||
          orderData?.error ||
          `Failed to create order (${result.status})`;
        throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
      }

      if (!trackingNo) {
        throw new Error('Order created but no tracking number was returned. Please try again.');
      }

      localStorage.setItem('currentOrder', JSON.stringify(orderData));
      localStorage.setItem('currentOrderTimestamp', Date.now().toString());

      navigate('/payment', {
        state: {
          bookingData: {
            ...formData,
            deliveryFee,
          },
          trackingNo,
          orderId,
          orderData,
          fromSummary: true,
        },
      });
    } catch (error: any) {
      console.error('Error creating order:', error);
      setSubmitError(error?.message || 'Could not create your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If returning from payment or localStorage contains previous booking, set step to summary (3)
  useEffect(() => {
    // Check for stale data and clear if older than 1 hour
    const storedTimestamp = localStorage.getItem('currentOrderTimestamp');
    if (storedTimestamp) {
      const timestamp = parseInt(storedTimestamp, 10);
      const oneHour = 60 * 60 * 1000;
      const now = Date.now();
      
      if (now - timestamp > oneHour) {
        console.log('Clearing stale booking data');
        localStorage.removeItem('currentOrder');
        localStorage.removeItem('currentOrderTimestamp');
        localStorage.removeItem('currentBookingForm');
        return; // Don't restore stale data
      }
    }
    
    const showSummary = location.state?.showSummary;
    if (showSummary) {
      const existing = location.state?.existingData;
      if (existing) {
        setFormData(prev => ({ ...prev, ...existing }));
      } else {
        const stored = localStorage.getItem('currentBookingForm');
        if (stored) {
          try { setFormData(prev => ({ ...prev, ...JSON.parse(stored) })); } catch {}
        }
      }
      setStep(3);
    } else if (!showSummary) {
      // Browser back without state but with persisted form & order
      const stored = localStorage.getItem('currentBookingForm');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // If there is also an order in localStorage, assume user was at summary
          if (localStorage.getItem('currentOrder')) {
            setFormData(prev => ({ ...prev, ...parsed }));
            setStep(3);
          }
        } catch {}
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>Book a Parcel Online | ParcelGrid</title>
        <meta
          name="description"
          content="Book a prepaid ParcelGrid delivery online — skip the station queue. Live pricing, M-Pesa payment, and instant tracking."
        />
        <link
          rel="canonical"
          href={typeof window !== 'undefined' ? `${window.location.origin}/book-parcel` : '/book-parcel'}
        />
      </Helmet>

      {/* Hero — matches Stations / Track */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(0,71,62,0.5),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-28 text-center sm:px-8 sm:pb-14 sm:pt-32">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">Prepaid booking</p>
          <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Book a parcel online
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
            Choose where you drop off and where they pick up, pay by M-Pesa, then hand in your parcel.
          </p>
        </div>
      </section>

      {/* Progress */}
      <div className="border-b border-black/[0.06] bg-[#f7f8f6]">
        <div className="mx-auto flex max-w-3xl items-center gap-2 overflow-x-auto px-5 py-4 sm:px-8">
          {BOOKING_STEPS.map((item, index) => {
            const active = step === item.id;
            const done = step > item.id;
            return (
              <div key={item.id} className="flex min-w-0 flex-1 items-center gap-2">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    active || done
                      ? 'bg-[#00473E] text-[#E9FF15]'
                      : 'border border-black/10 bg-white text-[#5c6562]'
                  }`}
                >
                  {done ? <CheckCircle className="size-4" /> : item.id}
                </div>
                <span
                  className={`truncate text-xs font-semibold sm:text-sm ${
                    active ? 'text-[#111]' : 'text-[#5c6562]'
                  }`}
                >
                  {item.label}
                </span>
                {index < BOOKING_STEPS.length - 1 && (
                  <div className="mx-1 hidden h-px flex-1 bg-black/10 sm:block" aria-hidden />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-6 text-sm text-[#5c6562]">
            Step {step} of {BOOKING_STEPS.length}
          </p>

          <div className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-8">
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-5">
                  <h2 className={sectionTitleClass}>
                    <User className="size-5 text-[#00473E]" aria-hidden />
                    Your details
                  </h2>
                  <div>
                    <label className={fieldLabelClass}>
                      Your name <span className="text-[#00473E]">*</span>
                    </label>
                    <Input
                      type="text"
                      data-field="vendorName"
                      value={formData.vendorName}
                      onChange={(e) => handleInputChange('vendorName', e.target.value)}
                      onBlur={() => handleBlur('vendorName')}
                      placeholder="e.g. Ronald"
                      className={fieldClass('vendorName')}
                      aria-invalid={Boolean(fieldErrors.vendorName)}
                    />
                    {fieldErrors.vendorName && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.vendorName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={fieldLabelClass}>
                      Your phone <span className="text-[#00473E]">*</span>
                    </label>
                    <Input
                      type="tel"
                      data-field="vendorPhone"
                      value={formData.vendorPhone}
                      onChange={(e) => handleInputChange('vendorPhone', e.target.value)}
                      onBlur={() => handleBlur('vendorPhone')}
                      placeholder="0712 345 678"
                      inputMode="tel"
                      className={fieldClass('vendorPhone')}
                      aria-invalid={Boolean(fieldErrors.vendorPhone)}
                    />
                    {fieldErrors.vendorPhone ? (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.vendorPhone}
                      </p>
                    ) : (
                      <p className={fieldHintClass}>Use 07… or 01… (M-Pesa). 254… also works.</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-black/[0.06]" />

                <div className="space-y-5">
                  <h2 className={sectionTitleClass}>
                    <User className="size-5 text-[#00473E]" aria-hidden />
                    Who receives it
                  </h2>
                  <div>
                    <label className={fieldLabelClass}>
                      Receiver name <span className="text-[#00473E]">*</span>
                    </label>
                    <Input
                      type="text"
                      data-field="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      onBlur={() => handleBlur('customerName')}
                      placeholder="Their full name"
                      className={fieldClass('customerName')}
                      aria-invalid={Boolean(fieldErrors.customerName)}
                    />
                    {fieldErrors.customerName && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.customerName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={fieldLabelClass}>
                      Receiver phone <span className="text-[#00473E]">*</span>
                    </label>
                    <Input
                      type="tel"
                      data-field="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      onBlur={() => handleBlur('customerPhone')}
                      placeholder="0712 345 678"
                      inputMode="tel"
                      className={fieldClass('customerPhone')}
                      aria-invalid={Boolean(fieldErrors.customerPhone)}
                    />
                    {fieldErrors.customerPhone ? (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.customerPhone}
                      </p>
                    ) : (
                      <p className={fieldHintClass}>Use a Kenyan mobile number starting with 07… or 01…</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-black/[0.06]" />

                <div className="space-y-5">
                  <h2 className={sectionTitleClass}>
                    <MapPin className="size-5 text-[#00473E]" aria-hidden />
                    Drop-off & pickup
                  </h2>
                  {stationsError && (
                    <p className={fieldErrorClass} role="alert">
                      {stationsError}
                    </p>
                  )}
                  <div>
                    <label className={fieldLabelClass}>
                      Drop-off point <span className="text-[#00473E]">*</span>
                    </label>
                    <StationPicker
                      stations={dropoffStations}
                      value={formData.dropoffPoint}
                      loading={stationsLoading}
                      hasError={Boolean(fieldErrors.dropoffPoint)}
                      error={fieldErrors.dropoffPoint || null}
                      dataField="dropoffPoint"
                      placeholder="Search town or shop to drop off…"
                      searchPlaceholder="e.g. Nairobi, Kisumu, Iconic…"
                      emptyMessage="No drop-off points match that search"
                      onChange={(agentId) => {
                        handleInputChange('dropoffPoint', agentId);
                        setTouched((prev) => ({ ...prev, dropoffPoint: true }));
                        setFieldError('dropoffPoint', agentId ? null : 'Select where you will drop off the parcel');
                      }}
                      onBlur={() => handleBlur('dropoffPoint')}
                    />
                    {!fieldErrors.dropoffPoint && (
                      <p className={fieldHintClass}>
                        Where you hand in the parcel — search by town or shop name.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={fieldLabelClass}>
                      Pickup point <span className="text-[#00473E]">*</span>
                    </label>
                    <StationPicker
                      stations={pickupStations}
                      value={formData.pickupPoint}
                      loading={stationsLoading}
                      hasError={Boolean(fieldErrors.pickupPoint)}
                      error={fieldErrors.pickupPoint || null}
                      dataField="pickupPoint"
                      placeholder="Search town or shop to collect…"
                      searchPlaceholder="e.g. Mombasa, Nakuru, Bamburi…"
                      emptyMessage="No pickup points match that search"
                      onChange={(agentId, station) => {
                        setFormData((prev) => ({
                          ...prev,
                          pickupPoint: agentId,
                          customerCounty: station?.town || prev.customerCounty,
                        }));
                        setTouched((prev) => ({ ...prev, pickupPoint: true }));
                        setFieldError('pickupPoint', agentId ? null : 'Select where they will pick up the parcel');
                      }}
                      onBlur={() => handleBlur('pickupPoint')}
                    />
                    {!fieldErrors.pickupPoint && (
                      <p className={fieldHintClass}>
                        Where the receiver collects — town and station in one place.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className={sectionTitleClass}>
                  <Package className="size-5 text-[#00473E]" aria-hidden />
                  Parcel details
                </h2>

                <div>
                  <label className={fieldLabelClass}>
                    Package type <span className="text-[#00473E]">*</span>
                  </label>
                  <SelectPicker
                    dataField="packageType"
                    value={formData.packageType}
                    placeholder="Select package type"
                    options={packageTypes.map((type) => ({ value: type, label: type }))}
                    hasError={Boolean(fieldErrors.packageType)}
                    error={fieldErrors.packageType || null}
                    onChange={(value) => {
                      handleInputChange('packageType', value);
                      setTouched((prev) => ({ ...prev, packageType: true }));
                    }}
                    onBlur={() => handleBlur('packageType')}
                  />
                </div>

                {formData.packageType === 'Other' && (
                  <div>
                    <label className={fieldLabelClass}>
                      Specify type <span className="text-[#00473E]">*</span>
                    </label>
                    <Input
                      type="text"
                      data-field="packageTypeOther"
                      value={formData.packageTypeOther}
                      onChange={(e) => handleInputChange('packageTypeOther', e.target.value)}
                      onBlur={() => handleBlur('packageTypeOther')}
                      placeholder="Describe your package"
                      className={fieldClass('packageTypeOther')}
                      aria-invalid={Boolean(fieldErrors.packageTypeOther)}
                    />
                    {fieldErrors.packageTypeOther && (
                      <p className={fieldErrorClass} role="alert">
                        {fieldErrors.packageTypeOther}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className={fieldLabelClass}>
                    Weight range <span className="text-[#00473E]">*</span>
                  </label>
                  <SelectPicker
                    dataField="weightRange"
                    value={formData.weightRange}
                    placeholder={
                      formData.specialSubItemId
                        ? 'Using special item rate'
                        : weightBandsLoading
                          ? 'Loading weight ranges…'
                          : weightBands.length === 0
                            ? 'Weight ranges unavailable'
                            : 'Select weight range'
                    }
                    options={weightBands.map((band) => ({
                      value: band.value,
                      label: band.label,
                    }))}
                    loading={weightBandsLoading}
                    disabled={
                      Boolean(formData.specialSubItemId) ||
                      weightBandsLoading ||
                      weightBands.length === 0
                    }
                    hasError={Boolean(fieldErrors.weightRange || weightBandsError)}
                    error={fieldErrors.weightRange || weightBandsError || null}
                    onChange={(value) => {
                      handleInputChange('weightRange', value);
                      setTouched((prev) => ({ ...prev, weightRange: true }));
                      if (value) {
                        setSelectedSpecialSubItem(null);
                        setFormData((prev) => ({ ...prev, specialSubItemId: '' }));
                      }
                    }}
                    onBlur={() => handleBlur('weightRange')}
                  />
                  {!fieldErrors.weightRange && !weightBandsError && (
                    <p className={fieldHintClass}>
                      {formData.specialSubItemId
                        ? 'Special item selected — weight band not needed.'
                        : 'Pick the weight range that best matches your parcel.'}
                    </p>
                  )}
                </div>

                <div>
                  <label className={fieldLabelClass}>
                    Declared value (KES) <span className="text-[#00473E]">*</span>
                  </label>
                  <Input
                    type="number"
                    data-field="packageValue"
                    value={formData.packageValue}
                    onChange={(e) => handleInputChange('packageValue', e.target.value)}
                    onBlur={() => handleBlur('packageValue')}
                    placeholder="e.g. 5000"
                    className={fieldClass('packageValue')}
                    min="0"
                    aria-invalid={Boolean(fieldErrors.packageValue)}
                  />
                  {fieldErrors.packageValue && (
                    <p className={fieldErrorClass} role="alert">
                      {fieldErrors.packageValue}
                    </p>
                  )}
                </div>

                <div>
                  <p className={fieldLabelClass}>Handling</p>
                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-[#f7f8f6] px-4 py-2.5 text-sm text-[#222]">
                      <input
                        type="checkbox"
                        checked={formData.isFragile}
                        onChange={(e) => handleInputChange('isFragile', e.target.checked)}
                        className="size-4 rounded border-black/20 text-[#00473E] focus:ring-[#00473E]"
                      />
                      Fragile
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-[#f7f8f6] px-4 py-2.5 text-sm text-[#222]">
                      <input
                        type="checkbox"
                        checked={formData.isSpillProne}
                        onChange={(e) => handleInputChange('isSpillProne', e.target.checked)}
                        className="size-4 rounded border-black/20 text-[#00473E] focus:ring-[#00473E]"
                      />
                      Spill-prone
                    </label>
                  </div>
                </div>

                <div>
                  <label className={fieldLabelClass}>Parcel description</label>
                  <textarea
                    data-field="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => {
                      const text = e.target.value;
                      handleInputChange('specialInstructions', text);
                      applyDescriptionDetection(text);
                    }}
                    onBlur={() => handleBlur('specialInstructions')}
                    placeholder={
                      detectedSpecial
                        ? `e.g. ${detectedSpecial.category.name} size / model`
                        : 'e.g. cooker, 55 inch TV, mattress 6x6…'
                    }
                    className={textareaClass}
                    rows={3}
                    aria-invalid={Boolean(fieldErrors.specialInstructions)}
                  />
                  <p className={fieldHintClass}>
                    Type an item name to match special rates (cookers, TVs, fridges, mattresses…).
                  </p>

                  {detectedSpecial && detectedSpecial.category.subItems.length > 0 && (
                    <div className="mt-3 space-y-2 rounded-2xl border border-[#00473E]/15 bg-[#00473E]/[0.04] p-3.5">
                      <p className="text-sm font-semibold text-[#00473E]">
                        {detectedSpecial.category.name} — pick a size / type
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {detectedSpecial.category.subItems.map((item) => {
                          const active = String(item.id) === formData.specialSubItemId;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => selectSpecialSubItem(item)}
                              className={`rounded-full px-3.5 py-2 text-left text-xs font-semibold transition ${
                                active
                                  ? 'bg-[#00473E] text-white'
                                  : 'bg-white text-[#00473E] ring-1 ring-black/10 hover:ring-[#00473E]/35'
                              }`}
                            >
                              <span className="block">{item.label}</span>
                              {item.price > 0 && (
                                <span
                                  className={`mt-0.5 block font-medium ${
                                    active ? 'text-white/80' : 'text-[#5c6562]'
                                  }`}
                                >
                                  from KES {item.price.toLocaleString()}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {selectedSpecialSubItem && (
                        <p className="text-xs font-medium text-[#00473E]">
                          Special rate selected for {selectedSpecialSubItem.label}.
                        </p>
                      )}
                    </div>
                  )}
                  {fieldErrors.specialInstructions && (
                    <p className={fieldErrorClass} role="alert">
                      {fieldErrors.specialInstructions}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-[#00473E]/15 bg-[#071410] px-4 py-4 text-white">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[#E9FF15] uppercase">
                    Live delivery fee
                  </p>
                  {feeLoading ? (
                    <p className="mt-2 text-sm text-white/70">Updating fee…</p>
                  ) : feeError ? (
                    <p className="mt-2 text-sm text-amber-200">{feeError}</p>
                  ) : deliveryFee !== null ? (
                    <>
                      <p className="mt-1 font-[Sora] text-3xl font-semibold tracking-tight">
                        KES {deliveryFee.toLocaleString()}
                      </p>
                      {feeNote && <p className="mt-1 text-xs text-white/60">{feeNote}</p>}
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-white/65">
                      {formData.specialSubItemId
                        ? 'Select drop-off & pickup to price this special item'
                        : 'Select stations + weight (or a special item) to see the fee'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className={sectionTitleClass}>
                  <CheckCircle className="size-5 text-[#00473E]" aria-hidden />
                  Review booking
                </h2>

                {deliveryFee !== null && (
                  <div className="rounded-2xl bg-[#00473E] px-5 py-5 text-white">
                    <p className="text-xs font-semibold tracking-[0.14em] text-[#E9FF15] uppercase">
                      Delivery fee · Prepaid
                    </p>
                    <p className="mt-2 font-[Sora] text-3xl font-semibold tracking-tight">
                      KES {deliveryFee.toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-black/[0.06] bg-[#f7f8f6] p-4">
                    <p className="text-xs font-semibold tracking-wide text-[#5c6562] uppercase">
                      You
                    </p>
                    <p className="mt-2 font-semibold text-[#111]">{formData.vendorName}</p>
                    <p className="mt-1 text-sm text-[#5c6562]">{formData.vendorPhone}</p>
                  </div>
                  <div className="rounded-2xl border border-black/[0.06] bg-[#f7f8f6] p-4">
                    <p className="text-xs font-semibold tracking-wide text-[#5c6562] uppercase">
                      Receiver
                    </p>
                    <p className="mt-2 font-semibold text-[#111]">{formData.customerName}</p>
                    <p className="mt-1 text-sm text-[#5c6562]">{formData.customerPhone}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/[0.06] bg-[#f7f8f6] p-4">
                  <p className="text-xs font-semibold tracking-wide text-[#5c6562] uppercase">
                    Route & parcel
                  </p>
                  <p className="mt-2 text-sm text-[#222]">
                    <span className="font-semibold">Drop-off:</span>{' '}
                    {selectedDropoff ? stationOptionLabel(selectedDropoff) : '—'}
                  </p>
                  <p className="mt-1 text-sm text-[#222]">
                    <span className="font-semibold">Pickup:</span>{' '}
                    {selectedPickup ? stationOptionLabel(selectedPickup) : '—'}
                  </p>
                  <p className="mt-2 text-sm text-[#5c6562]">
                    {formData.packageType === 'Other'
                      ? formData.packageTypeOther
                      : formData.packageType}{' '}
                    ·{' '}
                    {selectedSpecialSubItem
                      ? `Special · ${selectedSpecialSubItem.label}`
                      : weightBands.find((b) => b.value === formData.weightRange)?.label ||
                        formData.weightRange}{' '}
                    · Value KES{' '}
                    {Number(formData.packageValue || 0).toLocaleString()}
                    {(formData.isFragile || formData.isSpillProne) &&
                      ` · ${[
                        formData.isFragile && 'Fragile',
                        formData.isSpillProne && 'Spill-prone',
                      ]
                        .filter(Boolean)
                        .join(', ')}`}
                  </p>
                  {formData.specialInstructions && (
                    <p className="mt-2 text-sm text-[#5c6562]">{formData.specialInstructions}</p>
                  )}
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-[#E9FF15]/60 bg-[#E9FF15]/20 px-4 py-3">
                  <Truck className="mt-0.5 size-4 shrink-0 text-[#00473E]" aria-hidden />
                  <p className="text-sm text-[#3d4542]">
                    Confirm to create your tracking number, then pay the courier fee by M-Pesa
                    Prompt or Paybill.
                  </p>
                </div>

                {submitError && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {submitError}
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={submitting}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-[#00473E] transition-colors hover:border-[#00473E]/30 disabled:opacity-50"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
              ) : (
                <span />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00473E] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#00352f]"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || feeLoading || !deliveryFee}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#E9FF15] px-6 text-sm font-bold text-[#00473E] transition-colors hover:bg-[#d4ee12] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <CheckCircle className="size-4" />
                  )}
                  {submitting ? 'Creating booking…' : 'Confirm & pay'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingPage;
