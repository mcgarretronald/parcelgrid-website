import { useEffect, useRef, useState } from 'react'
import type { PickupPoint, GoogleMapProps } from '../../lib/types'

// Custom hook to fetch and normalize agent data
export function useAgentData(apiUrl?: string) {
  const [points, setPoints] = useState<PickupPoint[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const token = (import.meta.env as any).VITE_AGENTS_API_KEY || undefined

    const fetchPoints = async () => {
      if (!apiUrl) {
        setPoints([])
        return
      }

      setLoading(true)
      try {
        const headers: Record<string, string> = {}
        if (token) headers.Authorization = `Bearer ${token}`
        const res = await fetch(apiUrl, { headers })
        
        // Check if response is actually JSON
        const contentType = res.headers.get('content-type')
        if (!res.ok || !contentType?.includes('application/json')) {
          console.warn(`API endpoint ${apiUrl} returned non-JSON response:`, res.status, res.statusText)
          if (mounted) {
            setPoints([])
            setLoading(false)
          }
          return
        }
        
        const data = await res.json()

        // Handle different response formats
        let arr: any[] = []
        if (Array.isArray(data)) {
          arr = data
        } else if (data?.data && Array.isArray(data.data)) {
          arr = data.data
        } else if (data?.agents && Array.isArray(data.agents)) {
          arr = data.agents
        } else if (data?.results && Array.isArray(data.results)) {
          arr = data.results
        } else if (typeof data === 'object') {
          const possibleArrays = Object.values(data).filter((v) => Array.isArray(v))
          if (possibleArrays.length > 0) {
            arr = possibleArrays[0] as any[]
          }
        }

        const normalized: PickupPoint[] = arr
          .map((item: any, idx: number) => {
            const id = item.id ?? item._id ?? item.agentId ?? idx
            const name =
              item.name ??
              item.businessName ??
              item.business_name ??
              item.company ??
              item.title ??
              item.agent_name ??
              'Unknown'

            let lat: number | undefined
            let lng: number | undefined

            const coords = item.coordinates ?? item.geometry?.coordinates ?? item.location?.coordinates
            if (coords) {
              if (typeof coords === 'string') {
                const parts = coords.split(',').map((s) => s.trim())
                if (parts.length === 2) {
                  const first = Number(parts[0])
                  const second = Number(parts[1])
                  if (Number.isFinite(first) && Number.isFinite(second)) {
                    lat = first
                    lng = second
                  }
                }
              } else if (Array.isArray(coords) && coords.length >= 2) {
                const a = Number(coords[0])
                const b = Number(coords[1])
                if (Math.abs(a) <= 180 && Math.abs(b) <= 90) {
                  lng = a
                  lat = b
                } else if (Math.abs(b) <= 180 && Math.abs(a) <= 90) {
                  lat = a
                  lng = b
                } else {
                  lat = Number(b)
                  lng = Number(a)
                }
              } else if (typeof coords === 'object') {
                lat = Number(coords.lat ?? coords.latitude ?? coords[1] ?? coords.y)
                lng = Number(coords.lng ?? coords.longitude ?? coords[0] ?? coords.x)
              }
            }

            if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) {
              const fallbackLat = Number(
                item.lat ?? item.latitude ?? item.location?.lat ?? item.coords?.lat ?? item.geometry?.coordinates?.[1]
              )
              const fallbackLng = Number(
                item.lng ?? item.longitude ?? item.location?.lng ?? item.coords?.lng ?? item.geometry?.coordinates?.[0]
              )
              if (Number.isFinite(fallbackLat) && Number.isFinite(fallbackLng)) {
                lat = fallbackLat
                lng = fallbackLng
              }
            }

            const infoParts = []
            if (item.town) infoParts.push(item.town)
            if (item.county) infoParts.push(item.county)
            if (item.fullDetailedAddress) infoParts.push(item.fullDetailedAddress)
            else if (item.address) infoParts.push(item.address)

            const info = infoParts.join(', ') || (item.info ?? item.description ?? '')
            return {
              id,
              name,
              lat: Number.isFinite(lat as number) ? (lat as number) : 0,
              lng: Number.isFinite(lng as number) ? (lng as number) : 0,
              info,
            }
          })
          .filter((p: PickupPoint) => p.lat !== 0 || p.lng !== 0)

        if (mounted) {
          setPoints(normalized)
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching pickup points', err)
        if (mounted) {
          setPoints([])
          setLoading(false)
        }
      }
    }

    fetchPoints()
    return () => {
      mounted = false
    }
  }, [apiUrl])

  return { points, loading }
}

