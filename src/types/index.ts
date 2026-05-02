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

export interface PersonInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  idPhotoDataUrl: string | null
}

export interface ComplaintReport {
  id: string
  createdAt: string
  violationType: ViolationType
  description: string
  coords: GPSCoords
  address: string
  photoDataUrls: string[]
  evidencePhotosByItem: Record<string, string[]>
  nearbyFacilities: EchoFacility[]
  selectedFacilityId: string | null
  agencies: Agency[]
  evidenceChecklist: EvidenceItem[]
  status: 'draft' | 'submitted' | 'acknowledged' | 'under_review' | 'closed'
  followUpAt: string | null
  language: string
  person: PersonInfo
}

export interface EvidenceItem {
  id: string
  label: string
  description: string
  required: boolean
  captured: boolean
}

export type Step = 'person' | 'upload' | 'location' | 'facilities' | 'evidence' | 'review' | 'submitted'

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
]
