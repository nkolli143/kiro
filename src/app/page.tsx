'use client'

import { useState } from 'react'
import { ComplaintReport, EchoFacility, EvidenceItem, GPSCoords, PersonInfo, Step, ViolationType } from '@/types'
import { getAgencies } from '@/lib/agencyRouter'
import { getEvidenceGuide } from '@/lib/evidenceGuide'
import { generateCaseId } from '@/lib/reportGenerator'
import StepIndicator from '@/components/StepIndicator'
import PersonStep from '@/components/steps/PersonStep'
import UploadStep from '@/components/steps/UploadStep'
import LocationStep from '@/components/steps/LocationStep'
import FacilitiesStep from '@/components/steps/FacilitiesStep'
import EvidenceStep from '@/components/steps/EvidenceStep'
import ReviewStep from '@/components/steps/ReviewStep'
import SubmittedStep from '@/components/steps/SubmittedStep'

const EMPTY_PERSON: PersonInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  idPhotoDataUrl: null,
}

// Sidebar content per step
const STEP_CONTEXT: Record<string, { heading: string; body: string; img: string; imgAlt: string }> = {
  person: {
    heading: 'Your identity matters',
    body: 'Agencies give higher priority to complaints with verified contact information. Your details are never shared publicly.',
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80',
    imgAlt: 'Industrial smoke stacks polluting the sky',
  },
  upload: {
    heading: 'Document what you see',
    body: 'Photos with GPS metadata are the strongest evidence. Capture the discharge point, surrounding area, and any visible damage.',
    img: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&q=80',
    imgAlt: 'Polluted river with brown discharge',
  },
  location: {
    heading: 'Pinpoint the source',
    body: 'Accurate coordinates help agencies dispatch inspectors to the exact location and identify the responsible permit holder.',
    img: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&q=80',
    imgAlt: 'Aerial view of industrial facility near water',
  },
  facilities: {
    heading: 'Follow the permits',
    body: 'EPA ECHO tracks every permitted facility in the US. Linking your complaint to a permit holder dramatically increases enforcement action.',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    imgAlt: 'Chemical plant with pipes and tanks',
  },
  evidence: {
    heading: 'Build an airtight case',
    body: 'Agencies can only act on what you document. Each item in this checklist is based on what inspectors actually look for.',
    img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
    imgAlt: 'Illegal dumping of waste barrels in a field',
  },
  review: {
    heading: 'You\'re almost there',
    body: 'Review your complaint carefully. Once filed, it becomes part of the public record and agencies are legally required to respond.',
    img: 'https://images.unsplash.com/photo-1497435334941-8c899a9bd6b3?w=600&q=80',
    imgAlt: 'Dark smoke billowing from factory chimneys at sunset',
  },
}

