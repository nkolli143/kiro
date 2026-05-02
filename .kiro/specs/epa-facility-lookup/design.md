# Design: EPA Facility Lookup

## Architecture

### Two-Step ECHO API Flow
The EPA ECHO API does not return facility records directly. It uses a two-step model:

1. **Step 1 — `get_facilities`**: Submit search parameters (lat, lng, radius). Returns a `QueryID` and metadata (row count, totals). Does NOT return facility records.
2. **Step 2 — `get_qid`**: Fetch paginated facility records using the `QueryID`.

```
Client → GET /api/facilities?lat=X&lng=Y
           ↓
       get_facilities (ECHO) → QueryID
           ↓
       get_qid (ECHO) → Facilities[]
           ↓
       Map + sort + slice(5)
           ↓
       { facilities: EchoFacility[] }
```

### Radius Retry Loop
```typescript
const radii = [10, 25, 50, 80]
for (const radius of radii) {
  // Step 1: get QueryID
  // If Results.Error → continue (queryset limit hit)
  // If no QueryID → break (unexpected response)
  // Step 2: get records via QueryID
  // On success → break
}
```

### Known ECHO API Limitations
- `FacLong` is **not** included in ECHO's default response columns — only `FacLat` is returned
- When longitude is missing, `distanceMiles` is set to `-1` (sentinel value meaning "unknown")
- The UI renders distance as blank when `distanceMiles < 0`
- Program flags must be derived from individual fields (`AIRFlag`, `RCRAComplianceStatus`, etc.) not `FacActiveFlag`

### Data Mapping
```typescript
// Programs derived from flags
if (f.AIRFlag === 'Y')          programs.push('CAA')
if (f.CWAComplianceTracking)    programs.push('CWA')
if (f.RCRAComplianceStatus)     programs.push('RCRA')
if (f.SDWAComplianceStatus)     programs.push('SDWA')
if (f.TRIFlag === 'Y')          programs.push('TRI')
```

## Component Design

### `FacilitiesStep.tsx`
- Fetches from `/api/facilities?lat=&lng=` on mount
- Shows loading spinner during fetch
- Shows amber banner if `data.mock === true`
- Shows "No permitted facilities found nearby" if empty
- Each facility card: name, address+city+state, distance (if known), program badges, violation count, last inspection

### `/api/facilities/route.ts`
- Validates `lat` and `lng` query params
- Runs the two-step ECHO flow with radius retry
- Falls back to 2 mock facilities on any unhandled error
- Returns `{ facilities: EchoFacility[], mock?: true }`

## Caching
- ECHO responses cached for 1 hour via `next: { revalidate: 3600 }`
- Prevents hammering ECHO during development and demo
