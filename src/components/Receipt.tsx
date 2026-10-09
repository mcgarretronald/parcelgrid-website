import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2, X } from 'lucide-react';

interface ReceiptProps {
  orderData: any;
  onClose: () => void;
}

type PickupDetails = {
  name: string;
  contact: string;
  location: string;
};

/** Hex-only palette for the printable receipt (html2canvas-safe, matches admin). */
const R = {
  ink: '#111827',
  label: '#4b5563',
  line: '#d1d5db',
  lineStrong: '#111827',
  soft: '#f9fafb',
  white: '#ffffff',
  warnBg: '#fefce8',
  warnBorder: '#fde68a',
  warnTitle: '#854d0e',
  warnBody: '#a16207',
} as const;

const receiptFont = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function unwrapOrder(orderData: any) {
  return (
    orderData?.order?.[0] ||
    orderData?.order ||
    orderData?.data?.order?.[0] ||
    orderData?.data?.order ||
    orderData?.data ||
    orderData ||
    {}
  );
}

function formatPhone(p: string | null | undefined): string {
  if (!p || p === 'N/A') return p || 'N/A';
  const s = String(p).trim();
  if (s.startsWith('+')) return s;
  if (s.startsWith('254') && s.length >= 12) return `+${s}`;
  if (/^0[17]\d{8}$/.test(s)) return `+254${s.slice(1)}`;
  if (s.length === 9) return `+254${s}`;
  return s;
}

function formatKes(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0.00';
  return n.toFixed(2);
}

function resolveBranchCode(sources: Record<string, unknown>[]): string {
  for (const order of sources) {
    const explicit =
      order.branchCode ??
      order.branch_code ??
      (order.hub as any)?.branchCode ??
      (order.branch as any)?.branchCode;
    const raw = String(explicit ?? '').trim();
    if (/^\d{1,3}$/.test(raw)) return raw.padStart(3, '0');
    if (raw) return raw;
  }
  const name = String(
    sources
      .map((o) => o.dropoffPointLabel || o.dropoffPointName || o.dropoffPoint || '')
      .join(' '),
  );
  if (/jitihada|jithada/i.test(name)) return '001';
  if (/iconic/i.test(name)) return '002';
  if (/city\s*(mall|centre|center)|ronald\s*ngala|cbd/i.test(name)) return '003';
  return '';
}

async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not create PNG'))),
      'image/png',
    );
  });
}

async function fetchPickupAgents(): Promise<any[]> {
  for (const url of ['/pickup-points-api', '/api/pickup-points']) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;
      const json = await res.json();
      const agents = Array.isArray(json) ? json : json?.data || json?.agents || [];
      if (agents.length) return agents;
    } catch {
      /* try next */
    }
  }
  return [];
}

