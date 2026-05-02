# Requirements: Complaint Form Navigation

## Overview
The multi-step complaint form must preserve all user-entered data when navigating back and forward between steps, so users never lose their work.

## User Stories

### US-1: Back Navigation Preserves Data
**As a** user who has filled out multiple steps,  
**I want** my data to still be there when I go back to a previous step,  
**So that** I don't have to re-enter information I already provided.

**Acceptance Criteria:**
- Photos uploaded in the Upload step are still present after going back from Location
- Violation type selection is preserved after going back
- GPS coordinates detected from photos are preserved
- Location address and description are preserved after going back from Facilities
- Evidence checklist state and photos are preserved after going back from Review

### US-2: Forward Navigation Preserves Data
**As a** user who went back to correct something,  
**I want** my previously entered data in later steps to still be there,  
**So that** I only need to change what I went back to fix.

**Acceptance Criteria:**
- Navigating forward after going back restores all previously entered data
- The step indicator shows completed steps as clickable

### US-3: Step Indicator Navigation
**As a** user,  
**I want** to click on completed step indicators to jump back to them,  
**So that** I can quickly review or edit earlier information.

**Acceptance Criteria:**
- Completed steps (shown with checkmark) are clickable
- Clicking a completed step navigates to it without losing data
- Future/incomplete steps are not clickable

## Correctness Properties

### P-1: Data monotonicity
Navigating back then forward must result in the same data state as never having navigated back, unless the user explicitly changed a field.

### P-2: No data loss on step click
Clicking a completed step in the indicator must not reset any part of the report state.
