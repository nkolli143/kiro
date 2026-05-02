'use client'

import { useState } from 'react'
import { ComplaintReport } from '@/types'
import { getViolationLabel } from '@/lib/evidenceGuide'
import { MapPin, Building2, FileText, Send, Loader2, Globe } from 'lucide-react'

interface Props {
  report: ComplaintReport
  onSubmit: (report: ComplaintReport) => void
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ar', label: 'العربية' },
]

export default function ReviewStep({ report, onSubmit }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [language, setLanguage] = useState('en')

  const selectedFacility = report.nearbyFacilities.find(f => f.id === report.selectedFacilityId)
  const capturedEvidence = report.evidenceChecklist.filter(e => e.captured)

  async function handleSubmit() {
    setSubmitting(true)
    const finalReport = { ...report, language }
    onSubmit(finalReport)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review your complaint</h2>
        <p className="text-gray-500 mt-1">
          This will be filed as a legally structured complaint. Review before submitting.
        </p>
      </div>

      {/* Violation type */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
          <FileText size={16} />
          VIOLATION TYPE
        </div>
        <div className="font-bold text-gray-900 text-lg">{getViolationLabel(report.violationType)}</div>
        <p className="text-gray-600 text-sm mt-1">{report.description}</p>
      </div>

      {/* Location */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
          <MapPin size={16} />
          LOCATION
        </div>
        <div className="font-semibold text-gray-900">{report.address}</div>
        <div className="text-sm text-gray-500 mt-0.5">
          {report.coords.lat.toFixed(5)}, {report.coords.lng.toFixed(5)}
        </div>
        <a
          href={`https://maps.google.com/?q=${report.coords.lat},${report.coords.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 underline mt-1 inline-block"
        >
          View on Google Maps ↗
        </a>
      </div>

      {/* Facility */}
      {selectedFacility && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
            <Building2 size={16} />
            IDENTIFIED FACILITY
          </div>
          <div className="font-semibold text-gray-900">{selectedFacility.name}</div>
          <div className="text-sm text-gray-500">
            {selectedFacility.address}, {selectedFacility.city}, {selectedFacility.state}
          </div>
          {selectedFacility.violationCount > 0 && (
            <div className="text-sm text-red-600 font-medium mt-1">
              ⚠️ {selectedFacility.violationCount} prior violation{selectedFacility.violationCount !== 1 ? 's' : ''} on record
            </div>
          )}
        </div>
      )}

      {/* Evidence */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-gray-500 mb-2">EVIDENCE CAPTURED</div>
        {capturedEvidence.length === 0 ? (
          <p className="text-sm text-gray-400">No evidence items marked as captured</p>
        ) : (
          <ul className="space-y-1">
            {capturedEvidence.map(e => (
              <li key={e.id} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="text-green-600">✓</span> {e.label}
              </li>
            ))}
          </ul>
        )}
        <div className="text-xs text-gray-400 mt-2">
          {report.photoDataUrls.length} photo{report.photoDataUrls.length !== 1 ? 's' : ''} attached
        </div>
      </div>

      {/* Agencies */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-gray-500 mb-3">WILL BE FILED WITH</div>
        <div className="space-y-3">
          {report.agencies.map(a => (
            <div key={a.shortName} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-green-700">{a.shortName.slice(0, 3)}</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900">{a.name}</div>
                <div className="text-xs text-gray-500">{a.jurisdiction}</div>
                <div className="text-xs text-green-600 mt-0.5">
                  Response expected within {a.responseWindowHours}h
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Globe size={16} />
          Report language
        </div>
        <div className="flex gap-2 flex-wrap">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                language === l.code
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-600 hover:border-green-300'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-4 rounded-xl font-bold text-white bg-green-700 hover:bg-green-800 disabled:opacity-60 transition-all flex items-center justify-center gap-2 text-lg"
      >
        {submitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Filing complaint...
          </>
        ) : (
          <>
            <Send size={20} />
            File complaint now
          </>
        )}
      </button>

      <p className="text-xs text-center text-gray-400">
        By submitting, you confirm this report is accurate to the best of your knowledge.
        False reports may have legal consequences.
      </p>
    </div>
  )
}
