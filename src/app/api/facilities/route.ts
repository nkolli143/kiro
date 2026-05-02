import { NextRequest, NextResponse } from 'next/server'
import { EchoFacility } from '@/types'

// Haversine distance in miles
function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
  }

  try {
    // EPA ECHO API — real public data
    // Docs: https://echo.epa.gov/tools/web-services/facility-search
    // ECHO uses a two-step model: first get a QueryID, then fetch paginated results
    const radii = [10, 25, 50, 80]
    let results: Record<string, string>[] = []

    for (const radius of radii) {
      // Step 1: submit search, get QueryID
      const echoUrl = new URL('https://echodata.epa.gov/echo/echo_rest_services.get_facilities')
      echoUrl.searchParams.set('output', 'JSON')
      echoUrl.searchParams.set('p_lat', lat.toString())
      echoUrl.searchParams.set('p_long', lng.toString())
      echoUrl.searchParams.set('p_radius', radius.toString())
      echoUrl.searchParams.set('p_act', 'Y') // active facilities only — keeps count manageable
      echoUrl.searchParams.set('responseset', '100')

      const echoRes = await fetch(echoUrl.toString(), {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      })

      if (!echoRes.ok) {
        throw new Error(`EPA ECHO returned ${echoRes.status}`)
      }

      const echoData = await echoRes.json()
      const queryResults = echoData?.Results

      // ECHO returns a 200 with an error body when the queryset limit is exceeded
      if (queryResults?.Error) {
        console.warn(`ECHO queryset limit exceeded at ${radius} miles, trying larger radius...`)
        continue
      }

      const queryId = queryResults?.QueryID
      if (!queryId) {
        console.warn('No QueryID returned from ECHO')
        break
      }

      // Step 2: fetch the actual facility records using the QueryID
      const pageUrl = new URL('https://echodata.epa.gov/echo/echo_rest_services.get_qid')
      pageUrl.searchParams.set('output', 'JSON')
      pageUrl.searchParams.set('qid', queryId)
      pageUrl.searchParams.set('pageno', '1')
      pageUrl.searchParams.set('responseset', '100')

      const pageRes = await fetch(pageUrl.toString(), {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      })

      if (!pageRes.ok) {
        throw new Error(`EPA ECHO get_qid returned ${pageRes.status}`)
      }

      const pageData = await pageRes.json()
      results = pageData?.Results?.Facilities || []
      console.log(`ECHO returned ${results.length} facilities at ${radius} mile radius`)
      break
    }

    const facilities: EchoFacility[] = results
      .filter((f: Record<string, string>) => f.FacLat)
      .map((f: Record<string, string>) => {
        const fLat = parseFloat(f.FacLat)
        // ECHO API does not return FacLong in default columns — use search origin as fallback
        const fLng = f.FacLong ? parseFloat(f.FacLong) : lng

        // Build program list from individual program flags
        const programs: string[] = []
        if (f.AIRFlag === 'Y') programs.push('CAA')
        if (f.CWAComplianceTracking) programs.push('CWA')
        if (f.RCRAComplianceStatus) programs.push('RCRA')
        if (f.SDWAComplianceStatus) programs.push('SDWA')
        if (f.TRIFlag === 'Y') programs.push('TRI')

        return {
          id: f.RegistryID || f.FacilityID || String(Math.random()),
          name: f.FacName || 'Unknown Facility',
          address: f.FacStreet || '',
          city: f.FacCity || '',
          state: f.FacState || '',
          zip: f.FacZip || '',
          lat: fLat,
          lng: fLng,
          distanceMiles: f.FacLong ? distanceMiles(lat, lng, fLat, fLng) : -1,
          programs,
          violationCount: parseInt(f.FacPenaltyCount || '0', 10) || 0,
          lastInspection: f.FacDateLastInspection || null,
          permitIds: (f.FacPermitIds || '').split(',').filter(Boolean),
        } as EchoFacility
      })
      .sort((a: EchoFacility, b: EchoFacility) => {
        // Put facilities with known distance first, sorted ascending
        if (a.distanceMiles === -1 && b.distanceMiles === -1) return 0
        if (a.distanceMiles === -1) return 1
        if (b.distanceMiles === -1) return -1
        return a.distanceMiles - b.distanceMiles
      })
      .slice(0, 5)

    return NextResponse.json({ facilities })
  } catch (err) {
    console.error('EPA ECHO error:', err)
    // Return mock data so the demo still works if ECHO is down
    const mockFacilities: EchoFacility[] = [
      {
        id: 'MOCK-001',
        name: 'Riverside Industrial Processing LLC',
        address: '1200 Industrial Blvd',
        city: 'Demo City',
        state: 'CA',
        zip: '90210',
        lat: lat + 0.003,
        lng: lng + 0.002,
        distanceMiles: 0.3,
        programs: ['NPDES', 'CAA'],
        violationCount: 4,
        lastInspection: '2024-08-15',
        permitIds: ['CA0012345', 'AIR-2023-001'],
      },
      {
        id: 'MOCK-002',
        name: 'Valley Chemical Storage Co.',
        address: '450 Commerce Way',
        city: 'Demo City',
        state: 'CA',
        zip: '90211',
        lat: lat - 0.005,
        lng: lng + 0.004,
        distanceMiles: 0.7,
        programs: ['RCRA'],
        violationCount: 1,
        lastInspection: '2023-11-02',
        permitIds: ['RCRA-CA-0098765'],
      },
    ]
    return NextResponse.json({ facilities: mockFacilities, mock: true })
  }
}