const Receipt: React.FC<ReceiptProps> = ({ orderData, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<'png' | 'share' | null>(null);
  const [actionHint, setActionHint] = useState<string | null>(null);
  const [fitScale, setFitScale] = useState(1);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [pickup, setPickup] = useState<PickupDetails>({
    name: '…',
    contact: '—',
    location: '…',
  });

  const data = unwrapOrder(orderData);
  const booking = orderData?.bookingData || orderData;

  const trackingNo = String(
    orderData?.trackingNo ||
      data.trackingNo ||
      data.trackingNumber ||
      booking?.trackingNo ||
      'PENDING',
  );

  const customerName =
    booking?.customerName || data.customerName || data.customer_name || 'N/A';
  const customerPhone = formatPhone(
    booking?.customerPhone || data.customerPhone || data.customer_phone || 'N/A',
  );
  const customerAddress =
    booking?.customerCounty ||
    booking?.customerAddress ||
    data.customerAddress ||
    data.customerCounty ||
    data.destinationTown ||
    'N/A';

  const senderName =
    booking?.vendorName ||
    data.vendorName ||
    data.senderName ||
    data.vendor?.fullName ||
    data.vendor?.name ||
    'N/A';
  const senderBusiness =
    booking?.vendorBusiness ||
    booking?.businessName ||
    data.vendorBusiness ||
    data.vendor?.businessName ||
    data.vendor?.shopName ||
    'N/A';
  const senderPhone = formatPhone(
    booking?.vendorPhone ||
      data.vendorPhone ||
      data.senderPhone ||
      data.vendor?.phone ||
      'N/A',
  );

  const isFragile = Boolean(booking?.isFragile ?? data.isFragile ?? data.fragile);
  const isSpillProne = Boolean(
    booking?.isSpillProne ?? data.isSpillProne ?? data.spillProne,
  );
  const condition =
    [isFragile && 'Fragile', isSpillProne && 'Spill Prone'].filter(Boolean).join(', ') ||
    'Standard';

  const quantity = Number(booking?.quantity ?? data.quantity ?? 1) || 1;
  const declaredValue =
    booking?.packageValue ??
    booking?.parcelValue ??
    data.parcelValue ??
    data.declaredValue ??
    null;
  const rawWeight =
    booking?.weightRange || data.weightRange || data.weight_range || '';
  const weightDisplay = rawWeight
    ? /kg/i.test(String(rawWeight))
      ? String(rawWeight)
      : `${rawWeight} KG`
    : 'N/A';
  const paymentStatus =
    orderData?.paymentStatus || data.paymentStatus || 'Pre-paid';
  const amountToCollect = formatKes(
    booking?.codAmount ?? data.codAmount ?? data.cod_amount ?? 0,
  );
  const deliveryFeeValue =
    orderData?.deliveryFee ??
    booking?.deliveryFee ??
    data.shippingCharges ??
    data.deliveryFee ??
    0;
  const paymentReference =
    orderData?.paymentReference ||
    orderData?.courierPaymentReference ||
    data.courierPaymentReference ||
    data.paymentReference ||
    'N/A';
  const branchCode = resolveBranchCode([orderData, booking, data]) || 'N/A';

  const pickupPointId =
    booking?.pickupPointId ||
    booking?.pickupPoint ||
    booking?.agentId ||
    data.agentId ||
    data.pickupPointId ||
    data.pickupPoint ||
    orderData?.pickupPoint;

  useEffect(() => {
    const knownName =
      booking?.pickupPointName ||
      orderData?.pickupPointName ||
      data.pickupPointName ||
      data.agent?.businessName ||
      data.agent?.shopName;
    const knownContact =
      data.agent?.shopAttendantMobileNumber ||
      data.agent?.phone ||
      data.agent?.agentNumber;
    const knownLocation =
      booking?.pickupPointAddress ||
      orderData?.pickupPointAddress ||
      data.agent?.fullDetailedAddress ||
      data.agent?.address;

    if (knownName) {
      setPickup({
        name: String(knownName),
        contact: formatPhone(knownContact || '—'),
        location: knownLocation || String(knownName),
      });
    }

    if (!pickupPointId) {
      if (!knownName) setPickup({ name: 'N/A', contact: 'N/A', location: 'N/A' });
      return;
    }

    let cancelled = false;
    (async () => {
      const agents = await fetchPickupAgents();
      if (cancelled) return;
      const matched = agents.find(
        (a) =>
          String(a.id) === String(pickupPointId) ||
          String(a._id) === String(pickupPointId) ||
          String(a.agentId) === String(pickupPointId),
      );
      if (!matched) {
        if (!knownName) setPickup({ name: 'N/A', contact: 'N/A', location: 'N/A' });
        return;
      }
      setPickup({
        name: String(
          matched.businessName || matched.name || matched.shopName || knownName || 'N/A',
        ),
        contact: formatPhone(
          matched.shopAttendantMobileNumber ||
            matched.phone ||
            matched.phoneNumber ||
            matched.agentNumber ||
            knownContact ||
            'N/A',
        ),
        location:
          matched.fullDetailedAddress ||
          matched.address ||
          matched.location ||
          `${matched.town || ''}${matched.county ? `, ${matched.county}` : ''}`.trim() ||
          knownLocation ||
          'N/A',
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [pickupPointId, booking, data, orderData]);

  const stamp = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

  useLayoutEffect(() => {
    const fit = () => {
      const vp = viewportRef.current;
      const rec = receiptRef.current;
      if (!vp || !rec) return;
      const prev = rec.style.transform;
      rec.style.transform = 'scale(1)';
      const w = rec.offsetWidth;
      const h = rec.offsetHeight;
      rec.style.transform = prev;
      if (!w || !h) return;
      const pad = 12;
      const s = Math.min(1, (vp.clientWidth - pad) / w, (vp.clientHeight - pad) / h);
      setNaturalSize({ w, h });
      setFitScale(Number.isFinite(s) && s > 0 ? s : 1);
    };
    fit();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    if (viewportRef.current) ro?.observe(viewportRef.current);
    if (receiptRef.current) ro?.observe(receiptRef.current);
    window.addEventListener('resize', fit);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [pickup, trackingNo, paymentReference, deliveryFeeValue]);

  const renderCanvas = async () => {
    if (!receiptRef.current) throw new Error('Receipt not ready');
    const el = receiptRef.current;
    const prevTransform = el.style.transform;
    el.style.transform = 'scale(1)';
    try {
      return await html2canvas(el, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: R.white,
        scale: Math.min(3, window.devicePixelRatio || 2),
        onclone: (_doc: Document, cloned: HTMLElement) => {
          cloned.style.transform = 'scale(1)';
        },
      } as any);
    } finally {
      el.style.transform = prevTransform;
    }
  };

  const handleDownloadPng = async () => {
    setBusy('png');
    setActionHint(null);
    try {
      const canvas = await renderCanvas();
      const blob = await canvasToPngBlob(canvas);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${trackingNo || 'order'}.png`;
      link.click();
      URL.revokeObjectURL(url);
      setActionHint('Receipt image downloaded');
    } catch (err) {
      console.error(err);
      setActionHint('Could not download. Try again.');
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    setBusy('share');
    setActionHint(null);
    try {
      const canvas = await renderCanvas();
      const blob = await canvasToPngBlob(canvas);
      const file = new File([blob], `receipt-${trackingNo || 'order'}.png`, {
        type: 'image/png',
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `ParcelGrid receipt ${trackingNo}`,
          text: `Track ${trackingNo} on https://escrowcourier.com/track`,
        });
        setActionHint('Shared');
        return;
      }
      if (navigator.share) {
        await navigator.share({
          title: `ParcelGrid receipt ${trackingNo}`,
          text: `ParcelGrid tracking ${trackingNo} — https://escrowcourier.com/track`,
        });
        setActionHint('Shared');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${trackingNo || 'order'}.png`;
      link.click();
      URL.revokeObjectURL(url);
      setActionHint('Image saved (share not supported here)');
    } catch (err: any) {
      if (err?.name === 'AbortError') setActionHint(null);
      else {
        console.error(err);
        setActionHint('Could not share. Try Download receipt image.');
      }
    } finally {
      setBusy(null);
    }
  };

  const rowLabel: React.CSSProperties = {
    fontFamily: receiptFont,
    fontSize: 14,
    fontWeight: 900,
    color: R.label,
    textTransform: 'uppercase',
    textAlign: 'left',
  };
  const rowValue: React.CSSProperties = {
    fontFamily: receiptFont,
    fontSize: 14,
    fontWeight: 900,
    color: R.ink,
    textAlign: 'right',
    maxWidth: '65%',
    wordBreak: 'break-word',
  };
  const sectionTitle: React.CSSProperties = {
    fontFamily: receiptFont,
    fontSize: 16,
    fontWeight: 900,
    color: R.ink,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    margin: '0 0 4px',
    paddingBottom: 4,
    borderBottom: `1px solid ${R.line}`,
  };

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
        padding: '2px 0',
      }}
    >
      <span style={rowLabel}>{label}</span>
      <span style={rowValue}>{value}</span>
    </div>
  );

  const scaledW = naturalSize.w ? naturalSize.w * fitScale : undefined;
  const scaledH = naturalSize.h ? naturalSize.h * fitScale : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Order receipt"
    >
      {/* Modal chrome — ParcelGrid design system */}
      <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
        <div className="shrink-0 border-b border-black/[0.08] px-5 py-4 sm:px-6">
          <h2 className="font-[Sora] text-xl font-semibold tracking-[-0.02em] text-[#111]">
            Order Receipt
          </h2>
          <p className="mt-1 text-sm text-[#5c6562]">Review order details below</p>
        </div>

        <div
          ref={viewportRef}
          className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#f7f8f6] p-3 sm:p-4"
        >
          <div
            style={{
              width: scaledW,
              height: scaledH,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {/* Official receipt paper — matches admin DispatchReceipt */}
            <div
              ref={receiptRef}
              data-receipt-content
              style={{
                width: 520,
                backgroundColor: R.white,
                color: R.ink,
                fontFamily: receiptFont,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                transform: `scale(${fitScale})`,
                transformOrigin: 'top left',
              }}
            >
              {/* Header: QR + brand */}
              <div
                style={{
                  padding: 8,
                  borderBottom: `1px solid ${R.line}`,
                  backgroundColor: R.white,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                  <div style={{ marginRight: 16, flexShrink: 0 }}>
                    <div
                      style={{
                        width: 112,
                        height: 112,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 8,
                        backgroundColor: R.white,
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      }}
                    >
                      <QRCodeCanvas
                        value={trackingNo}
                        size={96}
                        level="M"
                        includeMargin={false}
                        bgColor={R.white}
                        fgColor="#000000"
                      />
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                        gap: 0,
                      }}
                    >
                      <img
                        src="/logo2.png"
                        alt="Parcelgrid Logo"
                        crossOrigin="anonymous"
                        style={{
                          width: 96,
                          height: 48,
                          objectFit: 'contain',
                          display: 'block',
                          marginRight: -16,
                        }}
                      />
                      <h1
                        style={{
                          margin: 0,
                          fontFamily: receiptFont,
                          fontSize: '1.75rem',
                          lineHeight: 1,
                          letterSpacing: '0.8px',
                          fontWeight: 900,
                          whiteSpace: 'nowrap',
                          color: R.ink,
                        }}
                      >
                        PARCELGRID
                      </h1>
                    </div>

                    {!trackingNo.startsWith('ECN') && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 900,
                          color: R.label,
                          fontFamily: receiptFont,
                        }}
                      >
                        <span style={{ textTransform: 'uppercase', marginRight: 8 }}>
                          Parcel Fee:
                        </span>
                        <span style={{ fontSize: 17, color: R.ink }}>
                          KES {formatKes(deliveryFeeValue)}
                        </span>
                      </p>
                    )}
                    <p
                      style={{
                        margin: '4px 0 0',
                        display: 'inline-block',
                        fontSize: 12,
                        fontWeight: 900,
                        color: R.label,
                        backgroundColor: R.soft,
                        border: `1px solid ${R.line}`,
                        borderRadius: 4,
                        padding: '4px 12px',
                        lineHeight: 1.25,
                        fontFamily: receiptFont,
                      }}
                    >
                      TEL: 0745 111 555 | {stamp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div
                style={{
                  padding: 8,
                  borderBottom: `1px solid ${R.line}`,
                  backgroundColor: R.white,
                  textAlign: 'left',
                }}
              >
                <h3
                  style={{
                    ...sectionTitle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 4,
                    overflow: 'hidden',
                  }}
                >
                  <span>Customer Details</span>
                  <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: R.label }}>
                      Tracking No. :{' '}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: R.ink }}>
                      {trackingNo}
                    </span>
                  </span>
                </h3>
                <Row label="Name" value={customerName} />
                <Row label="Phone" value={customerPhone} />
                <Row label="Address" value={customerAddress} />
              </div>

              {/* Sender */}
              <div
                style={{
                  padding: 8,
                  borderBottom: `1px solid ${R.line}`,
                  backgroundColor: R.white,
                  textAlign: 'left',
                }}
              >
                <h3 style={sectionTitle}>Sender Details</h3>
                <Row label="Name" value={senderName} />
                <Row label="Business" value={senderBusiness} />
                <Row label="Phone" value={senderPhone} />
              </div>

              {/* Pickup */}
              <div
                style={{
                  padding: 8,
                  borderBottom: `1px solid ${R.line}`,
                  backgroundColor: R.white,
                  textAlign: 'left',
                }}
              >
                <h3 style={sectionTitle}>Pickup Point</h3>
                <Row label="Business" value={pickup.name} />
                <Row label="Contact" value={pickup.contact} />
                <Row label="Location" value={pickup.location} />
              </div>

              {/* Parcel summary */}
              <div
                style={{
                  padding: 8,
                  borderBottom: `1px solid ${R.line}`,
                  backgroundColor: R.white,
                  textAlign: 'left',
                }}
              >
                <h3 style={sectionTitle}>Parcel Summary</h3>
                <Row label="Condition" value={condition} />
                <Row label="Package Quantity" value={quantity} />
                <Row
                  label="Declared Value"
                  value={
                    declaredValue != null && declaredValue !== ''
                      ? `KES ${formatKes(declaredValue)}`
                      : 'N/A'
                  }
                />
                <Row label="Payment Ref" value={paymentReference} />
                <Row label="Weight" value={weightDisplay} />
                <Row label="Payment" value={paymentStatus} />
                <div
                  style={{
                    borderTop: `1px solid ${R.line}`,
                    marginTop: 4,
                    paddingTop: 4,
                  }}
                >
                  <Row label="Amount to Collect" value={`KES ${amountToCollect}`} />
                </div>
              </div>

              <div style={{ width: '100%', textAlign: 'left', padding: '4px 8px 0' }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#374151',
                    fontFamily: receiptFont,
                  }}
                >
                  Branch Code: {branchCode}
                </span>
              </div>

              <div style={{ padding: 8, backgroundColor: R.white }}>
                <div
                  style={{
                    backgroundColor: R.warnBg,
                    border: `2px solid ${R.warnBorder}`,
                    borderRadius: 4,
                    padding: 8,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      paddingTop: 8,
                      fontSize: 16,
                      fontWeight: 900,
                      color: R.warnTitle,
                      fontFamily: receiptFont,
                    }}
                  >
                    Do NOT Pay Cash to the Pickup Agent
                  </div>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: 14,
                      fontWeight: 900,
                      color: R.warnBody,
                      fontFamily: receiptFont,
                    }}
                  >
                    Use Official Payment Channels Only
                  </p>
                </div>
              </div>

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 8,
                  paddingRight: 8,
                }}
              >
                <div
                  style={{
                    borderRadius: 16,
                    border: `2px solid ${R.lineStrong}`,
                    backgroundColor: R.white,
                    padding: '8px 12px',
                    maxWidth: '100%',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 900,
                      color: '#374151',
                      textAlign: 'center',
                      fontFamily: receiptFont,
                      lineHeight: 1.35,
                    }}
                  >
                    Please take a moment to inspect your parcel at the pickup station before you
                    leave. ParcelGrid will not be liable for any damage, breakage, spillage, or
                    missing contents reported after the parcel has left the station.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions — design system */}
        <div className="shrink-0 space-y-3 border-t border-black/[0.08] bg-white px-5 py-4 sm:px-6">
          {actionHint && (
            <p className="text-center text-xs font-semibold text-[#00473E]">{actionHint}</p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={busy !== null}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#00473E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#003830] disabled:opacity-60"
            >
              <Download className="size-4" aria-hidden />
              {busy === 'png' ? 'Downloading…' : 'Download receipt image'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={busy !== null}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#00473E]/5 disabled:opacity-60"
            >
              <Share2 className="size-4" aria-hidden />
              {busy === 'share' ? 'Sharing…' : 'Share'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-[#f7f8f6] px-5 text-sm font-semibold text-[#222] transition-colors hover:bg-[#eee]"
            >
              <X className="size-4" aria-hidden />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