export default function Home() {
  const [step, setStep] = useState<Step>('person')
  const [followUpAt, setFollowUpAt] = useState<string | null>(null)

  // Preserve upload step state across back/forward
  const [savedPhotos, setSavedPhotos] = useState<string[]>([])
  const [savedViolationType, setSavedViolationType] = useState<ViolationType | null>(null)

  const [report, setReport] = useState<ComplaintReport>({
    id: generateCaseId(),
    createdAt: new Date().toISOString(),
    violationType: 'water_discharge',
    description: '',
    coords: { lat: 0, lng: 0 },
    address: '',
    photoDataUrls: [],
    evidencePhotosByItem: {},
    nearbyFacilities: [],
    selectedFacilityId: null,
    agencies: [],
    evidenceChecklist: [],
    status: 'draft',
    followUpAt: null,
    language: 'en',
    person: EMPTY_PERSON,
  })

  function handlePersonComplete(person: PersonInfo, language: string) {
    setReport(prev => ({ ...prev, person, language }))
    setStep('upload')
  }

  function handleUploadComplete(photos: string[], coords: GPSCoords | null, violationType: ViolationType) {
    setSavedPhotos(photos)
    setSavedViolationType(violationType)
    setReport(prev => ({
      ...prev,
      photoDataUrls: photos,
      coords: coords || prev.coords,
      violationType,
      evidenceChecklist: getEvidenceGuide(violationType),
    }))
    setStep('location')
  }

  function handleLocationComplete(coords: GPSCoords, address: string, state: string, waterway: string | null, description: string) {
    const agencies = getAgencies(state, report.violationType)
    setReport(prev => ({ ...prev, coords, address, agencies, description }))
    setStep('facilities')
  }

  function handleFacilitiesComplete(facilities: EchoFacility[], selectedId: string | null) {
    setReport(prev => ({ ...prev, nearbyFacilities: facilities, selectedFacilityId: selectedId }))
    setStep('evidence')
  }

  function handleEvidenceComplete(checklist: EvidenceItem[], evidencePhotos: Record<string, string[]>) {
    setReport(prev => ({ ...prev, evidenceChecklist: checklist, evidencePhotosByItem: evidencePhotos }))
    setStep('review')
  }

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

  function goToStep(s: Step) {
    setStep(s)
  }

  const ctx = STEP_CONTEXT[step]

  return (
    <div className="flex flex-col">
      <div className="flex-1 w-full px-6 py-8 flex gap-8 max-w-7xl mx-auto">

        {/* Left panel — form */}
        <div className="flex-1 min-w-0">
          {step !== 'submitted' && (
            <StepIndicator current={step} onStepClick={goToStep} />
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {step === 'person' && (
              <PersonStep
                initial={report.person}
                language={report.language}
                onComplete={handlePersonComplete}
              />
            )}
            {step === 'upload' && (
              <UploadStep
                initialPhotos={savedPhotos}
                initialViolationType={savedViolationType}
                initialCoords={report.coords.lat !== 0 ? report.coords : null}
                onComplete={handleUploadComplete}
                onBack={() => setStep('person')}
              />
            )}
            {step === 'location' && (
              <LocationStep
                coords={report.coords.lat !== 0 ? report.coords : null}
                description={report.description}
                onComplete={handleLocationComplete}
                onBack={() => setStep('upload')}
              />
            )}
            {step === 'facilities' && (
              <FacilitiesStep
                coords={report.coords}
                onComplete={handleFacilitiesComplete}
                onBack={() => setStep('location')}
              />
            )}
            {step === 'evidence' && (
              <EvidenceStep
                violationType={report.violationType}
                checklist={report.evidenceChecklist}
                evidencePhotos={report.evidencePhotosByItem}
                onComplete={handleEvidenceComplete}
                onBack={() => setStep('facilities')}
              />
            )}
            {step === 'review' && (
              <ReviewStep
                report={report}
                onSubmit={handleSubmit}
                onBack={() => setStep('evidence')}
              />
            )}
            {step === 'submitted' && (
              <SubmittedStep report={report} followUpAt={followUpAt} />
            )}
          </div>
        </div>

        {/* Right panel — contextual sidebar */}
        {step !== 'submitted' && ctx && (
          <div className="w-72 flex-shrink-0 space-y-4">
            {/* Hazard image card */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ctx.img}
                alt={ctx.imgAlt}
                className="w-full h-44 object-cover"
              />
              <div className="bg-gray-900 text-white p-4">
                <h3 className="font-bold text-base mb-1">{ctx.heading}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{ctx.body}</p>
              </div>
            </div>

            {/* Stats strip */}
            <div className="bg-green-700 rounded-2xl p-4 text-white space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-green-300">By the numbers</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '25K+', label: 'Complaints filed annually' },
                  { value: '60%', label: 'Result in inspections' },
                  { value: '80%', label: 'Near low-income areas' },
                  { value: '$2B+', label: 'In EPA penalties (2023)' },
                ].map(s => (
                  <div key={s.label} className="bg-green-800 rounded-xl p-3">
                    <div className="text-xl font-black">{s.value}</div>
                    <div className="text-xs text-green-300 mt-0.5 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">How it works</h3>
              <ol className="space-y-3">
                {[
                  { step: '01', title: 'Document', desc: 'Photo + GPS from your device' },
                  { step: '02', title: 'Identify', desc: 'EPA permit lookup by location' },
                  { step: '03', title: 'Build case', desc: 'Guided evidence checklist' },
                  { step: '04', title: 'File', desc: 'Routed to the right agency' },
                ].map(item => (
                  <li key={item.step} className="flex gap-3 items-start">
                    <span className="text-xs font-black text-green-700 bg-green-100 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
