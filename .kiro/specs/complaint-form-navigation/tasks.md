# Tasks: Complaint Form Navigation

- [x] 1. Add saved state for UploadStep in `page.tsx`
  - [x] 1.1 Add `savedPhotos: string[]` state
  - [x] 1.2 Add `savedViolationType: ViolationType | null` state
  - [x] 1.3 Persist both in `handleUploadComplete`

- [x] 2. Update `UploadStep` props interface
  - [x] 2.1 Add `initialPhotos`, `initialViolationType`, `initialCoords` optional props
  - [x] 2.2 Initialize `useState` from props instead of empty defaults
  - [x] 2.3 Set initial `gpsStatus` to `'found'` when `initialCoords` is provided

- [x] 3. Pass saved state back into `UploadStep` from `page.tsx`
  - [x] 3.1 Pass `initialPhotos={savedPhotos}`
  - [x] 3.2 Pass `initialViolationType={savedViolationType}`
  - [x] 3.3 Pass `initialCoords` from `report.coords`

- [x] 4. Verify `LocationStep` already restores from props
  - [x] 4.1 Confirm `coords` and `description` props initialize local state correctly

- [x] 5. Verify `EvidenceStep` already restores from props
  - [x] 5.1 Confirm `checklist` and `evidencePhotos` props initialize local state correctly
