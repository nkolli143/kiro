'use client'

import { useRef, useState } from 'react'
import { Camera, Upload, AlertCircle } from 'lucide-react'
import { GPSCoords, ViolationType } from '@/types'

interface Props {
  initialPhotos?: string[]
  initialViolationType?: ViolationType | null
  initialCoords?: GPSCoords | null
  onComplete: (photos: string[], coords: GPSCoords | null, violationType: ViolationType) => void
  onBack: () => void
}

const VIOLATION_TYPES: { value: ViolationType; label: string; description: string; img: string }[] = [
  {
    value: 'water_discharge',
    label: 'Water Discharge',
    description: 'Pipe, drain, or runoff into a waterway',
    img: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&q=70',
  },
  {
    value: 'air_emissions',
    label: 'Air Emissions',
    description: 'Smoke, fumes, or visible emissions from a facility',
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=70',
  },
  {
    value: 'illegal_dumping',
    label: 'Illegal Dumping',
    description: 'Waste, chemicals, or materials dumped illegally',
    img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=70',
  },
  {
    value: 'other',
    label: 'Other Violation',
    description: 'Any other environmental violation',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=70',
  },
]

export default function UploadStep({ initialPhotos = [], initialViolationType = null, initialCoords = null, onComplete, onBack }: Props) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos)
  const [coords, setCoords] = useState<GPSCoords | null>(initialCoords)
  const [violationType, setViolationType] = useState<ViolationType | null>(initialViolationType)
  const [extracting, setExtracting] = useState(false)
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'found' | 'manual' | 'error'>(initialCoords ? 'found' : 'idle')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    setExtracting(true)
    const dataUrls: string[] = []

    for (const file of Array.from(files)) {
      const dataUrl = await fileToDataUrl(file)
      dataUrls.push(dataUrl)

      // Try to extract GPS from EXIF
      if (!coords) {
        try {
          const exifr = (await import('exifr')).default
          const gps = await exifr.gps(file)
          if (gps?.latitude && gps?.longitude) {
            setCoords({ lat: gps.latitude, lng: gps.longitude })
            setGpsStatus('found')
          }
        } catch {
          // EXIF extraction failed — will use browser geolocation
        }
      }
    }

    setPhotos(prev => [...prev, ...dataUrls])
    setExtracting(false)

    // If no GPS from EXIF, try browser geolocation
    if (!coords && gpsStatus === 'idle') {
      requestBrowserLocation()
    }
  }

  function requestBrowserLocation() {
    if (!navigator.geolocation) {
      setGpsStatus('manual')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGpsStatus('found')
      },
      () => setGpsStatus('manual'),
      { timeout: 8000 }
    )
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  const canContinue = photos.length > 0 && violationType !== null && (coords !== null || gpsStatus === 'manual')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">What did you witness?</h2>
          <p className="text-gray-500 mt-1">Upload your photo and select the violation type to get started.</p>
        </div>
      </div>

      {/* Violation type selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Violation type</label>
        <div className="grid grid-cols-2 gap-3">
          {VIOLATION_TYPES.map(vt => (
            <button
              key={vt.value}
              onClick={() => setViolationType(vt.value)}
              className={`rounded-xl border-2 text-left transition-all overflow-hidden ${
                violationType === vt.value
                  ? 'border-green-600 ring-2 ring-green-200'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={vt.img} alt={vt.label} className="w-full h-24 object-cover" />
              <div className={`p-3 ${violationType === vt.value ? 'bg-green-50' : 'bg-white'}`}>
                <div className="font-semibold text-sm text-gray-900">{vt.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{vt.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Photo upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Photos <span className="text-red-500">*</span>
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)}
          />
          {extracting ? (
            <div className="text-green-600 font-medium">Extracting GPS data...</div>
          ) : (
            <>
              <Upload className="mx-auto text-green-400 mb-2" size={32} />
              <p className="text-gray-600 font-medium">Drop photos here or click to upload</p>
              <p className="text-gray-400 text-sm mt-1">GPS coordinates will be extracted automatically</p>
            </>
          )}
        </div>

        {photos.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {photos.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={p}
                alt={`Photo ${i + 1}`}
                className="w-20 h-20 object-cover rounded-lg border-2 border-green-200"
              />
            ))}
          </div>
        )}
      </div>

      {/* GPS status */}
      {gpsStatus === 'found' && coords && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 text-sm">
          <span className="text-lg">📍</span>
          <span>
            GPS found: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </span>
        </div>
      )}

      {gpsStatus === 'manual' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-2">
            <AlertCircle size={16} />
            No GPS found — location will be confirmed in the next step
          </div>
        </div>
      )}

      {photos.length > 0 && gpsStatus === 'idle' && (
        <button
          onClick={requestBrowserLocation}
          className="flex items-center gap-2 text-green-700 text-sm underline"
        >
          <Camera size={14} /> Use my current location
        </button>
      )}

      <button
        disabled={!canContinue}
        onClick={() => onComplete(photos, coords, violationType!)}
        className="w-full py-3 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Continue →
      </button>
    </div>
  )
}
