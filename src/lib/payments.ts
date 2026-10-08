/**
 * Courier-fee payment helpers — STK prompt + status (Paybill / prompt confirmation).
 */

export const MPESA_PAYBILL = '4157233';
export const MPESA_PAYBILL_NAME = 'PARCELGRID- ESCROW COURIER';

const AUTH_TOKEN_URL =
  'https://app.escrowcourier.com/website-backend-services/api/auth/token';
const PROMPT_DIRECT =
  'https://app.escrowcourier.com/payment-services/api/payments/prompts/courier-fee';
const STATUS_DIRECT =
  'https://app.escrowcourier.com/payment-services/api/payments/status';
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

async function postJson(
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
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

  try {
    const viaFn = await postJson(PROMPT_FN, body);
    if (viaFn.ok || (viaFn.data && !String(viaFn.data?.raw || '').includes('<!DOCTYPE'))) {
      if (viaFn.ok) return extractPromptIds(viaFn.data);
      if (viaFn.status !== 404) {
        throw new Error(
          viaFn.data?.error?.message || viaFn.data?.message || `Prompt failed (${viaFn.status})`,
        );
      }
    }
  } catch (err: any) {
    if (err?.message && !/failed to fetch|network/i.test(err.message)) throw err;
  }

  const token = await fetchWebsiteToken();
  const direct = await postJson(PROMPT_DIRECT, body, token ? { Authorization: `Bearer ${token}` } : {});
  if (!direct.ok) {
    throw new Error(
      direct.data?.error?.message || direct.data?.message || `Prompt failed (${direct.status})`,
    );
  }
  return extractPromptIds(direct.data);
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

  try {
    const viaFn = await postJson(STATUS_FN, body);
    if (viaFn.ok) return normalizeStatus(viaFn.data);
    if (viaFn.status === 404 && viaFn.data?.error?.code === 'PAYMENT_NOT_FOUND') {
      return { status: 'NOT_FOUND', isPaid: false, message: viaFn.data?.error?.message };
    }
    if (viaFn.status !== 404 && !String(viaFn.data?.raw || '').includes('<!DOCTYPE')) {
      throw new Error(
        viaFn.data?.error?.message || viaFn.data?.message || `Status check failed (${viaFn.status})`,
      );
    }
  } catch (err: any) {
    if (err?.message && !/failed to fetch|network/i.test(err.message)) throw err;
  }

  const token = await fetchWebsiteToken();
  const direct = await postJson(STATUS_DIRECT, body, token ? { Authorization: `Bearer ${token}` } : {});
  if (direct.status === 404) {
    return {
      status: 'NOT_FOUND',
      isPaid: false,
      message: direct.data?.error?.message || 'Payment not found yet',
    };
  }
  if (!direct.ok) {
    throw new Error(
      direct.data?.error?.message || direct.data?.message || `Status check failed (${direct.status})`,
    );
  }
  return normalizeStatus(direct.data);
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
