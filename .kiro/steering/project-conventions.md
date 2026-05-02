---
inclusion: always
---

# File for Earth — Project Conventions

## Project Overview
File for Earth is a Next.js 14 app that lets citizens file structured environmental complaints in under 2 minutes. It uses the EPA ECHO public API to look up nearby permitted facilities and routes complaints to the correct federal/state agencies.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Key APIs**: EPA ECHO (facility lookup), Nominatim (geocoding), exifr (EXIF/GPS extraction)

## Code Conventions

### API Routes
- All API routes live in `src/app/api/`
- Routes must handle errors gracefully and return mock/fallback data rather than 500s — the app must always be demo-able
- External fetch calls should use `next: { revalidate: 3600 }` for caching
- Always validate query params and return `{ error: '...' }` with appropriate status codes for bad input

### Components
- Step components live in `src/components/steps/`
- Each step component receives its current saved state as props so back/forward navigation preserves data
- Use Tailwind utility classes only — no inline styles
- Use `lucide-react` for icons

### Types
- All shared types are in `src/types/index.ts`
- Always use the `EchoFacility`, `ComplaintReport`, `PersonInfo`, and `GPSCoords` types — never redefine them inline

### EPA ECHO API
- ECHO uses a two-step query model: `get_facilities` returns a `QueryID`, then `get_qid` fetches the actual records
- `FacLong` is NOT returned in ECHO's default response — handle missing longitude gracefully
- Start with a 10-mile radius and expand to 25 → 50 → 80 miles if ECHO's queryset limit is exceeded
- ECHO returns a 200 with `Results.Error` body (not an HTTP error) when the queryset limit is hit

### Styling Philosophy
- Dark nav (`bg-gray-900`) with green accents (`bg-green-500`)
- Use real environmental hazard photos from Unsplash for visual impact — not emoji or generic illustrations
- Cards use `rounded-2xl` with `shadow-sm border border-gray-100`
- Primary action buttons: `bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl`
