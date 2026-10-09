export interface AgentRaw {
  id?: string | number
  _id?: string | number
  name?: string
  businessName?: string
  company?: string
  title?: string
  lat?: number
  lng?: number
  latitude?: number
  longitude?: number
  location?: { lat?: number; lng?: number }
  coords?: { lat?: number; lng?: number }
  info?: string
  address?: string
}

export interface AgentPoint {
  id: string | number
  name: string
  lat: number
  lng: number
  info?: string
}

// Public agents list API (replaces the legacy pickup-points endpoint).
export const PUBLIC_AGENTS_API =
  'https://app.escrowcourier.com/user-services/api/agents/public'

// Same-origin routes that sidestep the API's CORS allowlist. The public agents
// endpoint only reflects CORS headers for `http://localhost:5173` / `:3000`, so a
// direct browser call from any other origin (including this project's dev server
// on 5174 and the production site) fails. These routes reach it server-side:
//   - `/api/pickup-points`  -> serverless function in `api/pickup-points.js`
//   - `/pickup-points-api`  -> dev-only Vite proxy (see `vite.config.ts`)
const AGENTS_FUNCTION_PATH = '/api/pickup-points'
const AGENTS_PROXY_PATH = '/pickup-points-api'

/**
 * Fetch the public list of agents.
 *
 * Tries the same-origin routes first (dev proxy / serverless function) and only
 * falls back to the API directly, so the lookup works in development, on Netlify
 * and on the k8s deploy despite the API's origin-specific CORS allowlist.
 */
export async function fetchAgents(): Promise<any[]> {
  const sources = import.meta.env.DEV
    ? [AGENTS_PROXY_PATH, AGENTS_FUNCTION_PATH, PUBLIC_AGENTS_API]
    : [AGENTS_FUNCTION_PATH]

  for (const source of sources) {
    try {
      // No Content-Type header: keeps this a simple GET (no CORS preflight).
      const res = await fetch(source, { headers: { Accept: 'application/json' } })
      if (!res.ok) continue

      // Read as text first: an SPA host answers unknown paths with index.html,
      // which must not be treated as a successful API response.
      const text = await res.text()
      let data: any
      try {
        data = JSON.parse(text)
      } catch {
        continue
      }

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.agents)
        ? data.agents
        : []
      if (arr.length) return arr
    } catch {
      // Network/CORS failure - try the next source.
    }
  }

  throw new Error('Unable to load the agents list.')
}

export async function getAgents(): Promise<AgentPoint[]> {
  const arr = await fetchAgents()

  // The public payload has no coordinates, so agents keep lat/lng 0; they are
  // still returned (the map skips them, the lists/bookings keep them).
  return arr.map((item: AgentRaw, idx: number) => {
    const id = item.id ?? item._id ?? idx
    const name = item.name ?? item.businessName ?? item.company ?? item.title ?? 'Unknown'
    const lat = Number(item.lat ?? item.latitude ?? item.location?.lat ?? item.coords?.lat)
    const lng = Number(item.lng ?? item.longitude ?? item.location?.lng ?? item.coords?.lng)
    const info = item.info ?? item.address ?? ''
    return { id, name, lat: Number.isFinite(lat) ? lat : 0, lng: Number.isFinite(lng) ? lng : 0, info }
  })
}
