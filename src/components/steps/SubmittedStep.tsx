'use client'

import { ComplaintReport } from '@/types'
import { CheckCircle2, Clock, Download, Share2 } from 'lucide-react'
import { formatReportText } from '@/lib/reportGenerator'

interface Props {
  report: ComplaintReport
  followUpAt: string | null
}

export default function SubmittedStep({ report, followUpAt }: Props) {
  const timeline = [
    {
      label: 'Complaint filed',
      time: new Date(report.createdAt).toLocaleString(),
      done: true,
      color: 'green',
    },
    {
      label: `Agency acknowledgment expected`,
      time: followUpAt ? `by ${new Date(followUpAt).toLocaleString()}` : 'within statutory window',
      done: false,
      color: 'blue',
    },
    {
      label: 'Automatic follow-up if no response',
      time: 'Triggered if no acknowledgment received',
      done: false,
      color: 'amber',
    },
    {
      label: 'Investigation / enforcement action',
      time: 'Timeline varies by agency',
      done: false,
      color: 'gray',
    },
  ]

  function downloadReport() {
    const text = formatReportText(report)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enviro-report-${report.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  function shareReport() {
    if (navigator.share) {
      navigator.share({
        title: `Environmental Complaint ${report.id}`,
        text: `I filed an environmental complaint (Case ID: ${report.id}) via EnviroReport.`,
      })
    } else {
      navigator.clipboard.writeText(report.id)
      alert('Case ID copied to clipboard: ' + report.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Complaint filed</h2>
        <p className="text-gray-500 mt-1">
          Your report has been submitted to {report.agencies.length} agenc{report.agencies.length !== 1 ? 'ies' : 'y'}.
        </p>
        <div className="mt-3 inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <span className="text-sm text-gray-500">Case ID: </span>
          <span className="font-mono font-bold text-green-700 text-lg">{report.id}</span>
        </div>
      </div>

      {/* Agencies notified */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-gray-500 mb-3">AGENCIES NOTIFIED</div>
        <div className="space-y-2">
          {report.agencies.map(a => (
            <div key={a.shortName} className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-gray-900">{a.shortName}</span>
                <span className="text-sm text-gray-500 ml-2">{a.name}</span>
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                Sent ✓
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-4">
          <Clock size={16} />
          WHAT HAPPENS NEXT
        </div>
        <div className="space-y-4">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${
                    item.done ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
                {i < timeline.length - 1 && (
                  <div className={`w-0.5 flex-1 mt-1 ${item.done ? 'bg-green-200' : 'bg-gray-100'}`} />
                )}
              </div>
              <div className="pb-4">
                <div className={`font-semibold text-sm ${item.done ? 'text-green-700' : 'text-gray-700'}`}>
                  {item.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={downloadReport}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-green-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition-all"
        >
          <Download size={16} />
          Download report
        </button>
        <button
          onClick={shareReport}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-green-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition-all"
        >
          <Share2 size={16} />
          Share case ID
        </button>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="w-full py-3 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800 transition-all"
      >
        File another complaint
      </button>

      <p className="text-xs text-center text-gray-400">
        Keep your case ID ({report.id}) for all future correspondence with agencies.
        You have standing as a complainant under applicable environmental statutes.
      </p>
    </div>
  )
}
