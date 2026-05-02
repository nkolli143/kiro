'use client'

import { useState } from 'react'
import { EvidenceItem, ViolationType } from '@/types'
import { CheckCircle2, Circle, Camera } from 'lucide-react'
import { getViolationLabel } from '@/lib/evidenceGuide'

interface Props {
  violationType: ViolationType
  checklist: EvidenceItem[]
  onComplete: (checklist: EvidenceItem[]) => void
}

export default function EvidenceStep({ violationType, checklist: initial, onComplete }: Props) {
  const [checklist, setChecklist] = useState<EvidenceItem[]>(initial)

  function toggle(id: string) {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, captured: !item.captured } : item))
    )
  }

  const requiredDone = checklist.filter(i => i.required).every(i => i.captured)
  const totalDone = checklist.filter(i => i.captured).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Build your evidence package</h2>
        <p className="text-gray-500 mt-1">
          For a <span className="font-semibold text-green-700">{getViolationLabel(violationType)}</span> complaint,
          here&apos;s exactly what to capture.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
        <strong>Why this matters:</strong> Agencies can only act on complaints with sufficient evidence.
        Required items are the minimum for a complaint to be actionable.
      </div>

      <div className="space-y-3">
        {checklist.map(item => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              item.captured
                ? 'border-green-500 bg-green-50'
                : item.required
                ? 'border-red-200 bg-white hover:border-red-300'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
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
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Evidence captured</span>
          <span className="font-semibold text-green-700">{totalDone} / {checklist.length}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${(totalDone / checklist.length) * 100}%` }}
          />
        </div>
        {!requiredDone && (
          <p className="text-xs text-red-500 mt-2">
            Complete all required items to file a fully actionable complaint.
          </p>
        )}
      </div>

      <button
        onClick={() => onComplete(checklist)}
        className="w-full py-3 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800 transition-all"
      >
        {requiredDone ? 'Review & file complaint →' : 'Continue anyway →'}
      </button>
    </div>
  )
}
