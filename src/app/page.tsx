'use client'

import { useState } from 'react'
import { ComplaintReport, EchoFacility, EvidenceItem, GPSCoords, Step, ViolationType } from '@/types'
import { getAgencies } from '@/lib/agencyRouter'
import { getEvidenceGuide } from '@/lib/evidenceGuide'
import { generateCaseId } from '@/lib/reportGenerator'
import StepIndicator from '@/components/StepIndicator'
import UploadStep from '@/components/steps/UploadStep'
import LocationStep from '@/components/steps/LocationStep'
import FacilitiesStep from '@/components/steps/FacilitiesStep'
import EvidenceStep from '@/components/steps/EvidenceStep'
import ReviewStep from '@/components/steps/ReviewStep'
import SubmittedStep from '@/components/steps/SubmittedStep'
import { Leaf } from 'lucide-react'

export default function Home() {
  const [step, setStep] = useState<Step>('upload')
  const [followUpAt, setFollowUpAt] = useState<string | null>(null)

  const [report, setReport] = useState<ComplaintReport>({
    id: generateCaseId(),
    createdAt: new Date().toISOString(),
    violationType: 'water_discharge',
    description: '',
    coords: { lat: 0, lng: 0 },
    address: '',
    photoDataUrls: [],
    nearbyFacilities: [],
    selectedFacilityId: null,
    agencies: [],
    evidenceChecklist: [],
    status: 'draft',
    followUpAt: null,
    language: 'en',
  })

  // Step 1: Upload
  function handleUploadComplete(photos: string[], coords: GPSCoords | null, violationType: ViolationType) {
    setReport(prev => ({
      ...prev,
      photoDataUrls: photos,
      coords: coords || prev.coords,
      violationType,
      evidenceChecklist: getEvidenceGuide(violationType),
    }))
    setStep('location')
  }

  // Step 2: Location
  function handleLocationComplete(coords: GPSCoords, address: string, state: string, waterway: string | null) {
    const agencies = getAgencies(state, report.violationType)
    setReport(prev => ({
      ...prev,
      coords,
      address,
      agencies,
      description: prev.description || (waterway ? `Incident near ${waterway}` : ''),
    }))
    setStep('facilities')
  }

  // Step 3: Facilities
  function handleFacilitiesComplete(facilities: EchoFacility[], selectedId: string | null) {
    setReport(prev => ({
      ...prev,
      nearbyFacilities: facilities,
      selectedFacilityId: selectedId,
    }))
    setStep('evidence')
  }

  // Step 4: Evidence
  function handleEvidenceComplete(checklist: EvidenceItem[]) {
    setReport(prev => ({ ...prev, evidenceChecklist: checklist }))
    setStep('review')
  }

  // Step 5: Submit
  async function handleSubmit(finalReport: ComplaintReport) {
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalReport),
      })
      const data = await res.json()
      setFollowUpAt(data.followUpAt || null)
      setReport({ ...finalReport, status: 'submitted' })
      setStep('submitted')
    } catch {
      alert('Submission failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900">EnviroReport</span>
            <span className="text-xs text-gray-400 ml-2">Environmental Complaint System</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {step !== 'submitted' && <StepIndicator current={step} />}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {step === 'upload' && (
            <UploadStep onComplete={handleUploadComplete} />
          )}
          {step === 'location' && (
            <LocationStep
              coords={report.coords.lat !== 0 ? report.coords : null}
              onComplete={(coords, address, state, waterway) => {
                // Store description from location step
                setReport(prev => ({ ...prev, description: prev.description }))
                handleLocationComplete(coords, address, state, waterway)
              }}
            />
          )}
          {step === 'facilities' && (
            <FacilitiesStep
              coords={report.coords}
              onComplete={handleFacilitiesComplete}
            />
          )}
          {step === 'evidence' && (
            <EvidenceStep
              violationType={report.violationType}
              checklist={report.evidenceChecklist}
              onComplete={handleEvidenceComplete}
            />
          )}
          {step === 'review' && (
            <ReviewStep report={report} onSubmit={handleSubmit} />
          )}
          {step === 'submitted' && (
            <SubmittedStep report={report} followUpAt={followUpAt} />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by EPA ECHO public data · Built for environmental justice
        </p>
      </main>
    </div>
  )
}
