# Tasks: EPA Facility Lookup

## Implementation Tasks

- [x] 1. Implement two-step ECHO API flow in `/api/facilities/route.ts`
  - [x] 1.1 Call `get_facilities` to obtain `QueryID`
  - [x] 1.2 Detect `Results.Error` queryset limit response and retry with next radius
  - [x] 1.3 Call `get_qid` with `QueryID` to fetch facility records
  - [x] 1.4 Map ECHO fields to `EchoFacility` type

- [x] 2. Handle missing `FacLong` field
  - [x] 2.1 Remove `FacLong` from filter condition (was silently dropping all results)
  - [x] 2.2 Set `distanceMiles = -1` sentinel when longitude unavailable
  - [x] 2.3 Sort facilities with known distance first

- [x] 3. Fix program badge data
  - [x] 3.1 Derive programs from `AIRFlag`, `CWAComplianceTracking`, `RCRAComplianceStatus`, `SDWAComplianceStatus`, `TRIFlag`
  - [x] 3.2 Remove incorrect use of `FacActiveFlag` for programs

- [x] 4. Implement radius retry loop
  - [x] 4.1 Try radii [10, 25, 50, 80] in order
  - [x] 4.2 Break on first successful result set

- [x] 5. Update `FacilitiesStep.tsx` UI
  - [x] 5.1 Show distance only when `distanceMiles >= 0`
  - [x] 5.2 Update description text to "nearby" instead of hardcoded "20 miles"
  - [x] 5.3 Show amber mock data warning banner

- [x] 6. Preserve facility selection across back/forward navigation
  - [x] 6.1 Pass saved facilities state back into step on return navigation