function loadGoogleMapsScript(apiKey: string, onLoad: () => void) {
  if ((window as any).google && (window as any).google.maps) {
    try {
      onLoad()
    } catch (e) {
      console.error('Google initialize error', e)
    }
    return
  }

  const existing = document.getElementById('google-maps-script') as HTMLScriptElement | null
  if (existing) {
    if ((window as any).google && (window as any).google.maps) {
      try {
        onLoad()
      } catch (e) {
        console.error('Google initialize error', e)
      }
      return
    }
    existing.addEventListener('load', onLoad as any)
    existing.addEventListener('error', () => console.error('Failed to load Google Maps script'))
    return
  }

  const script = document.createElement('script')
  script.id = 'google-maps-script'
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
  script.async = true
  script.defer = true
  script.onload = () => {
    try {
      onLoad()
    } catch (e) {
      console.error('Google initialize error', e)
    }
    script.setAttribute('data-loaded', 'true')
  }
  script.onerror = (e) => console.error('Error loading Google Maps script', e)
  document.head.appendChild(script)
}

export interface MapControls {
  panToPoint: (point: PickupPoint) => void
}

export default function GoogleMap({
  apiKey,
  apiUrl,
  points: propPoints,
  onMapReady,
}: GoogleMapProps & { points?: PickupPoint[]; onMapReady?: (controls: MapControls) => void }) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const { points: fetchedPoints } = useAgentData(apiUrl)
  const points = propPoints ?? fetchedPoints
  const markersRef = useRef<any[]>([])
  const mapInstanceRef = useRef<any>(null)
  const markerMapRef = useRef<Record<string, any>>({})

  useEffect(() => {
    const key = apiKey || (import.meta.env && (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY)
    if (!key) {
      console.warn('Google Maps API key not provided. Set VITE_GOOGLE_MAPS_API_KEY in your env.')
      return
    }

    let map: any
    let infoWindow: any

    const initialize = () => {
      const google = (window as any).google
      if (!mapRef.current || !google) return

      const center = { lat: -1.286389, lng: 36.817223 }
      map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 6,
        mapTypeControl: false,
      })

      mapInstanceRef.current = map
      infoWindow = new google.maps.InfoWindow()

      markersRef.current.forEach((m) => m.setMap(null))
      markersRef.current = []

      const markerMap: Record<string, any> = {}

      points.forEach((p) => {
        const iconUrl = '/logo1.png'
        const iconSize = new google.maps.Size(48, 48)

        const marker = new google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          title: p.name,
          icon: {
            url: iconUrl,
            scaledSize: iconSize,
            anchor: new google.maps.Point(iconSize.width / 2, iconSize.height),
          },
          optimized: false,
        })

        marker.addListener('click', () => {
          // Extract town from the info string - look for town information
          const infoText = p.info || ''
          const infoParts = infoText.split(',').map(part => part.trim())
          const town = infoParts.find(part => part.toLowerCase().includes('town')) || 
                       infoParts[0] || 
                       'Town not specified'
          const businessName = p.name || 'Unknown Business'
          infoWindow.setContent(`<div><strong>${town}</strong><div style="margin-top: 4px; font-size: 14px; color: #666;">${businessName}</div></div>`)
          infoWindow.open(map, marker)
        })

        markersRef.current.push(marker)
        markerMap[String(p.id)] = marker
      })

      if (points.length > 0) {
        const bounds = new google.maps.LatLngBounds()
        points.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }))
        map.fitBounds(bounds)
      }

      markerMapRef.current = markerMap

      // Expose map controls
      if (onMapReady) {
        const controls: MapControls = {
          panToPoint: (point: PickupPoint) => {
            if (map && google) {
              const marker = markerMap[String(point.id)]
              if (marker) {
                map.panTo({ lat: point.lat, lng: point.lng })
                map.setZoom(Math.max(map.getZoom(), 12))
                // Trigger marker click to show info window
                google.maps.event.trigger(marker, 'click')
              }
            }
          },
        }
        onMapReady(controls)
      }
    }

    loadGoogleMapsScript(key, initialize)

    return () => {
      markersRef.current.forEach((m) => m.setMap(null))
      markersRef.current = []
    }
  }, [points, apiKey])

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

