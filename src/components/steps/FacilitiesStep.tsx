'use client'

import { useEffect, useState } from 'react'
import { EchoFacility, GPSCoords } from '@/types'
import { Building2, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react'

interface Props {
  coords: GPSCoords
  onComplete: (facilities: EchoFacility[], selectedId: string | null) => void
}

export default function FacilitiesStep({ coords, onComplete }: Props) {
  const [facilities, setFacilities] = useState<EchoFacility[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/facilities?lat=${coords.lat}&lng=${coords.lng}`)
        const data = await res.json()
        setFacilities(data.facilities || [])
        setIsMock(data.mock || false)
      } catch {
        setFacilities([])
      }
      setLoading(false)
    }
    load()
  }, [coords])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Nearby permitted facilities</h2>
        <p className="text-gray-500 mt-1">
          These facilities hold EPA permits within 5 miles of your location. Select one if it&apos;s the likely source.
        </p>
      </div>

      {isMock && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
          ⚠️ Using demo data — EPA ECHO API unavailable. Real deployment uses live permit data.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-3 text-green-700">
          <Loader2 className="animate-spin" size={24} />
          <span className="font-medium">Querying EPA ECHO database...</span>
        </div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Building2 size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No permitted facilities found within 5 miles</p>
          <p className="text-sm mt-1">This may indicate an unpermitted discharge</p>
        </div>
      ) : (
        <div className="space-y-3">
          {facilities.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedId(selectedId === f.id ? null : f.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedId === f.id
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">{f.name}</span>
                    {selectedId === f.id && <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {f.address}, {f.city}, {f.state} — {f.distanceMiles.toFixed(2)} mi away
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {f.programs.slice(0, 3).map(p => (
                      <span key={p} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {f.violationCount > 0 && (
                    <div className="flex items-center gap-1 text-red-600 text-sm font-semibold">
                      <AlertTriangle size={14} />
                      {f.violationCount} violation{f.violationCount !== 1 ? 's' : ''}
                    </div>
                  )}
                  {f.lastInspection && (
                    <div className="text-xs text-gray-400 mt-1">
                      Last inspected: {new Date(f.lastInspection).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              {f.permitIds.length > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                  Permits: {f.permitIds.slice(0, 3).join(', ')}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => onComplete(facilities, null)}
          className="flex-1 py-3 rounded-xl font-semibold text-green-700 border-2 border-green-200 hover:bg-green-50 transition-all"
        >
          None of these / Unknown source
        </button>
        <button
          onClick={() => onComplete(facilities, selectedId)}
          className="flex-1 py-3 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800 transition-all"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
