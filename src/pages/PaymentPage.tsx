import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle,
  Copy,
  Lightbulb,
  Loader2,
  RefreshCw,
  Smartphone,
} from 'lucide-react';
import Receipt from '../components/Receipt';
import { PageHeroBackground } from '../components/PageHeroBackground';
import { BRANCHES } from '../lib/branches';
import { isValidKenyaMobile, kenyaMobileError, normalizeKenyaMobile } from '../lib/phone';
import {
  checkPaymentStatus,
  extractTrackingFromOrder,
  isTerminalFailure,
  MPESA_PAYBILL,
  MPESA_PAYBILL_NAME,
  sendCourierFeePrompt,
} from '../lib/payments';

type LocationState = {
  bookingData?: any;
  orderId?: string;
  trackingNo?: string;
  orderData?: any;
};

type PayMethod = 'prompt' | 'paybill';
type Phase = 'ready' | 'awaiting_prompt' | 'awaiting_paybill' | 'success' | 'failed';

/** Max status checks after an STK prompt before we stop and send the user to Paybill. */
const PROMPT_STATUS_MAX_ATTEMPTS = 5;
/** Max Paybill auto-polls after "I've paid" before we stop the spinner. */
const PAYBILL_STATUS_MAX_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 4000;

const inputClass =
  'h-12 w-full rounded-full border border-black/10 bg-white px-5 text-sm text-[#111] outline-none transition-colors placeholder:text-[#9aa3a0] focus:border-[#00473E]/40 focus:ring-2 focus:ring-[#00473E]/15';

function readCachedOrder() {
  const storedOrder = sessionStorage.getItem('currentOrder');
  const storedTimestamp = sessionStorage.getItem('currentOrderTimestamp');
  if (!storedOrder || !storedTimestamp) return null;
  try {
    const timestamp = parseInt(storedTimestamp, 10);
    if (Date.now() - timestamp > 60 * 60 * 1000) {
      sessionStorage.removeItem('currentOrder');
      sessionStorage.removeItem('currentOrderTimestamp');
      sessionStorage.removeItem('currentBookingForm');
      return null;
    }
    return JSON.parse(storedOrder);
  } catch {
    return null;
  }
}

function CopyRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#5c6562] uppercase">
          {label}
        </p>
        <p
          className={`mt-1 break-all text-base font-semibold text-[#111] ${
            mono ? 'font-mono tracking-tight' : 'font-[Sora]'
          }`}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          } catch {
            /* ignore */
          }
        }}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-black/10 text-[#00473E] transition-colors hover:bg-[#00473E]/5"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as LocationState;

  const orderBundle = useMemo(
    () => state.orderData || readCachedOrder(),
    [state.orderData],
  );

  const trackingNo = useMemo(
    () => extractTrackingFromOrder(orderBundle, state.trackingNo || state.orderId || ''),
    [orderBundle, state.trackingNo, state.orderId],
  );

  const amount = useMemo(() => {
    const fromOrder =
      orderBundle?.shippingCharges ??
      orderBundle?.data?.order?.[0]?.shippingCharges ??
      orderBundle?.data?.order?.shippingCharges ??
      orderBundle?.order?.shippingCharges ??
      orderBundle?.data?.shippingCharges;
    const fromBooking = state.bookingData?.deliveryFee;
    const n = Number(fromOrder ?? fromBooking ?? 0);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [orderBundle, state.bookingData?.deliveryFee]);

  const [phoneNumber, setPhoneNumber] = useState(
    () => state.bookingData?.vendorPhone || '',
  );
  const [method, setMethod] = useState<PayMethod>('prompt');
  const [phase, setPhase] = useState<Phase>('ready');
  const [error, setError] = useState<string | null>(null);
  const [statusHint, setStatusHint] = useState<string | null>(null);
  const [, setMerchantRequestId] = useState('');
  const [, setCheckoutRequestId] = useState('');
  const [transactionCode, setTransactionCode] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [pollAttempt, setPollAttempt] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptsRef = useRef(0);
  const pollModeRef = useRef<'prompt' | 'paybill'>('prompt');
  const tickInFlight = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    tickInFlight.current = false;
    setIsPolling(false);
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  useEffect(() => {
    if (!state.bookingData && !trackingNo) {
      navigate('/book-parcel', { replace: true });
    }
  }, [state.bookingData, trackingNo, navigate]);

  const clearBookingCache = () => {
    sessionStorage.removeItem('currentOrder');
    sessionStorage.removeItem('currentOrderTimestamp');
    sessionStorage.removeItem('currentBookingForm');
    try {
      localStorage.removeItem('currentOrder');
      localStorage.removeItem('currentOrderTimestamp');
      localStorage.removeItem('currentBookingForm');
    } catch {
      /* ignore */
    }
  };

  const markSuccess = (code?: string | null, message?: string | null) => {
    stopPolling();
    setTransactionCode(code || null);
    setStatusHint(message || 'Payment completed successfully');
    setPhase('success');
    setSending(false);
    setConfirming(false);
    setError(null);
    clearBookingCache();
  };

  const markFailed = (message: string) => {
    stopPolling();
    setPhase('failed');
    setError(message);
    setSending(false);
    setConfirming(false);
  };

  /** After STK prompt checks are exhausted, stop spinner and open Paybill. */
  const switchToPaybill = (message: string) => {
    stopPolling();
    setMethod('paybill');
    setPhase('ready');
    setSending(false);
    setConfirming(false);
    setError(null);
    setStatusHint(message);
  };

  const pollOnce = useCallback(
    async (opts: {
      merchantRequestId?: string;
      checkoutRequestId?: string;
      trackingNo?: string;
    }) => {
      const result = await checkPaymentStatus(opts);
      if (result.isPaid || String(result.status).toUpperCase() === 'SUCCESS') {
        markSuccess(result.transactionCode, result.message);
        return 'paid' as const;
      }
      if (isTerminalFailure(result.status)) {
        return 'terminal' as const;
      }
      if (result.status === 'NOT_FOUND') {
        setStatusHint('Waiting for M-Pesa… payment not received yet.');
        return 'pending' as const;
      }
      setStatusHint(result.message || result.resultDesc || 'Waiting for M-Pesa confirmation…');
      return 'pending' as const;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const startPolling = useCallback(
    (
      opts: {
        merchantRequestId?: string;
        checkoutRequestId?: string;
        trackingNo?: string;
      },
      mode: 'prompt' | 'paybill' = 'prompt',
    ) => {
      stopPolling();
      pollModeRef.current = mode;
      pollAttemptsRef.current = 0;
      setPollAttempt(0);
      setIsPolling(true);
      const maxAttempts =
        mode === 'prompt' ? PROMPT_STATUS_MAX_ATTEMPTS : PAYBILL_STATUS_MAX_ATTEMPTS;

      const tick = async () => {
        if (tickInFlight.current) return;
        tickInFlight.current = true;
        pollAttemptsRef.current += 1;
        const attempt = pollAttemptsRef.current;
        setPollAttempt(attempt);
        try {
          const outcome = await pollOnce(opts);
          if (outcome === 'paid') return;
          if (outcome === 'terminal') {
            if (pollModeRef.current === 'prompt') {
              switchToPaybill(
                'The M-Pesa prompt was not completed. Pay with Paybill using your tracking number, then tap confirm.',
              );
            } else {
              markFailed(
                'Payment was not completed. Finish Paybill, wait a few seconds, then confirm again.',
              );
            }
            return;
          }
          // pending
          setStatusHint(
            `Waiting for M-Pesa… check ${attempt} of ${maxAttempts}.`,
          );
          if (attempt >= maxAttempts) {
            if (pollModeRef.current === 'prompt') {
              switchToPaybill(
                'No confirmation after 5 checks. Use Paybill with your tracking number as the account, then tap “I’ve paid”.',
              );
            } else {
              stopPolling();
              setConfirming(false);
              setPhase('ready');
              setStatusHint(
                'Payment not seen yet. Finish Paybill, wait a few seconds, then tap confirm again.',
              );
            }
          }
        } catch (err: any) {
          setStatusHint(err?.message || 'Still checking…');
          if (attempt >= maxAttempts) {
            if (pollModeRef.current === 'prompt') {
              switchToPaybill(
                'Could not confirm the prompt. Use Paybill with your tracking number, then tap confirm.',
              );
            } else {
              stopPolling();
              setConfirming(false);
              setPhase('ready');
              setError(err?.message || 'Could not confirm payment. Try again shortly.');
            }
          }
        } finally {
          tickInFlight.current = false;
        }
      };

      void tick();
      pollRef.current = setInterval(tick, POLL_INTERVAL_MS);
    },
    [pollOnce, stopPolling],
  );

  const handleSendPrompt = async () => {
    if (!trackingNo) {
      setError('Missing tracking number. Go back and confirm the booking again.');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Missing delivery fee. Go back to the booking summary.');
      return;
    }
    if (!isValidKenyaMobile(phoneNumber)) {
      setError(kenyaMobileError(phoneNumber) || 'Enter a valid Kenyan mobile (07… / 01…)');
      return;
    }
    const phone = normalizeKenyaMobile(phoneNumber);
    if (!phone) {
      setError('Enter a valid Kenyan mobile (07… / 01…)');
      return;
    }

    setSending(true);
    setError(null);
    setStatusHint('Sending M-Pesa prompt…');
    try {
      const prompt = await sendCourierFeePrompt({
        phoneNumber: phone,
        amount,
        trackingNo,
      });
      setMerchantRequestId(prompt.merchantRequestId || '');
      setCheckoutRequestId(prompt.checkoutRequestId || '');
      setPhase('awaiting_prompt');
      setStatusHint('Check your phone and enter your M-Pesa PIN.');
      startPolling(
        {
          merchantRequestId: prompt.merchantRequestId,
          checkoutRequestId: prompt.checkoutRequestId,
          trackingNo,
        },
        'prompt',
      );
    } catch (err: any) {
      setError(err?.message || 'Could not send M-Pesa prompt. Try Paybill instead.');
      setPhase('failed');
      setMethod('paybill');
      setStatusHint('Use Paybill with your tracking number as the account number.');
    } finally {
      setSending(false);
    }
  };

  const handleConfirmPaybill = async () => {
    if (!trackingNo) {
      setError('Missing tracking number.');
      return;
    }
    setConfirming(true);
    setError(null);
    setPhase('awaiting_paybill');
    setStatusHint('Checking Paybill payment…');
    try {
      const outcome = await pollOnce({ trackingNo });
      if (outcome === 'paid') return;
      if (outcome === 'terminal') {
        markFailed('Payment was not completed. Finish Paybill, then confirm again.');
        return;
      }
      setStatusHint('Payment not seen yet — checking a few more times…');
      startPolling({ trackingNo }, 'paybill');
    } catch (err: any) {
      setError(err?.message || 'Could not confirm payment. Try again shortly.');
      setPhase('ready');
    } finally {
      setConfirming(false);
    }
  };

  const handleRetryPrompt = () => {
    stopPolling();
    setPhase('ready');
    setMethod('prompt');
    setError(null);
    setStatusHint(null);
    setPollAttempt(0);
    setMerchantRequestId('');
    setCheckoutRequestId('');
  };

  const handleBackToSummary = () => {
    stopPolling();
    navigate('/book-parcel', {
      state: {
        showSummary: true,
        existingData: state.bookingData || orderBundle?.data?.order?.[0] || {},
      },
    });
  };

  if (phase === 'success') {
    return (
      <div className="min-h-screen bg-[#f7f8f6] text-[#222]">
        <Helmet>
          <title>Payment successful | ParcelGrid</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <section className="relative -mt-24 overflow-hidden bg-[#071410]">
          <PageHeroBackground />
          <div className="relative mx-auto max-w-2xl px-5 pb-12 pt-28 text-center sm:px-8 sm:pt-32">
            <CheckCircle className="mx-auto size-12 text-[#E9FF15]" aria-hidden />
            <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.03em] text-white">
              Payment successful
            </h1>
            <p className="mt-3 text-sm text-white/70">
              Tracking {trackingNo}
              {transactionCode ? ` · M-Pesa ${transactionCode}` : ''}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
          {(() => {
            const bd = state.bookingData || {};
            const selectedDropoff =
              bd.dropoffPointLabel ||
              (bd.dropoffPointName
                ? `${bd.dropoffPointTown ? `${bd.dropoffPointTown} — ` : ''}${bd.dropoffPointName}`
                : null);
            const selectedAddress = bd.dropoffPointAddress || null;
            const isCbdOffices =
              String(bd.dropoffPointId || bd.originAgentId || '') === '366' ||
              /nairobi cbd|cbd office/i.test(String(selectedDropoff || ''));

            return (
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-[#00473E] uppercase">
                    Drop off your parcel
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#5c6562]">
                    Write <span className="font-mono font-semibold text-[#111]">{trackingNo}</span>{' '}
                    on the parcel, then drop it at the station you selected — or at any ParcelGrid
                    Nairobi CBD office.
                  </p>
                </div>

                {selectedDropoff && !isCbdOffices && (
                  <div className="rounded-2xl bg-[#00473E]/[0.06] px-4 py-3.5">
                    <p className="text-xs font-semibold tracking-wide text-[#00473E] uppercase">
                      Your selected drop-off
                    </p>
                    <p className="mt-1 font-[Sora] text-sm font-semibold text-[#111]">
                      {selectedDropoff}
                    </p>
                    {selectedAddress && (
                      <p className="mt-1 text-sm text-[#5c6562]">{selectedAddress}</p>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold tracking-wide text-[#5c6562] uppercase">
                    Nairobi CBD offices
                  </p>
                  <ul className="mt-3 space-y-3">
                    {BRANCHES.map((b) => (
                      <li
                        key={b.id}
                        className="border-b border-black/[0.06] pb-3 last:border-0"
                      >
                        <p className="font-[Sora] text-sm font-semibold text-[#111]">{b.name}</p>
                        <p className="mt-1 text-sm text-[#5c6562]">{b.address}</p>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="mt-3 inline-flex text-sm font-semibold text-[#00473E] underline-offset-2 hover:underline"
                  >
                    See all CBD office details
                  </Link>
                </div>
              </div>
            );
          })()}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowReceipt(true)}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#00473E] px-6 text-sm font-semibold text-white"
            >
              View receipt
            </button>
            <Link
              to="/"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-[#00473E]"
            >
              Back to home
            </Link>
          </div>
        </div>

        {showReceipt && (
          <Receipt
            orderData={{
              ...(orderBundle || {}),
              ...(state.bookingData || {}),
              bookingData: {
                ...(state.bookingData || {}),
                pickupPoint:
                  state.bookingData?.pickupPointId ||
                  state.bookingData?.pickupPoint ||
                  state.bookingData?.agentId,
                pickupPointId:
                  state.bookingData?.pickupPointId ||
                  state.bookingData?.pickupPoint ||
                  state.bookingData?.agentId,
                pickupPointName: state.bookingData?.pickupPointName,
                pickupPointAddress: state.bookingData?.pickupPointAddress,
                dropoffPointLabel: state.bookingData?.dropoffPointLabel,
                dropoffPointName: state.bookingData?.dropoffPointName,
                packageValue: state.bookingData?.packageValue,
                deliveryFee: state.bookingData?.deliveryFee ?? amount,
              },
              trackingNo,
              pickupPoint:
                state.bookingData?.pickupPointId ||
                state.bookingData?.pickupPoint ||
                state.bookingData?.agentId,
              paymentReference: transactionCode,
              courierPaymentReference: transactionCode,
              deliveryFee: amount,
              paymentStatus: 'Pre-paid',
            }}
            onClose={() => setShowReceipt(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-[#222]">
      <Helmet>
        <title>Pay courier fee | ParcelGrid</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <PageHeroBackground />
        <div className="relative mx-auto max-w-2xl px-5 pb-10 pt-28 sm:px-8 sm:pb-12 sm:pt-32">
          <button
            type="button"
            onClick={handleBackToSummary}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to summary
          </button>
          <h1 className="mt-6 font-[Sora] text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Pay courier fee
          </h1>
          <p className="mt-3 text-sm text-white/70 sm:text-base">
            Pay by M-Pesa prompt or Paybill, then we confirm automatically.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
        {/* Tracking + amount — flat, no card */}
        <div className="border-b border-black/[0.08] pb-6">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#00473E] uppercase">
            Your booking
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs text-[#5c6562]">Tracking number</p>
              <p className="mt-1 font-mono text-xl font-semibold tracking-tight text-[#111]">
                {trackingNo || '—'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#5c6562]">Amount due</p>
              <p className="mt-1 font-[Sora] text-3xl font-bold tracking-tight text-[#00473E]">
                KES {amount > 0 ? amount.toLocaleString() : '—'}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#00473E]/[0.06] px-4 py-3.5">
            <Lightbulb
              className="mt-0.5 size-4 shrink-0 text-[#00473E]"
              aria-hidden
            />
            <div className="min-w-0 text-sm leading-relaxed text-[#2a3330]">
              <p className="font-semibold text-[#00473E]">Drop-off tip</p>
              <p className="mt-1 text-[#5c6562]">
                Write your tracking number
                {trackingNo ? (
                  <>
                    {' '}
                    <span className="font-mono font-semibold text-[#111]">
                      {trackingNo}
                    </span>
                  </>
                ) : null}{' '}
                on the parcel, then drop it at any ParcelGrid branch. That number
                is your booking — our team will match it and process the parcel.
              </p>
            </div>
          </div>
        </div>

        {/* Paybill details — like the app */}
        <div className="border-b border-black/[0.08] py-6">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#00473E] uppercase">
            M-Pesa Paybill
          </p>
          <p className="mt-2 text-sm text-[#5c6562]">
            Use your tracking number as the Account Number when paying.
          </p>
          <div className="mt-2">
            <CopyRow label="Paybill" value={MPESA_PAYBILL} mono />
            <CopyRow label="Account Number" value={trackingNo || '—'} mono />
            <CopyRow
              label="Amount"
              value={amount > 0 ? String(amount) : '—'}
              mono
            />
            <CopyRow label="Business" value={MPESA_PAYBILL_NAME} />
          </div>
        </div>

        {/* Method toggle */}
        <div className="py-6">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#00473E] uppercase">
            How do you want to pay?
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMethod('prompt');
                if (phase === 'awaiting_paybill') setPhase('ready');
              }}
              className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${
                method === 'prompt'
                  ? 'bg-[#00473E] text-white'
                  : 'border border-black/10 bg-white text-[#00473E]'
              }`}
            >
              <Smartphone className="size-4" aria-hidden />
              M-Pesa prompt
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod('paybill');
                stopPolling();
                if (phase === 'awaiting_prompt') setPhase('ready');
              }}
              className={`inline-flex h-11 flex-1 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                method === 'paybill'
                  ? 'bg-[#00473E] text-white'
                  : 'border border-black/10 bg-white text-[#00473E]'
              }`}
            >
              Paybill
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 border-y border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>{error}</p>
          </div>
        )}

        {method === 'prompt' && (phase === 'ready' || phase === 'failed') && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#222]">
                M-Pesa phone number <span className="text-[#00473E]">*</span>
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0712 345 678"
                className={inputClass}
                disabled={sending}
              />
              <p className="mt-1.5 text-xs text-[#5c6562]">
                Number that will receive the STK prompt (07… or 01…).
              </p>
            </div>
            <button
              type="button"
              onClick={handleSendPrompt}
              disabled={sending || !isValidKenyaMobile(phoneNumber)}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E9FF15] text-sm font-bold text-[#111] transition hover:bg-[#f3ff6a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Sending prompt…
                </>
              ) : phase === 'failed' ? (
                <>
                  <RefreshCw className="size-4" aria-hidden />
                  Retry M-Pesa prompt
                </>
              ) : (
                'Send M-Pesa prompt'
              )}
            </button>
          </div>
        )}

        {method === 'prompt' && phase === 'awaiting_prompt' && (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Loader2 className="mt-1 size-5 shrink-0 animate-spin text-[#00473E]" aria-hidden />
              <div>
                <p className="font-[Sora] text-lg font-semibold text-[#111]">
                  Waiting for your PIN
                </p>
                <p className="mt-1 text-sm text-[#5c6562]">
                  Prompt sent to {phoneNumber}. Enter your M-Pesa PIN on your phone.
                </p>
                {statusHint && (
                  <p className="mt-2 text-xs text-[#5c6562]">{statusHint}</p>
                )}
                {pollAttempt > 0 && (
                  <p className="mt-1 text-xs font-medium text-[#00473E]">
                    Check {Math.min(pollAttempt, PROMPT_STATUS_MAX_ATTEMPTS)} of{' '}
                    {PROMPT_STATUS_MAX_ATTEMPTS}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setMethod('paybill');
                  setPhase('ready');
                  stopPolling();
                  setStatusHint(
                    'Pay with Paybill using your tracking number, then tap “I’ve paid”.',
                  );
                }}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-[#00473E]"
              >
                Use Paybill instead
              </button>
              <button
                type="button"
                onClick={handleRetryPrompt}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#00473E] px-5 text-sm font-semibold text-white"
              >
                Cancel &amp; retry prompt
              </button>
            </div>
          </div>
        )}

        {method === 'paybill' && (
          <div className="space-y-5">
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#5c6562]">
              <li>Open M-Pesa → Lipa na M-Pesa → Paybill</li>
              <li>
                Enter Paybill <strong className="text-[#111]">{MPESA_PAYBILL}</strong>
              </li>
              <li>
                Account Number = tracking{' '}
                <strong className="font-mono text-[#111]">{trackingNo || '—'}</strong>
              </li>
              <li>
                Amount{' '}
                <strong className="text-[#111]">
                  KES {amount > 0 ? amount.toLocaleString() : '—'}
                </strong>
                , then enter your PIN
              </li>
              <li>Return here and confirm payment</li>
            </ol>
            <button
              type="button"
              onClick={handleConfirmPaybill}
              disabled={confirming || !trackingNo}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E9FF15] text-sm font-bold text-[#111] transition hover:bg-[#f3ff6a] disabled:opacity-60"
            >
              {confirming || (phase === 'awaiting_paybill' && isPolling) ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Confirming payment…
                  {pollAttempt > 0
                    ? ` (${Math.min(pollAttempt, PAYBILL_STATUS_MAX_ATTEMPTS)}/${PAYBILL_STATUS_MAX_ATTEMPTS})`
                    : ''}
                </>
              ) : (
                "I've paid — confirm payment"
              )}
            </button>
            {statusHint && (phase === 'awaiting_paybill' || method === 'paybill') && (
              <p className="text-sm text-[#5c6562]">{statusHint}</p>
            )}
          </div>
        )}

        {phase === 'failed' && method === 'paybill' && (
          <button
            type="button"
            onClick={handleConfirmPaybill}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-[#00473E]"
          >
            <RefreshCw className="size-4" aria-hidden />
            Check Paybill again
          </button>
        )}
      </div>
    </div>
  );
}
