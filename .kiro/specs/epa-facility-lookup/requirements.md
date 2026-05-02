# Requirements: EPA Facility Lookup

## Overview
When a user confirms an incident location, the app queries the EPA ECHO database for nearby permitted facilities and presents them as selectable options to link to the complaint.

## User Stories

### US-1: Facility Search by Location
**As a** citizen filing a complaint,  
**I want** to see EPA-permitted facilities near my incident location,  
**So that** I can identify the likely source of the violation and link it to my complaint.

**Acceptance Criteria:**
- Given valid GPS coordinates, the system queries EPA ECHO for nearby facilities
- Results are displayed within 5 seconds
- Up to 5 facilities are shown, sorted by distance
- Each facility shows: name, address, distance, permit programs, violation count, last inspection date

### US-2: Radius Fallback
**As a** user in a densely regulated area (e.g. Bay Area),  
**I want** the search to automatically adjust its radius,  
**So that** I always get results even when the EPA queryset limit is hit.

**Acceptance Criteria:**
- Search starts at 10 miles and expands to 25 → 50 → 80 miles
- If ECHO returns a queryset limit error (200 with `Results.Error`), the next radius is tried automatically
- The UI always shows results or a clear "none found" message — never a blank error state

### US-3: Facility Selection
**As a** complainant,  
**I want** to select the facility I believe is responsible,  
**So that** it is included in the formal complaint with its permit IDs and violation history.

**Acceptance Criteria:**
- User can select one facility or choose "None of these / Unknown source"
- Selected facility's permit IDs and violation count are included in the generated report
- Selection persists if the user navigates back and forward

### US-4: Graceful Fallback
**As a** user when the EPA ECHO API is unavailable,  
**I want** the app to still function with demo data,  
**So that** the app is always demo-able regardless of API status.

**Acceptance Criteria:**
- If ECHO API fails, return 2 realistic mock facilities
- Show an amber warning banner: "Using demo data — EPA ECHO API unavailable"
- Mock data uses the user's actual coordinates so distance calculations are realistic

## Correctness Properties

### P-1: No silent empty results
The facility list must never be empty due to a filtering bug. If ECHO returns records, at least one must be displayed.

### P-2: Radius monotonicity
Each retry must use a strictly larger radius than the previous attempt.

### P-3: Fallback always fires
If all ECHO requests fail or return errors, mock data must always be returned — the API route must never return `{ facilities: [] }` with no mock flag.
