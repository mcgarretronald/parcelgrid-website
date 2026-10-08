import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Phone, Loader2, Headset } from 'lucide-react';
import {
  isSafeChatHref,
  parseReplyParts,
  sendWebChatMessage,
  startWebChatSession,
  type WebChatImage,
} from '../../lib/webChatApi';

type Role = 'bot' | 'user' | 'system';

type ChatMessage = {
  id: string;
  role: Role;
  text: string;
  images?: WebChatImage[];
};

const SUGGESTIONS = [
  { label: 'Prices', message: 'How much does delivery cost?' },
  { label: 'Drop-off', message: 'Where can I drop off a parcel in Nairobi?' },
  { label: 'Pay on Delivery', message: 'How does Pay on Delivery work?' },
  { label: 'Track', href: '/track' },
] as const;

const WHATSAPP = 'https://wa.me/254745111555';
const CALL_PRIMARY = 'tel:+254745111555';
const CALL_SECONDARY = 'tel:+254794333888';

const PHONE_RE = /(\+?254\s?[17]\d{8}|0[17]\d{8}|0[17]\d{2}\s?\d{3}\s?\d{3})/g;

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Break long AI walls of text into short, readable paragraphs. */
function toParagraphs(text: string): string[] {
  const cleaned = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return [];

  // Prefer natural breaks the model already left
  if (/\n/.test(text)) {
    return text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  // Split after sentence enders when the chunk is getting long
  const chunks: string[] = [];
  let buf = '';
  const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
  for (const s of sentences) {
    const next = (buf + s).trim();
    if (buf && next.length > 140) {
      chunks.push(buf.trim());
      buf = s.trim();
    } else {
      buf = next;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks;
}

function phoneToTel(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('254')) return `tel:+${digits}`;
  if (digits.startsWith('0')) return `tel:+254${digits.slice(1)}`;
  return `tel:+${digits}`;
}

type InlinePart =
  | { type: 'text'; value: string }
  | { type: 'link'; href: string; label: string }
  | { type: 'phone'; href: string; label: string };

function inlineParts(paragraph: string): InlinePart[] {
  const withUrls = parseReplyParts(paragraph);
  const out: InlinePart[] = [];

  for (const part of withUrls) {
    if (part.type === 'link') {
      out.push(part);
      continue;
    }
    const value = part.value;
    let last = 0;
    let m: RegExpExecArray | null;
    const re = new RegExp(PHONE_RE.source, 'g');
    while ((m = re.exec(value)) !== null) {
      if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
      out.push({ type: 'phone', href: phoneToTel(m[0]), label: m[0] });
      last = m.index + m[0].length;
    }
    if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  }
  return out.length ? out : [{ type: 'text', value: paragraph }];
}

function ReplyBody({ text }: { text: string }) {
  const paragraphs = useMemo(() => toParagraphs(text), [text]);

  return (
    <div className="space-y-2.5">
      {paragraphs.map((p, pi) => (
        <p key={pi} className="text-[13.5px] leading-[1.55] text-[#2a312f]">
          {inlineParts(p).map((part, i) => {
            if (part.type === 'phone') {
              return (
                <a
                  key={i}
                  href={part.href}
                  className="font-semibold text-[#00473E] underline decoration-[#00473E]/25 underline-offset-2"
                >
                  {part.label}
                </a>
              );
            }
            if (part.type === 'link') {
              if (part.href.startsWith('/') && isSafeChatHref(part.href)) {
                return (
                  <Link
                    key={i}
                    to={part.href}
                    className="font-semibold text-[#00473E] underline decoration-[#00473E]/25 underline-offset-2"
                  >
                    {part.label}
                  </Link>
                );
              }
              return (
                <a
                  key={i}
                  href={part.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#00473E] underline decoration-[#00473E]/25 underline-offset-2"
                >
                  {part.label}
                </a>
              );
            }
            return <span key={i}>{part.value}</span>;
          })}
        </p>
      ))}
    </div>
  );
}

function TalkToUsPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-2xl bg-[#f3f5f3] ${compact ? 'px-3 py-2.5' : 'space-y-2.5 px-3.5 py-3'}`}
    >
      {!compact && (
        <p className="text-sm text-[#3d4542]">Need a person? WhatsApp, call, or write to us.</p>
      )}
      <div className="flex flex-wrap gap-2">
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#00473E] px-3 text-xs font-semibold text-white"
        >
          <MessageCircle className="size-3.5" aria-hidden />
          WhatsApp
        </a>
        <a
          href={CALL_PRIMARY}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-[#00473E] ring-1 ring-black/8"
        >
          <Phone className="size-3.5" aria-hidden />
          0745 111 555
        </a>
        <a
          href={CALL_SECONDARY}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-[#00473E] ring-1 ring-black/8"
        >
          <Phone className="size-3.5" aria-hidden />
          0794 333 888
        </a>
        <Link
          to="/contact"
          className="inline-flex h-9 items-center rounded-full bg-[#E9FF15] px-3 text-xs font-semibold text-[#111]"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [showHuman, setShowHuman] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [booting, setBooting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [maxChars, setMaxChars] = useState(500);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasUserMessage = messages.some((m) => m.role === 'user');
  const showStarterChips = open && !showHuman && !hasUserMessage && !busy;

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open, showHuman, busy]);

  useEffect(() => {
    if (!open || messages.length > 0 || booting) return;
    let cancelled = false;
    const boot = async () => {
      setBooting(true);
      try {
        const session = await startWebChatSession();
        if (cancelled) return;
        if (session.success && session.greeting) {
          setMaxChars(session.max_message_chars || 500);
          setMessages([{ id: uid(), role: 'bot', text: session.greeting }]);
        } else {
          setMessages([
            {
              id: uid(),
              role: 'system',
              text:
                session.message ||
                'Chat is unavailable right now. Call or WhatsApp 0745 111 555.',
            },
          ]);
          setShowHuman(true);
        }
      } catch {
        if (!cancelled) {
          setMessages([
            {
              id: uid(),
              role: 'system',
              text: 'Could not connect. Call or WhatsApp 0745 111 555.',
            },
          ]);
          setShowHuman(true);
        }
      } finally {
        if (!cancelled) setBooting(false);
      }
    };
    boot();
    return () => {
      cancelled = true;
    };
  }, [open, messages.length, booting]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [open]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setInput('');
    setShowHuman(false);
    setMessages((prev) => [...prev, { id: uid(), role: 'user', text }]);
    setBusy(true);
    try {
      const res = await sendWebChatMessage(text.slice(0, maxChars));
      if (res.success && res.reply) {
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: 'bot', text: res.reply || '', images: res.images },
        ]);
        if (res.escalated) setShowHuman(true);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: 'system',
            text: res.message || 'Something went wrong. Call or WhatsApp 0745 111 555.',
          },
        ]);
        setShowHuman(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'system',
          text: 'Network error. Call or WhatsApp 0745 111 555.',
        },
      ]);
      setShowHuman(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
      {open && (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="pointer-events-auto flex h-[min(32rem,calc(100dvh-5.5rem))] w-[min(22.5rem,calc(100vw-1.25rem))] flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_48px_rgba(7,20,16,0.2)] ring-1 ring-black/8"
        >
          <header className="flex items-center justify-between gap-3 border-b border-black/[0.05] bg-[#071410] px-4 py-3 text-white">
            <div className="min-w-0">
              <p id={titleId} className="font-[Sora] text-[15px] font-semibold tracking-[-0.02em]">
                Ask ParcelGrid
              </p>
              <p className="truncate text-[11px] text-white/55">Coverage · prices · drop-off</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#fafbfa] px-3.5 py-3.5">
            {booting && messages.length === 0 && (
              <div className="flex items-center gap-2 px-1 text-sm text-[#6b7471]">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                Connecting…
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 ${
                    m.role === 'user'
                      ? 'rounded-[1.25rem] rounded-br-md bg-[#00473E] text-white'
                      : m.role === 'system'
                        ? 'rounded-2xl bg-[#fff8e8] text-[#5c4a1a] ring-1 ring-amber-200/80'
                        : 'rounded-[1.25rem] rounded-bl-md bg-white text-[#222] shadow-sm ring-1 ring-black/[0.05]'
                  }`}
                >
                  {m.role === 'user' ? (
                    <p className="text-[13.5px] leading-[1.45]">{m.text}</p>
                  ) : (
                    <ReplyBody text={m.text} />
                  )}
                  {m.images && m.images.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {m.images.map((img) => (
                        <img
                          key={img.url}
                          src={img.url}
                          alt={img.alt || 'ParcelGrid reference'}
                          className="max-h-36 w-full rounded-xl object-cover"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex items-center gap-2 px-1 text-[13px] text-[#6b7471]">
                <span className="inline-flex gap-1">
                  <span className="size-1.5 animate-pulse rounded-full bg-[#00473E]/50" />
                  <span className="size-1.5 animate-pulse rounded-full bg-[#00473E]/50 [animation-delay:120ms]" />
                  <span className="size-1.5 animate-pulse rounded-full bg-[#00473E]/50 [animation-delay:240ms]" />
                </span>
                Looking that up…
              </div>
            )}

            {showHuman && <TalkToUsPanel />}
          </div>

          {showStarterChips && (
            <div className="flex gap-1.5 overflow-x-auto border-t border-black/[0.04] bg-white px-3 py-2.5 scrollbar-none">
              {SUGGESTIONS.map((chip) =>
                'href' in chip && chip.href ? (
                  <Link
                    key={chip.label}
                    to={chip.href}
                    className="shrink-0 rounded-full bg-[#f3f5f3] px-3 py-1.5 text-xs font-medium text-[#00473E]"
                  >
                    {chip.label}
                  </Link>
                ) : (
                  <button
                    key={chip.label}
                    type="button"
                    disabled={busy}
                    onClick={() => 'message' in chip && chip.message && send(chip.message)}
                    className="shrink-0 rounded-full bg-[#f3f5f3] px-3 py-1.5 text-xs font-medium text-[#00473E] disabled:opacity-50"
                  >
                    {chip.label}
                  </button>
                ),
              )}
            </div>
          )}

          <div className="border-t border-black/[0.05] bg-white px-3 pb-3 pt-2">
            {!showHuman && (
              <div className="mb-2 flex items-center justify-between gap-2 px-0.5">
                <button
                  type="button"
                  onClick={() => setShowHuman(true)}
                  className="text-[11px] font-semibold text-[#5c6562] underline-offset-2 hover:text-[#00473E] hover:underline"
                >
                  Talk to a person
                </button>
                {hasUserMessage && (
                  <button
                    type="button"
                    onClick={() => {
                      setMessages((prev) => prev.filter((m) => m.role === 'bot').slice(0, 1));
                      setShowHuman(false);
                    }}
                    className="text-[11px] font-medium text-[#9aa3a0] hover:text-[#00473E]"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {showHuman && (
              <button
                type="button"
                onClick={() => setShowHuman(false)}
                className="mb-2 text-[11px] font-semibold text-[#00473E] underline-offset-2 hover:underline"
              >
                Back to chat
              </button>
            )}

            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                maxLength={maxChars}
                disabled={busy}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a town or price…"
                className="h-11 flex-1 rounded-full bg-[#f3f5f3] px-4 text-sm text-[#111] outline-none ring-1 ring-transparent placeholder:text-[#9aa3a0] focus:bg-white focus:ring-[#00473E]/25 disabled:opacity-60"
                aria-label="Chat message"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#00473E] text-white transition enabled:hover:bg-[#003830] disabled:bg-[#c5ccc9]"
                aria-label="Send message"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto inline-flex size-14 items-center justify-center rounded-full bg-[#00473E] text-white shadow-[0_10px_28px_rgba(0,71,62,0.32)] transition hover:bg-[#003830] sm:h-12 sm:w-auto sm:gap-2 sm:px-4"
        aria-expanded={open}
        aria-label={open ? 'Close help chat' : 'Open help chat'}
      >
        {open ? <X className="size-5" /> : <Headset className="size-5" />}
        <span className="hidden font-[Sora] text-sm font-semibold sm:inline">
          {open ? 'Close' : 'Help'}
        </span>
      </button>
    </div>
  );
}
