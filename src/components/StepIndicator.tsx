'use client'

import { Step } from '@/types'
import { Check } from 'lucide-react'

const STEPS: { key: Step; label: string }[] = [
  { key: 'upload', label: 'Photo' },
  { key: 'location', label: 'Location' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'review', label: 'Review' },
  { key: 'submitted', label: 'Filed' },
]

interface Props {
  current: Step
}

export default function StepIndicator({ current }: Props) {
  const currentIndex = STEPS.findIndex(s => s.key === current)

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${done ? 'bg-green-600 text-white' : active ? 'bg-green-700 text-white ring-4 ring-green-200' : 'bg-gray-200 text-gray-500'}`}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${active ? 'text-green-700' : done ? 'text-green-600' : 'text-gray-400'}`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 mb-4 mx-1 transition-all ${i < currentIndex ? 'bg-green-600' : 'bg-gray-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
