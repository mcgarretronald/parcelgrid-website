/**
 * Courier-fee payment helpers — STK prompt + status (Paybill / prompt confirmation).
 * Browser never fetches website-backend tokens; all payment calls go through /api proxies.
 */

export const MPESA_PAYBILL = '4157233';
export const MPESA_PAYBILL_NAME = 'PARCELGRID- ESCROW COURIER';

const PROMPT_FN = '/api/payments/courier-fee';
const STATUS_FN = '/api/payments/status';

export type PaymentStatusData = {
  status?: string;
  isPaid?: boolean;
  transactionCode?: string | null;
  resultCode?: number | string | null;
  trackingNo?: string;
  resultDesc?: string | null;
  merchantRequestId?: string;
  checkoutRequestId?: string;
  phoneNumber?: string;
  amount?: number;
  message?: string;
};

export type PromptResult = {
  merchantRequestId?: string;
  checkoutRequestId?: string;
  raw: unknown;
};

async function postJson(
  url: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

/** Send M-Pesa STK push for courier fee. Account reference = trackingNo. */
export async function sendCourierFeePrompt(payload: {
  phoneNumber: string;
  amount: number;
  trackingNo: string;
}): Promise<PromptResult> {
  const body = {
    phoneNumber: payload.phoneNumber,
    amount: payload.amount,
    trackingNo: payload.trackingNo,
    paymentDesc: 'courierFee',
  };

  const viaFn = await postJson(PROMPT_FN, body);
  if (viaFn.ok) return extractPromptIds(viaFn.data);
  throw new Error(
    viaFn.data?.error?.message ||
      viaFn.data?.message ||
      `Prompt failed (${viaFn.status})`,
  );
}

function extractPromptIds(data: any): PromptResult {
  const nested = data?.data ?? data;
  return {
    merchantRequestId:
      nested?.merchantRequestId ||
      nested?.MerchantRequestID ||
      nested?.merchant_request_id ||
      data?.merchantRequestId ||
      data?.MerchantRequestID,
    checkoutRequestId:
      nested?.checkoutRequestId ||
      nested?.CheckoutRequestID ||
      nested?.checkout_request_id ||
      data?.checkoutRequestId ||
      data?.CheckoutRequestID,
    raw: data,
  };
}

/** Confirm payment — STK by merchantRequestId, or Paybill by trackingNo. */
export async function checkPaymentStatus(params: {
  merchantRequestId?: string;
  checkoutRequestId?: string;
  trackingNo?: string;
}): Promise<PaymentStatusData> {
  const body: Record<string, string> = {};
  if (params.merchantRequestId) body.merchantRequestId = params.merchantRequestId;
  if (params.checkoutRequestId) body.checkoutRequestId = params.checkoutRequestId;
  if (params.trackingNo) body.trackingNo = params.trackingNo;

  const viaFn = await postJson(STATUS_FN, body);
  if (viaFn.ok) return normalizeStatus(viaFn.data);
  if (viaFn.status === 404 || viaFn.data?.error === 'PAYMENT_NOT_FOUND') {
    return {
      status: 'NOT_FOUND',
      isPaid: false,
      message: viaFn.data?.message || viaFn.data?.error?.message || 'Payment not found yet',
    };
  }
  throw new Error(
    viaFn.data?.error?.message ||
      viaFn.data?.message ||
      `Status check failed (${viaFn.status})`,
  );
}

function normalizeStatus(data: any): PaymentStatusData {
  const nested = data?.data ?? data;
  const status = String(nested?.status || data?.status || '').toUpperCase();
  const isPaid =
    nested?.isPaid === true ||
    status === 'SUCCESS' ||
    nested?.ResultCode === '0' ||
    nested?.resultCode === 0 ||
    nested?.resultCode === '0';
  return {
    status: status || (isPaid ? 'SUCCESS' : 'PENDING'),
    isPaid,
    transactionCode: nested?.transactionCode ?? nested?.paymentReference ?? null,
    resultCode: nested?.resultCode ?? nested?.ResultCode ?? null,
    trackingNo: nested?.trackingNo,
    resultDesc: nested?.resultDesc ?? nested?.ResultDesc ?? null,
    merchantRequestId: nested?.merchantRequestId,
    checkoutRequestId: nested?.checkoutRequestId,
    phoneNumber: nested?.phoneNumber,
    amount: nested?.amount != null ? Number(nested.amount) : undefined,
    message: data?.message || nested?.message,
  };
}

export function isTerminalFailure(status?: string): boolean {
  const s = String(status || '').toUpperCase();
  return ['FAILED', 'CANCELLED', 'TIMEOUT', 'INSUFFICIENT_FUNDS'].includes(s);
}

export function extractTrackingFromOrder(orderData: any, fallback?: string): string {
  return (
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
    fallback ||
    ''
  );
}
