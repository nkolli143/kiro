'use client'

import { useEffect, useState } from 'react'
import { GPSCoords } from '@/types'
import { MapPin, Loader2, Navigation, Search } from 'lucide-react'

interface Props {
  coords: GPSCoords | null
  description: string
  onComplete: (coords: GPSCoords, address: string, state: string, waterway: string | null, description: string) => void
  onBack: () => void
}

export default function LocationStep({ coords: initialCoords, description: initialDesc, onComplete, onBack }: Props) {
  const [coords, setCoords] = useState<GPSCoords>(initialCoords || { lat: 0, lng: 0 })
  const [address, setAddress] = useState('')
  const [state, setState] = useState('')
  const [waterway, setWaterway] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [description, setDescription] = useState(initialDesc)
  const [manualLat, setManualLat] = useState(initialCoords?.lat.toString() || '')
  const [manualLng, setManualLng] = useState(initialCoords?.lng.toString() || '')
  const [addressSearch, setAddressSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [inputMode, setInputMode] = useState<'address' | 'coords'>('address')

  useEffect(() => {
    if (initialCoords && initialCoords.lat !== 0) {
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
      setManualLat(c.lat.toString())
      setManualLng(c.lng.toString())
    } catch {
      setAddress(`${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`)
    }
    setLoading(false)
  }

  async function searchAddress() {
    if (!addressSearch.trim()) return
    setSearchLoading(true)
    try {
      const encoded = encodeURIComponent(addressSearch)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&countrycodes=us`,
        { headers: { 'User-Agent': 'EnviroReport/1.0' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        const c = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
        setCoords(c)
        await geocode(c)
      } else {
        alert('Address not found. Try a more specific address or use coordinates.')
      }
    } catch {
      alert('Address search failed. Please try coordinates instead.')
    }
    setSearchLoading(false)
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

  function useCurrentLocation() {
    if (!navigator.geolocation) return
    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCoords(c)
        geocode(c)
        setGettingLocation(false)
      },
      () => {
        alert('Could not get your location. Please enter it manually.')
        setGettingLocation(false)
      },
      { timeout: 8000 }
    )
  }

  const canContinue = address.length > 0 && description.length > 10

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Confirm the location</h2>
          <p className="text-gray-500 mt-0.5 text-sm">We&apos;ll use this to identify nearby permitted facilities.</p>
        </div>
      </div>

      {/* Location input */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <MapPin size={18} />
            Incident location
          </div>
          <button
            onClick={useCurrentLocation}
            disabled={gettingLocation}
            className="flex items-center gap-1.5 text-xs text-green-700 font-medium bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-all disabled:opacity-50"
          >
            {gettingLocation ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
            Use my current location
          </button>
        </div>

        {/* Toggle input mode */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setInputMode('address')}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${inputMode === 'address' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
          >
            Search by address
          </button>
          <button
            onClick={() => setInputMode('coords')}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${inputMode === 'coords' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
          >
            Enter coordinates
          </button>
        </div>

        {inputMode === 'address' ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={addressSearch}
              onChange={e => setAddressSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchAddress()}
              placeholder="e.g. 1200 Industrial Blvd, Fresno, CA"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={searchAddress}
              disabled={searchLoading}
              className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 flex items-center gap-1.5"
            >
              {searchLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              Search
            </button>
          </div>
        ) : (
          <div className="space-y-2">
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
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 size={14} className="animate-spin" />
            Looking up address...
          </div>
        )}

        {address && !loading && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm font-semibold text-gray-800">📍 {address}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </div>
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
        onClick={() => onComplete(coords, address, state, waterway, description)}
        className="w-full py-3 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Find nearby facilities →
      </button>
    </div>
  )
}
