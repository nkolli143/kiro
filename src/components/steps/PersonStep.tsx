'use client'

import { useRef, useState } from 'react'
import { PersonInfo } from '@/types'
import { Upload, User } from 'lucide-react'

interface Props {
  initial: PersonInfo
  language: string
  onComplete: (person: PersonInfo, language: string) => void
}

export default function PersonStep({ initial, language: initialLang, onComplete }: Props) {
  const [person, setPerson] = useState<PersonInfo>(initial)
  const [idPreview, setIdPreview] = useState<string | null>(initial.idPhotoDataUrl)
  const fileRef = useRef<HTMLInputElement>(null)

  function update(field: keyof PersonInfo, value: string) {
    setPerson(prev => ({ ...prev, [field]: value }))
  }

  async function handleIdUpload(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const url = e.target?.result as string
      setIdPreview(url)
      setPerson(prev => ({ ...prev, idPhotoDataUrl: url }))
    }
    reader.readAsDataURL(file)
  }

  const canContinue = person.firstName.trim().length > 0 && person.lastName.trim().length > 0 && person.email.trim().length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your information</h2>
        <p className="text-gray-500 mt-1">
          Your contact details are included in the complaint so agencies can follow up with you directly.
        </p>
      </div>

      {/* Personal info form */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <User size={16} />
          Personal details
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={person.firstName}
              onChange={e => update('firstName', e.target.value)}
              placeholder="Maria"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={person.lastName}
              onChange={e => update('lastName', e.target.value)}
              placeholder="Garcia"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={person.email}
            onChange={e => update('email', e.target.value)}
            placeholder="maria@example.com"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <p className="text-xs text-gray-400 mt-1">Agencies will use this to acknowledge your complaint.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Phone number</label>
          <input
            type="tel"
            value={person.phone}
            onChange={e => update('phone', e.target.value)}
            placeholder="(555) 000-0000"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Your address</label>
          <input
            type="text"
            value={person.address}
            onChange={e => update('address', e.target.value)}
            placeholder="123 Main St, City, State 00000"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {/* ID upload */}
      <div>
        <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
          <Upload size={16} />
          ID verification <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Some agencies give higher priority to complaints with verified identity. Upload a photo of a government-issued ID.
          Your ID is never shared publicly.
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleIdUpload(e.target.files[0])}
        />

        {idPreview ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={idPreview} alt="ID preview" className="w-32 h-20 object-cover rounded-lg border-2 border-green-200" />
            <div>
              <p className="text-sm text-green-700 font-medium">ID uploaded ✓</p>
              <button
                onClick={() => { setIdPreview(null); setPerson(prev => ({ ...prev, idPhotoDataUrl: null })) }}
                className="text-xs text-red-500 underline mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-green-400 hover:text-green-700 transition-all w-full justify-center"
          >
            <Upload size={16} />
            Upload ID photo (driver&apos;s license, passport, etc.)
          </button>
        )}
      </div>

      <button
        disabled={!canContinue}
        onClick={() => onComplete(person, initialLang)}
        className="w-full py-3 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Continue →
      </button>
    </div>
  )
}
