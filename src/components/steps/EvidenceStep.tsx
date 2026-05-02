'use client'

import { useRef, useState } from 'react'
import { EvidenceItem, ViolationType } from '@/types'
import { CheckCircle2, Circle, Camera, Upload, X } from 'lucide-react'
import { getViolationLabel } from '@/lib/evidenceGuide'

interface Props {
  violationType: ViolationType
  checklist: EvidenceItem[]
  evidencePhotos: Record<string, string[]>
  onComplete: (checklist: EvidenceItem[], evidencePhotos: Record<string, string[]>) => void
  onBack: () => void
}

export default function EvidenceStep({ violationType, checklist: initial, evidencePhotos: initialPhotos, onComplete, onBack }: Props) {
  const [checklist, setChecklist] = useState<EvidenceItem[]>(initial)
  const [photos, setPhotos] = useState<Record<string, string[]>>(initialPhotos)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function toggle(id: string) {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, captured: !item.captured } : item))
    )
  }

  async function handlePhotoUpload(itemId: string, files: FileList) {
    const newUrls: string[] = []
    for (const file of Array.from(files)) {
      const url = await fileToDataUrl(file)
      newUrls.push(url)
    }
    setPhotos(prev => ({ ...prev, [itemId]: [...(prev[itemId] || []), ...newUrls] }))
    // Auto-mark as captured when photo is uploaded
    setChecklist(prev =>
      prev.map(item => (item.id === itemId ? { ...item, captured: true } : item))
    )
  }

  function removePhoto(itemId: string, idx: number) {
    setPhotos(prev => {
      const updated = [...(prev[itemId] || [])]
      updated.splice(idx, 1)
      return { ...prev, [itemId]: updated }
    })
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })
  }

  const requiredDone = checklist.filter(i => i.required).every(i => i.captured)
  const totalDone = checklist.filter(i => i.captured).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Build your evidence package</h2>
          <p className="text-gray-500 mt-0.5 text-sm">
            For a <span className="font-semibold text-green-700">{getViolationLabel(violationType)}</span> complaint,
            here&apos;s exactly what to capture.
          </p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
        <strong>Why this matters:</strong> Agencies can only act on complaints with sufficient evidence.
        Upload photos directly or check items off as you capture them.
      </div>

      <div className="space-y-4">
        {checklist.map(item => (
          <div
            key={item.id}
            className={`rounded-xl border-2 transition-all overflow-hidden ${
              item.captured
                ? 'border-green-500 bg-green-50'
                : item.required
                ? 'border-red-200 bg-white'
                : 'border-gray-200 bg-white'
            }`}
          >
            {/* Item header — clickable to toggle */}
            <button
              onClick={() => toggle(item.id)}
              className="w-full text-left p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {item.captured ? (
                    <CheckCircle2 size={20} className="text-green-600" />
                  ) : (
                    <Circle size={20} className={item.required ? 'text-red-400' : 'text-gray-300'} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                    {item.required && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                </div>
                <Camera size={16} className="text-gray-300 flex-shrink-0 mt-1" />
              </div>
            </button>

            {/* Photo upload area */}
            <div className="px-4 pb-4">
              <input
                ref={el => { fileRefs.current[item.id] = el }}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => e.target.files && handlePhotoUpload(item.id, e.target.files)}
              />

              {/* Uploaded photos */}
              {(photos[item.id] || []).length > 0 && (
                <div className="flex gap-2 flex-wrap mb-2">
                  {(photos[item.id] || []).map((url, idx) => (
                    <div key={idx} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Evidence ${idx + 1}`} className="w-16 h-16 object-cover rounded-lg border-2 border-green-200" />
                      <button
                        onClick={() => removePhoto(item.id, idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => fileRefs.current[item.id]?.click()}
                className="flex items-center gap-2 text-xs text-green-700 font-medium border border-green-200 bg-white px-3 py-1.5 rounded-lg hover:bg-green-50 transition-all"
              >
                <Upload size={12} />
                {(photos[item.id] || []).length > 0 ? 'Add more photos' : 'Upload photo'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Evidence captured</span>
          <span className="font-semibold text-green-700">{totalDone} / {checklist.length}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: checklist.length > 0 ? `${(totalDone / checklist.length) * 100}%` : '0%' }}
          />
        </div>
        {!requiredDone && (
          <p className="text-xs text-red-500 mt-2">
            Complete all required items to file a fully actionable complaint.
          </p>
        )}
      </div>

      <button
        onClick={() => onComplete(checklist, photos)}
        className="w-full py-3 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800 transition-all"
      >
        {requiredDone ? 'Review & file complaint →' : 'Continue anyway →'}
      </button>
    </div>
  )
}
