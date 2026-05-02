export type ViolationType = 'water_discharge' | 'air_emissions' | 'illegal_dumping' | 'other'

export interface GPSCoords {
  lat: number
  lng: number
}

export interface EchoFacility {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  lat: number
  lng: number
  distanceMiles: number
  programs: string[]
  violationCount: number
  lastInspection: string | null
  permitIds: string[]
}

export interface Agency {
  name: string
  shortName: string
  email: string
  jurisdiction: string
  responseWindowHours: number
}

export interface ComplaintReport {
  id: string
  createdAt: string
  violationType: ViolationType
  description: string
  coords: GPSCoords
  address: string
  photoDataUrls: string[]
  nearbyFacilities: EchoFacility[]
  selectedFacilityId: string | null
  agencies: Agency[]
  evidenceChecklist: EvidenceItem[]
  status: 'draft' | 'submitted' | 'acknowledged' | 'under_review' | 'closed'
  followUpAt: string | null
  language: string
}

export interface EvidenceItem {
  id: string
  label: string
  description: string
  required: boolean
  captured: boolean
}

export type Step = 'upload' | 'location' | 'facilities' | 'evidence' | 'review' | 'submitted'
