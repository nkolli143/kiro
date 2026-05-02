'use client'

import { useState } from 'react'
import { MapPin, AlertTriangle, Droplets, Wind, Trash2, ExternalLink } from 'lucide-react'

const HOTSPOTS = [
  {
    id: 1,
    name: 'Cancer Alley',
    location: 'Louisiana (St. James to Baton Rouge)',
    state: 'LA',
    type: 'air',
    severity: 'critical',
    description:
      'An 85-mile stretch along the Mississippi River between Baton Rouge and New Orleans is home to over 150 petrochemical plants and refineries. Residents — predominantly Black — face cancer rates up to 50 times the national average in some census tracts.',
    stats: ['150+ petrochemical facilities', 'Cancer risk 50x national average in some areas', '95%+ Black population in most affected parishes'],
    image: '🏭',
    link: 'https://www.propublica.org/article/welcome-to-cancer-alley-where-toxic-air-is-about-to-get-worse',
  },
  {
    id: 2,
    name: 'Kettleman City',
    location: 'Kings County, California',
    state: 'CA',
    type: 'air',
    severity: 'critical',
    description:
      'A small, predominantly Latino farming community surrounded by industrial facilities including the largest hazardous waste landfill west of the Mississippi. Residents report elevated cancer rates and birth defects. The community has been fighting Chemical Waste Management\'s facility for decades.',
    stats: ['Largest hazardous waste landfill west of Mississippi', '95% Latino population', 'Reported cancer rates 3x state average'],
    image: '🌾',
    link: 'https://www.cbecal.org/campaigns/kettleman-city/',
  },
  {
    id: 3,
    name: 'Navajo Nation Uranium Mines',
    location: 'Arizona, New Mexico, Utah',
    state: 'AZ',
    type: 'dumping',
    severity: 'critical',
    description:
      'Over 500 abandoned uranium mines on Navajo Nation land continue to contaminate water and soil with radioactive material. The mines operated from the 1940s–1980s. Cleanup has been ongoing for decades with limited progress. Residents still use contaminated water sources.',
    stats: ['500+ abandoned uranium mines', 'Cleanup ongoing since 1990s', '30% of Navajo homes lack clean water access'],
    image: '☢️',
    link: 'https://www.epa.gov/navajo-nation-uranium-cleanup',
  },
  {
    id: 4,
    name: 'Flint, Michigan',
    location: 'Genesee County, Michigan',
    state: 'MI',
    type: 'water',
    severity: 'critical',
    description:
      'In 2014, the city switched its water source to the Flint River to save money. Corrosive water leached lead from aging pipes into the drinking supply. State officials knew and concealed the contamination. Over 100,000 residents — predominantly Black — were exposed to elevated lead levels.',
    stats: ['100,000+ residents exposed to lead', 'Lead levels up to 13,000 ppb (EPA limit: 15 ppb)', '12 deaths from Legionnaires\' disease linked to the crisis'],
    image: '🚰',
    link: 'https://www.michigan.gov/flintwater',
  },
  {
    id: 5,
    name: 'Superfund Sites — Houston Ship Channel',
    location: 'Harris County, Texas',
    state: 'TX',
    type: 'water',
    severity: 'critical',
    description:
      'The Houston Ship Channel is one of the most industrialized waterways in the US, lined with refineries, chemical plants, and Superfund sites. Surrounding communities — largely Latino and Black — face some of the highest cumulative pollution burdens in the country.',
    stats: ['40+ Superfund sites in Harris County', 'Highest cumulative cancer risk in Texas', '2M+ people in the affected airshed'],
    image: '⚓',
    link: 'https://www.epa.gov/superfund/superfund-sites-where-you-live',
  },
  {
    id: 6,
    name: 'East Chicago Lead Contamination',
    location: 'Lake County, Indiana',
    state: 'IN',
    type: 'dumping',
    severity: 'critical',
    description:
      'Residents of the West Calumet Housing Complex lived on top of a former lead smelter Superfund site for decades without being told. In 2016, soil tests revealed lead levels up to 100 times the EPA\'s hazard threshold. Hundreds of families — mostly Black and Latino — were displaced.',
    stats: ['Lead levels 100x EPA hazard threshold', '1,100 families displaced', 'Site contaminated since 1920s'],
    image: '🏘️',
    link: 'https://www.epa.gov/superfund/USS-Lead-Refinery',
  },
  {
    id: 7,
    name: 'Appalachian Coal Ash Ponds',
    location: 'Tennessee, Virginia, West Virginia',
    state: 'TN',
    type: 'water',
    severity: 'high',
    description:
      'Coal ash — the toxic residue from burning coal — is stored in unlined ponds across Appalachia. The 2008 Kingston TVA spill released 5.4 million cubic yards of coal ash into the Emory River. Cleanup workers developed cancers at alarming rates. Hundreds of similar ponds remain.',
    stats: ['5.4M cubic yards spilled in 2008 Kingston disaster', '40+ cleanup workers died of cancer', '1,400+ coal ash ponds nationwide'],
    image: '⚫',
    link: 'https://www.epa.gov/coalash',
  },
  {
    id: 8,
    name: 'Mossville, Louisiana',
    location: 'Calcasieu Parish, Louisiana',
    state: 'LA',
    type: 'air',
    severity: 'high',
    description:
      'A historically Black community founded by freed slaves, Mossville was surrounded by 14 industrial facilities including vinyl chloride plants. Residents had dioxin levels 3x the national average. Most of the community has been bought out and relocated — the town effectively no longer exists.',
    stats: ['14 industrial facilities surrounding the community', 'Dioxin levels 3x national average', 'Community effectively eliminated by industrial buyout'],
    image: '🏚️',
    link: 'https://www.cbecal.org/',
  },
  {
    id: 9,
    name: 'Hinkley Groundwater Contamination',
    location: 'San Bernardino County, California',
    state: 'CA',
    type: 'water',
    severity: 'high',
    description:
      'Pacific Gas & Electric contaminated the groundwater in Hinkley with hexavalent chromium (chromium-6) from a compressor station. The case was made famous by Erin Brockovich. PG&E paid $333M in 1996 — the largest settlement in a direct-action lawsuit in US history at the time.',
    stats: ['$333M settlement (1996)', 'Chromium-6 plume still expanding', 'Contamination ongoing since 1950s'],
    image: '💧',
    link: 'https://www.waterboards.ca.gov/rwqcb6/water_issues/programs/hinkley/',
  },
  {
    id: 10,
    name: 'Anniston PCB Contamination',
    location: 'Calhoun County, Alabama',
    state: 'AL',
    type: 'dumping',
    severity: 'high',
    description:
      'Monsanto produced PCBs in Anniston for decades, dumping waste in open-pit landfills and discharging into local creeks. Internal documents showed the company knew about the contamination and concealed it. Residents — predominantly Black — had PCB levels 27x the national average.',
    stats: ['PCB levels 27x national average in residents', '$700M Solutia settlement (2003)', 'Contamination documented since 1960s'],
    image: '🧪',
    link: 'https://www.epa.gov/superfund/anniston-pcb',
  },
  {
    id: 11,
    name: 'Navajo Generating Station Fallout',
    location: 'Page, Arizona',
    state: 'AZ',
    type: 'air',
    severity: 'high',
    description:
      'The Navajo Generating Station, one of the largest coal plants in the US, operated near the Grand Canyon and Navajo Nation for decades. It was the single largest source of nitrogen oxide pollution in the Southwest, contributing to haze over the Grand Canyon and respiratory illness in surrounding communities.',
    stats: ['Largest coal plant in the western US (closed 2019)', 'Largest single source of NOx in the Southwest', 'Navajo Nation workers exposed for 50+ years'],
    image: '🌵',
    link: 'https://www.epa.gov/region9/navajo-generating-station',
  },
  {
    id: 12,
    name: 'East Palestine Train Derailment',
    location: 'Columbiana County, Ohio',
    state: 'OH',
    type: 'dumping',
    severity: 'high',
    description:
      'In February 2023, a Norfolk Southern freight train carrying vinyl chloride and other hazardous chemicals derailed and caught fire. A controlled burn released toxic dioxins into the air and soil. Residents reported dead fish, sick animals, and health symptoms. Long-term contamination is still being assessed.',
    stats: ['50 cars derailed, 11 carrying hazardous materials', 'Vinyl chloride burned in controlled release', 'Dioxin contamination radius still being assessed (2023)'],
    image: '🚂',
    link: 'https://www.epa.gov/east-palestine-oh-train-derailment',
  },
]

