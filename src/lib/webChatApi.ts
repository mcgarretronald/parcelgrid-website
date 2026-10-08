/** Client for the public website chat endpoints on customer-support-service. */

export type WebChatImage = { url: string; alt?: string };

export type WebChatSessionResponse = {
  success: boolean;
  session_token: string;
  expires_at?: string;
  greeting: string;
  max_message_chars: number;
  error?: string;
  message?: string;
};

export type WebChatMessageResponse = {
  success: boolean;
  reply?: string;
  images?: WebChatImage[];
  escalated?: boolean;
  session_token?: string;
  expires_at?: string;
  error?: string;
  message?: string;
  retry_after_seconds?: number;
};

const SESSION_KEY = 'pg_web_chat_session';

const API_SESSION = import.meta.env.DEV ? '/web-chat-api/session' : '/api/web-chat/session';
const API_MESSAGE = import.meta.env.DEV ? '/web-chat-api/message' : '/api/web-chat/message';

export function getStoredSessionToken(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function storeSessionToken(token: string | null) {
  try {
    if (!token) sessionStorage.removeItem(SESSION_KEY);
    else sessionStorage.setItem(SESSION_KEY, token);
  } catch {
    /* private mode */
  }
}

async function readJson(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, error: 'BAD_RESPONSE', message: text || res.statusText };
  }
}

export async function startWebChatSession(): Promise<WebChatSessionResponse> {
  const res = await fetch(API_SESSION, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: '{}',
  });
  const data = (await readJson(res)) as WebChatSessionResponse;
  if (res.ok && data.session_token) storeSessionToken(data.session_token);
  return { ...data, success: Boolean(data.success && res.ok) };
}

export async function sendWebChatMessage(message: string): Promise<WebChatMessageResponse> {
  let token = getStoredSessionToken();
  if (!token) {
    const session = await startWebChatSession();
    if (!session.success || !session.session_token) {
      return {
        success: false,
        error: session.error || 'SESSION_FAILED',
        message: session.message || 'Could not start chat. Call or WhatsApp 0745 111 555.',
      };
    }
    token = session.session_token;
  }

  const res = await fetch(API_MESSAGE, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Chat-Session': token,
    },
    body: JSON.stringify({ message }),
  });
  const data = (await readJson(res)) as WebChatMessageResponse;

  if (data.session_token) storeSessionToken(data.session_token);

  if (res.status === 401) {
    storeSessionToken(null);
  }

  return {
    ...data,
    success: Boolean(data.success && res.ok),
    message:
      data.message ||
      (!res.ok ? `Something went wrong. Call or WhatsApp 0745 111 555.` : undefined),
  };
}

/** Hosts we may open from bot reply text. Relative paths stay on this site. */
const SAFE_LINK_HOSTS = new Set([
  'escrowcourier.com',
  'www.escrowcourier.com',
  'app.escrowcourier.com',
]);

export function isSafeChatHref(href: string): boolean {
  const raw = String(href || '').trim();
  if (!raw) return false;
  if (raw.startsWith('/') && !raw.startsWith('//')) return true;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return false;
    const host = u.hostname.toLowerCase();
    return SAFE_LINK_HOSTS.has(host) || host.endsWith('.escrowcourier.com');
  } catch {
    return false;
  }
}

const URL_IN_TEXT = /(https?:\/\/[^\s<>"']+|\/(?:track|pickup-points|book-parcel|contact|faq)[^\s<>"']*)/gi;

export type ReplyPart = { type: 'text'; value: string } | { type: 'link'; href: string; label: string };

/** Split a reply into text + safe links only (unsafe URLs stay plain text). */
export function parseReplyParts(reply: string): ReplyPart[] {
  const text = String(reply || '');
  const parts: ReplyPart[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(URL_IN_TEXT.source, 'gi');
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: 'text', value: text.slice(last, match.index) });
    }
    const href = match[0].replace(/[.,;:!?)\]}>]+$/, '');
    if (isSafeChatHref(href)) {
      parts.push({ type: 'link', href, label: href });
    } else {
      parts.push({ type: 'text', value: href });
    }
    last = match.index + href.length;
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts.length ? parts : [{ type: 'text', value: text }];
}
