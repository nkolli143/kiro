import { ComplaintReport } from '@/types'
import { getViolationLabel } from './evidenceGuide'

export function generateCaseId(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `ER-${dateStr}-${rand}`
}

export function formatReportText(report: ComplaintReport): string {
  const violationLabel = getViolationLabel(report.violationType)
  const date = new Date(report.createdAt).toLocaleString()

  const facilityInfo = report.nearbyFacilities.find(f => f.id === report.selectedFacilityId)
  const totalPhotos = report.photoDataUrls.length + Object.values(report.evidencePhotosByItem || {}).flat().length

  let text = `ENVIRONMENTAL VIOLATION COMPLAINT
Case ID: ${report.id}
Filed: ${date}
Language: ${report.language}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLAINANT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${report.person.firstName} ${report.person.lastName}
Email: ${report.person.email}
${report.person.phone ? `Phone: ${report.person.phone}\n` : ''}${report.person.address ? `Address: ${report.person.address}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VIOLATION TYPE: ${violationLabel}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOCATION
Address: ${report.address}
GPS Coordinates: ${report.coords.lat.toFixed(6)}, ${report.coords.lng.toFixed(6)}
Google Maps: https://maps.google.com/?q=${report.coords.lat},${report.coords.lng}

DESCRIPTION
${report.description}

`

  if (facilityInfo) {
    text += `IDENTIFIED FACILITY
Name: ${facilityInfo.name}
Address: ${facilityInfo.address}, ${facilityInfo.city}, ${facilityInfo.state} ${facilityInfo.zip}
Distance from incident: ${facilityInfo.distanceMiles.toFixed(2)} miles
EPA Programs: ${facilityInfo.programs.join(', ')}
Known violations on record: ${facilityInfo.violationCount}
Last inspection: ${facilityInfo.lastInspection || 'Not on record'}
Permit IDs: ${facilityInfo.permitIds.join(', ') || 'None found'}

`
  }

  text += `EVIDENCE COLLECTED (${totalPhotos} photos attached)
${report.evidenceChecklist
    .filter(e => e.captured)
    .map(e => `✓ ${e.label}`)
    .join('\n')}
${report.evidenceChecklist
    .filter(e => !e.captured && e.required)
    .map(e => `✗ ${e.label} (required — not yet captured)`)
    .join('\n')}

AGENCIES NOTIFIED
${report.agencies.map(a => `• ${a.name} (${a.shortName})\n  Jurisdiction: ${a.jurisdiction}\n  Response window: ${a.responseWindowHours} hours`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This complaint was filed via EnviroReport.
The complainant retains standing under applicable environmental statutes.
Reference case ID ${report.id} in all correspondence.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

  return text
}
