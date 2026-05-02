# EnviroReport 🌿

**File legally structured environmental complaints in under 2 minutes.**

Turn a photo of illegal dumping, an unpermitted discharge, or excess emissions into a formal complaint routed to the correct agency — automatically.

## The problem it solves

Most environmental violations go unreported because the process is painful:
- Don't know which agency has jurisdiction
- Don't know what evidence to capture
- Don't know what happens after submitting
- Never hear back, so assume nothing happened

EnviroReport solves all four friction points.

## How it works

1. **Photo + violation type** — Upload your photo. GPS is extracted automatically from EXIF data.
2. **Location confirmed** — Reverse geocoded via OpenStreetMap. Nearby waterways identified.
3. **EPA ECHO lookup** — Real-time query of the EPA ECHO database finds permitted facilities within 5 miles, with their permit IDs, violation history, and last inspection date.
4. **Evidence guide** — Tells you exactly what additional photos to capture to make the complaint actionable.
5. **Agency routing** — Automatically routes to the correct state + federal agencies based on violation type and location.
6. **Report filed** — Structured complaint generated with a case ID. Follow-up triggered if no acknowledgment within the statutory window.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript + Tailwind CSS**
- **EPA ECHO API** — real public permit and violation data
- **Nominatim (OpenStreetMap)** — free geocoding, no API key needed
- **exifr** — GPS extraction from photo EXIF data

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No API keys required for the core demo. EPA ECHO and Nominatim are both free public APIs.

## Deploy to Vercel

```bash
npx vercel
```

## Data sources

- [EPA ECHO API](https://echo.epa.gov/tools/web-services) — facility permits, violations, inspections
- [Nominatim](https://nominatim.openstreetmap.org/) — reverse geocoding
- Agency routing covers CA and TX with full state/federal agency mapping; other states fall back to federal EPA offices

## Hackathon notes

Built for the Industrial Track. The core insight: citizens are legal complainants with standing under the Clean Water Act, Clean Air Act, and RCRA — not just concerned bystanders. The barrier isn't awareness, it's friction. This app removes the friction.
