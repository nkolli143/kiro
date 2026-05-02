# Design: Complaint Form Navigation

## State Architecture

All form state lives in a single `ComplaintReport` object in `page.tsx`. Steps receive their current saved values as props and initialize their local state from those props — so navigating back re-mounts the component with the previously saved values.

```
page.tsx
  └── report: ComplaintReport   ← single source of truth
  └── savedPhotos: string[]     ← UploadStep-specific (photos are large, kept separate)
  └── savedViolationType        ← UploadStep-specific

  Each step:
    onComplete(data) → setReport(prev => ({ ...prev, ...data })) → setStep(next)
    onBack()         → setStep(prev)   ← no state change, report unchanged
```

## Per-Step State Restoration

### PersonStep
- Receives `initial: PersonInfo` and `language: string`
- Initializes `useState(initial)` — restores on back navigation

### UploadStep
- Receives `initialPhotos`, `initialViolationType`, `initialCoords`
- `page.tsx` stores `savedPhotos` and `savedViolationType` separately (not in `ComplaintReport`) because photos are large data URLs
- GPS coords stored in `report.coords` and passed back as `initialCoords`

### LocationStep
- Receives `coords` and `description` from `report`
- Already had initial prop support — no changes needed

### FacilitiesStep
- Stateless from navigation perspective — re-fetches from ECHO on mount
- Selected facility ID stored in `report.selectedFacilityId`

### EvidenceStep
- Receives `checklist` and `evidencePhotos` from `report`
- Initializes local state from props — restores on back navigation

### ReviewStep
- Read-only view of `report` — no local state to restore

## Step Indicator
- `StepIndicator` receives `current` step and `onStepClick` callback
- Steps with index < current index are rendered as clickable buttons
- `onStepClick` calls `goToStep(s)` in `page.tsx` which only changes `step` state — `report` is untouched
