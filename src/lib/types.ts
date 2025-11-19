export interface PickupPoint {
  id: string | number
  name: string
  lat: number
  lng: number
  info?: string
  distanceFromHQ?: number
  rawData?: any // Store the original data for additional fields
}

export interface GoogleMapProps {
  apiKey?: string
  apiUrl?: string // endpoint to fetch pickup points (should return JSON array of points)
  apiToken?: string // optional token for the agents API
}