// Separate search component for external use
export function MapSearch({ points, onSelect }: { points: PickupPoint[]; onSelect: (point: PickupPoint) => void }) {
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState<PickupPoint[]>(points)

  useEffect(() => {
    if (!query) {
      setFiltered(points)
      return
    }
    const q = query.toLowerCase().trim()
    
    // Split query into words to handle multi-word searches
    const queryWords = q.split(/\s+/).filter(word => word.length > 0)
    
    setFiltered(points.filter((p) => {
      const name = p.name.toLowerCase()
      const info = (p.info || '').toLowerCase()
      const searchText = `${name} ${info}`
      
      // Check if all query words are found in the combined text
      return queryWords.every(word => searchText.includes(word))
    }))
  }, [points, query])

  return (
    <div className="w-full bg-white rounded-lg p-4 shadow">
      <input
        type="text"
        aria-label="Search pickup points"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          // Ensure space key is not prevented
          if (e.key === ' ' || e.code === 'Space') {
            e.stopPropagation()
          }
        }}
        placeholder="Search pickup points by name or location..."
        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[#00473E] focus:ring-2 focus:ring-[#00473E]/20 outline-none"
        autoComplete="off"
        spellCheck="false"
      />
      {query && (
        <div className="max-h-64 overflow-auto mt-3 border-t pt-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
            >
              <div className="font-medium text-gray-900">
                {(() => {
                  const infoText = p.info || ''
                  const infoParts = infoText.split(',').map(part => part.trim())
                  return infoParts.find(part => part.toLowerCase().includes('town')) || 
                         infoParts[0] || 
                         `Town ${p.id}`
                })()}
              </div>
              <div className="text-sm text-gray-600 mt-1">{p.name}</div>
            </button>
          ))}
          {filtered.length === 0 && <div className="px-3 py-2 text-sm text-gray-500">No matches found</div>}
        </div>
      )}
    </div>
  )
}

// Separate agent list component for external use
export function AgentLocationsList({ 
  points, 
  onSelect 
}: { 
  points: PickupPoint[]
  onSelect?: (point: PickupPoint) => void 
}) {
  return (
    <div className="w-full h-full bg-white rounded-lg p-4 shadow flex flex-col">
      <div className="font-semibold mb-3 text-lg text-gray-900">
        Our Pickup Points
      </div>
      {points.length > 0 ? (
        <div className="flex-1 overflow-auto space-y-3">
          {points.map((point) => (
            <button
              key={point.id}
              onClick={() => onSelect?.(point)}
              className="w-full text-left border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors px-3 py-3 rounded"
            >
              <div className="font-medium text-gray-900 leading-relaxed break-words">
                {(() => {
                  const infoParts = (point.info || '').split(',').map(part => part.trim())
                  return infoParts.find(part => part.toLowerCase().includes('town')) || 
                         infoParts[0] || 
                         `Town ${point.id}`
                })()}
              </div>
              <div className="text-gray-500 text-xs mt-2 leading-normal break-words">
                {point.info || 'Address not available'}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm p-3 bg-gray-50 rounded">
          No agent locations found. The API may not have returned valid coordinate data.
        </div>
      )}
    </div>
  )
}
