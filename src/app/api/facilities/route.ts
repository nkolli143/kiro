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
    const echoUrl = new URL('https://echodata.epa.gov/echo/echo_rest_services.get_facilities')
    echoUrl.searchParams.set('output', 'JSON')
    echoUrl.searchParams.set('p_lat', lat.toString())
    echoUrl.searchParams.set('p_long', lng.toString())
    echoUrl.searchParams.set('p_radius', '5') // 5 mile radius
    echoUrl.searchParams.set('p_act', 'Y') // active facilities only
    echoUrl.searchParams.set('responseset', '10')

    const echoRes = await fetch(echoUrl.toString(), {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })

    if (!echoRes.ok) {
      throw new Error(`EPA ECHO returned ${echoRes.status}`)
    }

    const echoData = await echoRes.json()
    const results = echoData?.Results?.Facilities || []

    const facilities: EchoFacility[] = results
      .filter((f: Record<string, string>) => f.FacLat && f.FacLong)
      .map((f: Record<string, string>) => {
        const fLat = parseFloat(f.FacLat)
        const fLng = parseFloat(f.FacLong)
        return {
          id: f.RegistryID || f.FacilityID || String(Math.random()),
          name: f.FacName || 'Unknown Facility',
          address: f.FacStreet || '',
          city: f.FacCity || '',
          state: f.FacState || '',
          zip: f.FacZip || '',
          lat: fLat,
          lng: fLng,
          distanceMiles: distanceMiles(lat, lng, fLat, fLng),
          programs: (f.FacActiveFlag || '').split(',').filter(Boolean),
          violationCount: parseInt(f.FacTotalPenalties || '0', 10) || 0,
          lastInspection: f.FacDateLastInspection || null,
          permitIds: (f.FacPermitIds || '').split(',').filter(Boolean),
        } as EchoFacility
      })
      .sort((a: EchoFacility, b: EchoFacility) => a.distanceMiles - b.distanceMiles)
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
