import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 })
  }

  try {
    // Nominatim — free, no API key required
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'EnviroReport/1.0 (hackathon project)',
        Accept: 'application/json',
      },
    })

    if (!res.ok) throw new Error('Nominatim failed')

    const data = await res.json()
    const addr = data.address || {}

    const parts = [
      addr.house_number,
      addr.road,
      addr.city || addr.town || addr.village || addr.county,
      addr.state,
      addr.postcode,
    ].filter(Boolean)

    return NextResponse.json({
      address: parts.join(', ') || data.display_name || `${lat}, ${lng}`,
      state: addr.state_code || addr.state || '',
      waterway: addr.waterway || addr.water || addr.natural || null,
      raw: data.display_name,
    })
  } catch (err) {
    console.error('Geocode error:', err)
    return NextResponse.json({
      address: `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`,
      state: '',
      waterway: null,
      raw: '',
    })
  }
}
