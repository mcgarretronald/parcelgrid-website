// Temp verification: fetch NAKM#73333 and confirm duplicate history entries collapse.
function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}
function getFirstString(obj, keys) {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && !isNaN(v)) return String(v);
  }
  return undefined;
}
function dedupeEvents(events) {
  const seen = new Set();
  const out = [];
  for (const ev of events) {
    const key = [ev.status, ev.description, ev.location]
      .map((s) => (s || '').trim().toLowerCase())
      .join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ev);
  }
  return out;
}
function formatDate(d) {
  if (!d || isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Africa/Nairobi' }).format(d);
}

const trackingNo = 'NAKM#73333';
const res = await fetch(`https://app.escrowcourier.com/order-services/api/track/${encodeURIComponent(trackingNo)}`);
const json = await res.json();
const payload = json?.data && typeof json.data === 'object' ? json.data : json;
const journey = Array.isArray(payload?.journey) ? payload.journey : [];

const mapped = journey
  .map((e) => {
    const status = getFirstString(e, ['title', 'label', 'status', 'state', 'name', 'event', 'eventType']) || getFirstString(e, ['description', 'message', 'details']) || 'Parcel Update';
    const description = getFirstString(e, ['description', 'message', 'details', 'note', 'text', 'comment']);
    const location = getFirstString(e, ['branch', 'location', 'town', 'city', 'place', 'hub', 'station']);
    const timestamp = getFirstString(e, ['timestamp', 'date', 'time', 'datetime', 'createdAt', 'updatedAt']);
    const parsedDate = parseDate(timestamp);
    return { status, description, location, timestamp: parsedDate ? formatDate(parsedDate) : timestamp, date: parsedDate, completed: true };
  })
  .filter((e) => e.status)
  .sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0));

const deduped = dedupeEvents(mapped);

console.log('RAW journey count:', journey.length);
console.log('Mapped count:', mapped.length);
console.log('Deduped count:', deduped.length);
console.log('--- Statuses after dedupe ---');
deduped.forEach((e) => console.log(`- ${e.status}  [${e.timestamp}]`));
