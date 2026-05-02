'use client'

import { useEffect, useState } from 'react'
import { GPSCoords } from '@/types'
import { MapPin, Loader2 } from 'lucide-react'

interface Props {
  coords: GPSCoords | null
  onComplete: (coords: GPSCoords, address: string, state: string, waterway: string | null) => void
}

export default function LocationStep({ coords: initialCoords, onComplete }: Props) {
  const [coords, setCoords] = useState<GPSCoords>(initialCoords || { lat: 0, lng: 0 })
  const [address, setAddress] = useState('')
  const [state, setState] = useState('')
  const [waterway, setWaterway] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState('')
  const [manualLat, setManualLat] = useState(initialCoords?.lat.toString() || '')
  const [manualLng, setManualLng] = useState(initialCoords?.lng.toString() || '')

  useEffect(() => {
    if (initialCoords) {
      geocode(initialCoords)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function geocode(c: GPSCoords) {
    setLoading(true)
    try {
      const res = await fetch(`/api/geocode?lat=${c.lat}&lng=${c.lng}`)
      const data = await res.json()
      setAddress(data.address || '')
      setState(data.state || '')
      setWaterway(data.waterway || null)
    } catch {
      setAddress(`${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`)
    }
    setLoading(false)
  }

  function handleManualCoords() {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)
    if (!isNaN(lat) && !isNaN(lng)) {
      const c = { lat, lng }
      setCoords(c)
      geocode(c)
    }
  }

  const canContinue = address.length > 0 && description.length > 10

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Confirm the location</h2>
        <p className="text-gray-500 mt-1">We&apos;ll use this to identify nearby permitted facilities.</p>
      </div>

      {/* Coordinates */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-2 text-green-700 font-semibold">
          <MapPin size={18} />
          GPS Coordinates
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">Latitude</label>
            <input
              type="number"
              step="0.000001"
              value={manualLat}
              onChange={e => setManualLat(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g. 37.7749"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Longitude</label>
            <input
              type="number"
              step="0.000001"
              value={manualLng}
              onChange={e => setManualLng(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g. -122.4194"
            />
          </div>
        </div>

        <button
          onClick={handleManualCoords}
          className="text-sm text-green-700 font-medium underline"
        >
          Look up this location
        </button>

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 size={14} className="animate-spin" />
            Looking up address...
          </div>
        )}

        {address && !loading && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm font-semibold text-gray-800">{address}</div>
            {waterway && (
              <div className="text-xs text-blue-600 mt-1">
                🌊 Nearby waterway: {waterway}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Describe what you observed <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          placeholder="e.g. Brown liquid discharging from a large pipe into the creek. Strong chemical smell. Discharge appeared continuous, not intermittent."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">Be specific: color, smell, volume, duration, time of day.</p>
      </div>

      <button
        disabled={!canContinue}
        onClick={() => onComplete(coords, address, state, waterway)}
        className="w-full py-3 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Find nearby facilities →
      </button>
    </div>
  )
}
