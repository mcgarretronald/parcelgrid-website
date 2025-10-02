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

export async function getAgents(apiUrl: string, token?: string): Promise<AgentPoint[]> {
  const headers: Record<string,string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(apiUrl, { headers })
  if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`)
  const data = await res.json()

  const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])

  return arr.map((item: AgentRaw, idx: number) => {
    const id = item.id ?? item._id ?? idx
    const name = item.name ?? item.businessName ?? item.company ?? item.title ?? 'Unknown'
    const lat = Number(item.lat ?? item.latitude ?? item.location?.lat ?? item.coords?.lat)
    const lng = Number(item.lng ?? item.longitude ?? item.location?.lng ?? item.coords?.lng)
    const info = item.info ?? item.address ?? ''
    return { id, name, lat: Number.isFinite(lat) ? lat : 0, lng: Number.isFinite(lng) ? lng : 0, info }
  }).filter((p: AgentPoint) => p.lat !== 0 || p.lng !== 0)
}
