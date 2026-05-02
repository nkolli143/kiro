import { Agency, ViolationType } from '@/types'

// Maps violation type + state to the correct agencies
// In production this would be a full 50-state database
const STATE_AGENCIES: Record<string, Record<string, Agency[]>> = {
  CA: {
    water_discharge: [
      {
        name: 'State Water Resources Control Board',
        shortName: 'SWRCB',
        email: 'complaints@waterboards.ca.gov',
        jurisdiction: 'California water quality enforcement',
        responseWindowHours: 72,
      },
      {
        name: 'EPA Region 9',
        shortName: 'EPA R9',
        email: 'r9.enforcement@epa.gov',
        jurisdiction: 'Federal Clean Water Act enforcement',
        responseWindowHours: 120,
      },
    ],
    air_emissions: [
      {
        name: 'California Air Resources Board',
        shortName: 'CARB',
        email: 'complaints@arb.ca.gov',
        jurisdiction: 'California air quality enforcement',
        responseWindowHours: 72,
      },
      {
        name: 'EPA Region 9',
        shortName: 'EPA R9',
        email: 'r9.enforcement@epa.gov',
        jurisdiction: 'Federal Clean Air Act enforcement',
        responseWindowHours: 120,
      },
    ],
    illegal_dumping: [
      {
        name: 'California Department of Toxic Substances Control',
        shortName: 'DTSC',
        email: 'complaints@dtsc.ca.gov',
        jurisdiction: 'Hazardous waste enforcement',
        responseWindowHours: 48,
      },
      {
        name: 'EPA Region 9',
        shortName: 'EPA R9',
        email: 'r9.enforcement@epa.gov',
        jurisdiction: 'Federal RCRA enforcement',
        responseWindowHours: 120,
      },
    ],
    other: [
      {
        name: 'EPA Region 9',
        shortName: 'EPA R9',
        email: 'r9.enforcement@epa.gov',
        jurisdiction: 'General federal environmental enforcement',
        responseWindowHours: 120,
      },
    ],
  },
  TX: {
    water_discharge: [
      {
        name: 'Texas Commission on Environmental Quality',
        shortName: 'TCEQ',
        email: 'complaints@tceq.texas.gov',
        jurisdiction: 'Texas water quality enforcement',
        responseWindowHours: 72,
      },
      {
        name: 'EPA Region 6',
        shortName: 'EPA R6',
        email: 'r6.enforcement@epa.gov',
        jurisdiction: 'Federal Clean Water Act enforcement',
        responseWindowHours: 120,
      },
    ],
    air_emissions: [
      {
        name: 'Texas Commission on Environmental Quality',
        shortName: 'TCEQ',
        email: 'complaints@tceq.texas.gov',
        jurisdiction: 'Texas air quality enforcement',
        responseWindowHours: 72,
      },
      {
        name: 'EPA Region 6',
        shortName: 'EPA R6',
        email: 'r6.enforcement@epa.gov',
        jurisdiction: 'Federal Clean Air Act enforcement',
        responseWindowHours: 120,
      },
    ],
    illegal_dumping: [
      {
        name: 'Texas Commission on Environmental Quality',
        shortName: 'TCEQ',
        email: 'complaints@tceq.texas.gov',
        jurisdiction: 'Texas hazardous waste enforcement',
        responseWindowHours: 48,
      },
    ],
    other: [
      {
        name: 'EPA Region 6',
        shortName: 'EPA R6',
        email: 'r6.enforcement@epa.gov',
        jurisdiction: 'General federal environmental enforcement',
        responseWindowHours: 120,
      },
    ],
  },
}

const DEFAULT_AGENCIES: Record<ViolationType, Agency[]> = {
  water_discharge: [
    {
      name: 'EPA Office of Water Enforcement',
      shortName: 'EPA OWE',
      email: 'OW-Enforcement@epa.gov',
      jurisdiction: 'Federal Clean Water Act enforcement',
      responseWindowHours: 120,
    },
  ],
  air_emissions: [
    {
      name: 'EPA Office of Air and Radiation',
      shortName: 'EPA OAR',
      email: 'OAR-Enforcement@epa.gov',
      jurisdiction: 'Federal Clean Air Act enforcement',
      responseWindowHours: 120,
    },
  ],
  illegal_dumping: [
    {
      name: 'EPA Office of Land and Emergency Management',
      shortName: 'EPA OLEM',
      email: 'OLEM-Enforcement@epa.gov',
      jurisdiction: 'Federal RCRA / Superfund enforcement',
      responseWindowHours: 120,
    },
  ],
  other: [
    {
      name: 'EPA National Enforcement and Compliance Assurance',
      shortName: 'EPA NECA',
      email: 'enforcement@epa.gov',
      jurisdiction: 'General federal environmental enforcement',
      responseWindowHours: 120,
    },
  ],
}

export function getAgencies(state: string, violationType: ViolationType): Agency[] {
  const stateAgencies = STATE_AGENCIES[state.toUpperCase()]
  if (stateAgencies && stateAgencies[violationType]) {
    return stateAgencies[violationType]
  }
  return DEFAULT_AGENCIES[violationType]
}