const TYPE_ICONS: Record<string, React.ReactNode> = {
  water: <Droplets size={14} />,
  air: <Wind size={14} />,
  dumping: <Trash2 size={14} />,
}

const TYPE_COLORS: Record<string, string> = {
  water: 'bg-blue-100 text-blue-700',
  air: 'bg-gray-100 text-gray-700',
  dumping: 'bg-orange-100 text-orange-700',
}

const SEVERITY_BORDER: Record<string, string> = {
  critical: 'border-red-200',
  high: 'border-orange-200',
}

export default function HotspotsPage() {
  const [filter, setFilter] = useState<'all' | 'water' | 'air' | 'dumping'>('all')
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = filter === 'all' ? HOTSPOTS : HOTSPOTS.filter(h => h.type === filter)

  return (
    <div className="w-full px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">US Pollution Hotspots</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          The most severely contaminated communities in the United States — documented by the EPA, investigative journalists,
          and environmental justice organizations. Many are the direct result of regulatory failure and environmental racism.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'water', 'air', 'dumping'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
              filter === f
                ? 'bg-green-700 text-white border-green-700'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
            }`}
          >
            {f === 'all' ? 'All types' : f === 'water' ? '💧 Water' : f === 'air' ? '💨 Air' : '🗑️ Dumping'}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400 self-center">{filtered.length} locations</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(spot => (
          <div
            key={spot.id}
            className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${SEVERITY_BORDER[spot.severity]}`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{spot.image}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{spot.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={11} />
                      {spot.location}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end flex-shrink-0">
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[spot.type]}`}>
                    {TYPE_ICONS[spot.type]}
                    {spot.type}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    spot.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    <AlertTriangle size={10} />
                    {spot.severity}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {expanded === spot.id ? spot.description : spot.description.slice(0, 120) + '...'}
              </p>

              <button
                onClick={() => setExpanded(expanded === spot.id ? null : spot.id)}
                className="text-xs text-green-700 font-medium mt-1 underline"
              >
                {expanded === spot.id ? 'Show less' : 'Read more'}
              </button>

              {expanded === spot.id && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Key facts</div>
                  {spot.stats.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                      {s}
                    </div>
                  ))}
                  <a
                    href={spot.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 underline mt-2"
                  >
                    <ExternalLink size={11} />
                    Source / Learn more
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
