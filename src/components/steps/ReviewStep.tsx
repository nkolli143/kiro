'use client'

import { useState } from 'react'
import { ComplaintReport } from '@/types'
import { getViolationLabel } from '@/lib/evidenceGuide'
import { MapPin, Building2, FileText, Send, Loader2, Download, ChevronDown, ChevronUp, User } from 'lucide-react'
import { formatReportText } from '@/lib/reportGenerator'

interface Props {
  report: ComplaintReport
  onSubmit: (report: ComplaintReport) => void
  onBack: () => void
}

export default function ReviewStep({ report, onSubmit, onBack }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [showSummary, setShowSummary] = useState(true)
  const [showPdfPreview, setShowPdfPreview] = useState(false)

  const selectedFacility = report.nearbyFacilities.find(f => f.id === report.selectedFacilityId)
  const capturedEvidence = report.evidenceChecklist.filter(e => e.captured)
  const totalEvidencePhotos = Object.values(report.evidencePhotosByItem).flat().length

  const reportText = formatReportText(report)

  function downloadTxt() {
    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enviro-report-${report.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function downloadPdf() {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    // Header
    doc.setFillColor(22, 163, 74)
    doc.rect(0, 0, 210, 30, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('EnviroReport', 15, 15)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Environmental Violation Complaint', 15, 23)
    doc.text(`Case ID: ${report.id}`, 140, 15)
    doc.text(`Filed: ${new Date(report.createdAt).toLocaleDateString()}`, 140, 23)

    doc.setTextColor(0, 0, 0)
    let y = 40

    function section(title: string) {
      doc.setFillColor(240, 253, 244)
      doc.rect(10, y - 5, 190, 10, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(22, 101, 52)
      doc.text(title, 15, y + 1)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      y += 12
    }

    function line(label: string, value: string) {
      doc.setFont('helvetica', 'bold')
      doc.text(`${label}:`, 15, y)
      doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(value, 140)
      doc.text(lines, 60, y)
      y += lines.length * 6 + 2
    }

    // Complainant
    section('COMPLAINANT INFORMATION')
    line('Name', `${report.person.firstName} ${report.person.lastName}`)
    line('Email', report.person.email)
    if (report.person.phone) line('Phone', report.person.phone)
    if (report.person.address) line('Address', report.person.address)
    y += 4

    // Violation
    section('VIOLATION DETAILS')
    line('Type', getViolationLabel(report.violationType))
    line('Description', report.description)
    y += 4

    // Location
    section('INCIDENT LOCATION')
    line('Address', report.address)
    line('GPS', `${report.coords.lat.toFixed(6)}, ${report.coords.lng.toFixed(6)}`)
    y += 4

    // Facility
    if (selectedFacility) {
      section('IDENTIFIED FACILITY')
      line('Name', selectedFacility.name)
      line('Address', `${selectedFacility.address}, ${selectedFacility.city}, ${selectedFacility.state}`)
      line('Distance', `${selectedFacility.distanceMiles.toFixed(2)} miles from incident`)
      line('Violations on record', selectedFacility.violationCount.toString())
      if (selectedFacility.permitIds.length > 0) line('Permit IDs', selectedFacility.permitIds.join(', '))
      y += 4
    }

    // Evidence
    section('EVIDENCE CAPTURED')
    capturedEvidence.forEach(e => {
      doc.text(`✓ ${e.label}`, 15, y)
      y += 6
    })
    line('Photos attached', `${report.photoDataUrls.length + totalEvidencePhotos}`)
    y += 4

    // Agencies
    if (y > 240) { doc.addPage(); y = 20 }
    section('AGENCIES NOTIFIED')
    report.agencies.forEach(a => {
      doc.setFont('helvetica', 'bold')
      doc.text(`• ${a.name} (${a.shortName})`, 15, y)
      y += 5
      doc.setFont('helvetica', 'normal')
      doc.text(`  ${a.jurisdiction} — Response within ${a.responseWindowHours}h`, 15, y)
      y += 7
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text(
        `EnviroReport · Case ${report.id} · Page ${i} of ${pageCount} · The complainant retains legal standing under applicable environmental statutes.`,
        15,
        290
      )
    }

    doc.save(`enviro-report-${report.id}.pdf`)
  }

  async function handleSubmit() {
    setSubmitting(true)
    onSubmit(report)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Review your complaint</h2>
          <p className="text-gray-500 mt-0.5 text-sm">Review everything before filing.</p>
        </div>
      </div>

      {/* Summary toggle */}
      <button
        onClick={() => setShowSummary(!showSummary)}
        className="w-full flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4"
      >
        <span className="font-semibold text-green-800">📋 Complaint Summary</span>
        {showSummary ? <ChevronUp size={18} className="text-green-600" /> : <ChevronDown size={18} className="text-green-600" />}
      </button>

      {showSummary && (
        <div className="space-y-4">
          {/* Complainant */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
              <User size={16} /> COMPLAINANT
            </div>
            <div className="font-semibold text-gray-900">{report.person.firstName} {report.person.lastName}</div>
            <div className="text-sm text-gray-500">{report.person.email}</div>
            {report.person.phone && <div className="text-sm text-gray-500">{report.person.phone}</div>}
          </div>

          {/* Violation */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
              <FileText size={16} /> VIOLATION
            </div>
            <div className="font-bold text-gray-900">{getViolationLabel(report.violationType)}</div>
            <p className="text-gray-600 text-sm mt-1">{report.description}</p>
          </div>

          {/* Location */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
              <MapPin size={16} /> LOCATION
            </div>
            <div className="font-semibold text-gray-900">{report.address}</div>
            <div className="text-sm text-gray-500 mt-0.5">{report.coords.lat.toFixed(5)}, {report.coords.lng.toFixed(5)}</div>
          </div>

          {/* Facility */}
          {selectedFacility && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                <Building2 size={16} /> IDENTIFIED FACILITY
              </div>
              <div className="font-semibold text-gray-900">{selectedFacility.name}</div>
              <div className="text-sm text-gray-500">{selectedFacility.city}, {selectedFacility.state} — {selectedFacility.distanceMiles.toFixed(2)} mi away</div>
              {selectedFacility.violationCount > 0 && (
                <div className="text-sm text-red-600 font-medium mt-1">⚠️ {selectedFacility.violationCount} prior violations on record</div>
              )}
            </div>
          )}

          {/* Evidence */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-500 mb-2">EVIDENCE</div>
            <div className="space-y-1">
              {capturedEvidence.map(e => (
                <div key={e.id} className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-green-600">✓</span> {e.label}
                  {(report.evidencePhotosByItem[e.id] || []).length > 0 && (
                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      {report.evidencePhotosByItem[e.id].length} photo{report.evidencePhotosByItem[e.id].length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {report.photoDataUrls.length + totalEvidencePhotos} total photo{report.photoDataUrls.length + totalEvidencePhotos !== 1 ? 's' : ''} attached
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
                    <div className="text-xs text-green-600 mt-0.5">Response expected within {a.responseWindowHours}h</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview toggle */}
      <button
        onClick={() => setShowPdfPreview(!showPdfPreview)}
        className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4"
      >
        <span className="font-semibold text-gray-700">📄 Preview complaint text</span>
        {showPdfPreview ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
      </button>

      {showPdfPreview && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-64">
            {reportText}
          </pre>
        </div>
      )}

      {/* Download options */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={downloadTxt}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all"
        >
          <Download size={15} />
          Download .txt
        </button>
        <button
          onClick={downloadPdf}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-green-200 text-green-700 font-medium text-sm hover:bg-green-50 transition-all"
        >
          <Download size={15} />
          Download PDF
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-4 rounded-xl font-bold text-white bg-green-700 hover:bg-green-800 disabled:opacity-60 transition-all flex items-center justify-center gap-2 text-lg"
      >
        {submitting ? (
          <><Loader2 size={20} className="animate-spin" /> Filing complaint...</>
        ) : (
          <><Send size={20} /> File complaint now</>
        )}
      </button>

      <p className="text-xs text-center text-gray-400">
        By submitting, you confirm this report is accurate to the best of your knowledge.
      </p>
    </div>
  )
}
