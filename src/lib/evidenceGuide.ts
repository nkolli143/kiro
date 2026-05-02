import { EvidenceItem, ViolationType } from '@/types'

const EVIDENCE_GUIDES: Record<ViolationType, EvidenceItem[]> = {
  water_discharge: [
    {
      id: 'wide_shot',
      label: 'Wide shot of the discharge area',
      description: 'Capture the full scene — pipe, waterway, and surrounding area in one frame.',
      required: true,
      captured: false,
    },
    {
      id: 'close_up_discharge',
      label: 'Close-up of the discharge point',
      description: 'Get as close as safely possible to show the pipe opening and any discoloration.',
      required: true,
      captured: false,
    },
    {
      id: 'water_color',
      label: 'Water color / foam / sheen',
      description: 'Photograph any unusual color, foam, oil sheen, or odor indicators in the water.',
      required: true,
      captured: false,
    },
    {
      id: 'upstream_downstream',
      label: 'Upstream vs. downstream comparison',
      description: 'One photo upstream (clean) and one downstream (affected) to show the impact.',
      required: false,
      captured: false,
    },
    {
      id: 'signage',
      label: 'Any facility signage or markings',
      description: 'Photograph any company names, permit numbers, or warning signs visible.',
      required: false,
      captured: false,
    },
  ],
  air_emissions: [
    {
      id: 'smokestack_wide',
      label: 'Wide shot of smokestack and facility',
      description: 'Capture the full facility with the smokestack clearly visible.',
      required: true,
      captured: false,
    },
    {
      id: 'smoke_color',
      label: 'Close-up of smoke color and density',
      description: 'Photograph the smoke as close as possible. Note: black/brown smoke is more likely a violation than white steam.',
      required: true,
      captured: false,
    },
    {
      id: 'wind_direction',
      label: 'Wind direction indicator',
      description: 'Photo of trees, flags, or anything showing which way the wind is blowing.',
      required: true,
      captured: false,
    },
    {
      id: 'facility_signage',
      label: 'Facility name / signage',
      description: 'Any visible company name, address, or permit numbers on the facility.',
      required: false,
      captured: false,
    },
    {
      id: 'affected_area',
      label: 'Affected surrounding area',
      description: 'Show any visible fallout, residue, or affected vegetation near the facility.',
      required: false,
      captured: false,
    },
  ],
  illegal_dumping: [
    {
      id: 'dump_site_wide',
      label: 'Wide shot of the dump site',
      description: 'Capture the full extent of the dumped material and surrounding area.',
      required: true,
      captured: false,
    },
    {
      id: 'material_close_up',
      label: 'Close-up of dumped materials',
      description: 'Photograph the materials clearly. Do NOT touch or disturb them.',
      required: true,
      captured: false,
    },
    {
      id: 'identifying_info',
      label: 'Any identifying information',
      description: 'Labels, barcodes, company names, or serial numbers on containers or materials.',
      required: true,
      captured: false,
    },
    {
      id: 'access_point',
      label: 'Access point / tire tracks',
      description: 'How did they get here? Photograph any vehicle tracks, access roads, or entry points.',
      required: false,
      captured: false,
    },
    {
      id: 'nearby_waterway',
      label: 'Proximity to waterway or drain',
      description: 'If near a waterway or storm drain, photograph that proximity — it escalates the violation.',
      required: false,
      captured: false,
    },
  ],
  other: [
    {
      id: 'overview',
      label: 'Overview photo of the incident',
      description: 'Wide shot capturing the full scene.',
      required: true,
      captured: false,
    },
    {
      id: 'detail',
      label: 'Detail photo of the violation',
      description: 'Close-up showing the specific issue.',
      required: true,
      captured: false,
    },
    {
      id: 'context',
      label: 'Contextual photo',
      description: 'Any signage, facility names, or surrounding context.',
      required: false,
      captured: false,
    },
  ],
}

export function getEvidenceGuide(violationType: ViolationType): EvidenceItem[] {
  return EVIDENCE_GUIDES[violationType].map(item => ({ ...item }))
}

export function getViolationLabel(type: ViolationType): string {
  const labels: Record<ViolationType, string> = {
    water_discharge: 'Unpermitted Water Discharge',
    air_emissions: 'Excess Air Emissions',
    illegal_dumping: 'Illegal Dumping',
    other: 'Environmental Violation',
  }
  return labels[type]
}
