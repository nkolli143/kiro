import { NextRequest, NextResponse } from 'next/server'
import { ComplaintReport } from '@/types'
import { formatReportText } from '@/lib/reportGenerator'

// In production this would send real emails via SendGrid/Resend
// For the hackathon demo it logs the report and returns success
export async function POST(req: NextRequest) {
  try {
    const report: ComplaintReport = await req.json()

    const reportText = formatReportText(report)

    // Log the full report (visible in server console during demo)
    console.log('\n========== ENVIRO REPORT SUBMITTED ==========')
    console.log(reportText)
    console.log('=============================================\n')

    // Calculate follow-up time based on shortest agency response window
    const minWindow = Math.min(...report.agencies.map(a => a.responseWindowHours))
    const followUpAt = new Date(Date.now() + minWindow * 60 * 60 * 1000).toISOString()

    return NextResponse.json({
      success: true,
      caseId: report.id,
      followUpAt,
      agenciesNotified: report.agencies.map(a => a.shortName),
      message: `Your complaint (Case ID: ${report.id}) has been filed with ${report.agencies.length} agenc${report.agencies.length === 1 ? 'y' : 'ies'}. You will receive acknowledgment within ${minWindow} hours.`,
    })
  } catch (err) {
    console.error('Submit error:', err)
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
  }
}
