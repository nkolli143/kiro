'use client'

import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, Scale, BarChart3, Zap } from 'lucide-react'

const SECTIONS = [
  {
    id: 'standing',
    icon: Scale,
    title: 'Your Legal Standing',
    color: 'green',
    intro: 'You are a complainant with standing — not just a concerned bystander. Environmental laws give citizens direct legal rights.',
    img: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=800&q=80',
    imgAlt: 'Industrial smokestacks polluting the sky',
    content: [
      {
        heading: 'What "standing" means',
        body: 'Legal standing means you have the right to participate in enforcement proceedings, file formal complaints, and even sue polluters directly in federal court. You don\'t need to be a lawyer or an organization — any person who witnesses or is affected by a violation has standing under federal environmental law.',
      },
      {
        heading: 'Clean Water Act (CWA)',
        body: 'Section 505 of the Clean Water Act contains a citizen suit provision that allows any person to sue a polluter who is violating an effluent standard or permit condition. You can also sue the EPA itself if it fails to perform a non-discretionary duty. Successful plaintiffs can recover attorney\'s fees.',
        link: 'https://www.epa.gov/cwa-404/clean-water-act-section-505-citizen-suits',
        linkLabel: 'CWA Citizen Suit provisions →',
      },
      {
        heading: 'Clean Air Act (CAA)',
        body: 'Section 304 of the Clean Air Act similarly allows citizens to sue any person — including corporations — who violates an emission standard or permit condition. You can also sue the EPA for failure to enforce. Courts can impose civil penalties up to $25,000 per day per violation.',
        link: 'https://www.epa.gov/enforcement/clean-air-act-stationary-source-compliance-monitoring-strategy',
        linkLabel: 'CAA enforcement overview →',
      },
      {
        heading: 'Resource Conservation and Recovery Act (RCRA)',
        body: 'RCRA Section 7002 allows citizens to sue any person who has contributed to the handling, storage, or disposal of solid or hazardous waste that presents an imminent and substantial endangerment to health or the environment. This is a powerful tool for illegal dumping cases.',
        link: 'https://www.epa.gov/enforcement/resource-conservation-and-recovery-act-rcra-enforcement',
        linkLabel: 'RCRA enforcement overview →',
      },
      {
        heading: 'Notice requirement',
        body: 'Before filing a citizen suit, you must give 60 days\' written notice to the alleged violator, the EPA, and the relevant state agency. This notice requirement is strict — failure to provide proper notice can result in dismissal. File for Earth\'s complaint filing starts this clock.',
      },
    ],
  },
  {
    id: 'numbers',
    icon: BarChart3,
    title: 'By the Numbers',
    color: 'blue',
    intro: 'The scale of environmental enforcement — and the gap that citizen reporting fills.',
    img: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
    imgAlt: 'Polluted river with brown discharge',
    content: [
      {
        heading: 'The reporting gap',
        body: 'The EPA estimates that fewer than 10% of environmental violations are ever reported by the public. The primary reason: the process is too difficult. Most people who witness a violation don\'t know where to report it, what information to include, or what happens after they do.',
      },
      {
        heading: 'Filing time',
        body: 'The average time to file a properly structured environmental complaint without assistance: 45 minutes of research, phone calls, and form-filling. With File for Earth: under 2 minutes. That friction reduction is the entire product.',
      },
      {
        heading: 'EPA ECHO database',
        body: 'The EPA\'s Enforcement and Compliance History Online (ECHO) database contains records for over 900,000 regulated facilities across the US — including their permit conditions, inspection history, violation records, and enforcement actions. All of this data is public and free.',
        link: 'https://echo.epa.gov/',
        linkLabel: 'Explore EPA ECHO →',
      },
      {
        heading: 'Agency response windows',
        body: 'Federal agencies are required to acknowledge complaints within statutory timeframes. EPA regional offices typically acknowledge within 72–120 hours. State agencies vary — California\'s CARB targets 72 hours; Texas TCEQ targets 5 business days. Complaints that go unacknowledged can be escalated.',
      },
      {
        heading: 'Civil penalties',
        body: 'Environmental violations carry significant civil penalties. Clean Water Act violations: up to $25,000 per day per violation. Clean Air Act: up to $25,000 per day. RCRA: up to $37,500 per day. These penalties are why documented, structured complaints matter — they create a paper trail that supports enforcement.',
      },
      {
        heading: 'Environmental justice communities',
        body: 'Communities of color and low-income communities are disproportionately located near industrial facilities. EPA data shows that 68% of African Americans live within 30 miles of a coal-fired power plant. Citizen reporting is especially critical in these communities, where regulatory attention has historically been lower.',
        link: 'https://www.epa.gov/environmentaljustice',
        linkLabel: 'EPA Environmental Justice →',
      },
    ],
  },
  {
    id: 'action',
    icon: Zap,
    title: 'What You Can Do',
    color: 'amber',
    intro: 'Practical actions ranked by effort and impact — from filing a complaint to changing policy.',
    img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    imgAlt: 'Illegal dumping of waste barrels in a field',
    content: [
      {
        heading: '1. File a complaint (Low effort, High impact)',
        body: 'The most direct action. Use EnviroReport to file a structured complaint in under 2 minutes. A single documented complaint can trigger an inspection. Multiple complaints about the same facility dramatically increase enforcement pressure.',
        link: '/',
        linkLabel: 'File a complaint now →',
      },
      {
        heading: '2. Report to your State DEQ (Low effort, High impact)',
        body: 'Every state has a Department of Environmental Quality with a complaint hotline. State agencies often respond faster than federal ones and have direct enforcement authority over local facilities.',
        link: 'https://www.epa.gov/enforcement/report-environmental-violations',
        linkLabel: 'Find your state agency →',
      },
      {
        heading: '3. Organize community monitoring (Medium effort, Very High impact)',
        body: 'Coordinate with neighbors to document violations systematically. Multiple complaints from multiple people about the same facility dramatically increases enforcement pressure and can support a citizen suit.',
        link: 'https://www.cbecal.org/resources/',
        linkLabel: 'Community organizing resources →',
      },
      {
        heading: '4. Attend public comment periods (Low effort, High impact)',
        body: 'When facilities apply for new or renewed permits, there\'s a mandatory public comment period. Your comment becomes part of the legal record and can influence permit conditions.',
        link: 'https://www.regulations.gov/',
        linkLabel: 'Find open comment periods →',
      },
      {
        heading: '5. Use FOIA requests (Medium effort, Medium impact)',
        body: 'Use the Freedom of Information Act to request inspection reports, violation notices, and internal communications about a facility. This information can support a legal case or media investigation.',
        link: 'https://www.foia.gov/',
        linkLabel: 'Submit a FOIA request →',
      },
      {
        heading: '6. Contact Earthjustice (Low effort, Very High impact)',
        body: 'Earthjustice provides free legal representation in environmental cases. If you\'ve been harmed by pollution or have documented a significant violation, you may have a case worth pursuing.',
        link: 'https://earthjustice.org/about/contact',
        linkLabel: 'Contact Earthjustice →',
      },
      {
        heading: '7. Vote in local elections (Low effort, Very High impact)',
        body: 'Local officials — city councils, county commissioners, state legislators — make the zoning and permitting decisions that determine where polluting facilities get built. Local elections have the most direct impact on environmental outcomes.',
        link: 'https://vote.gov/',
        linkLabel: 'Register to vote →',
      },
    ],
  },
]

const COLORS: Record<string, {
  border: string; bg: string; headerBg: string; headerText: string;
  iconBg: string; iconText: string; linkText: string; cardBorder: string
}> = {
  green: {
    border: 'border-green-600',
    bg: 'bg-green-950',
    headerBg: 'bg-green-900',
    headerText: 'text-green-100',
    iconBg: 'bg-green-500',
    iconText: 'text-green-950',
    linkText: 'text-green-400',
    cardBorder: 'border-green-800',
  },
  blue: {
    border: 'border-blue-600',
    bg: 'bg-blue-950',
    headerBg: 'bg-blue-900',
    headerText: 'text-blue-100',
    iconBg: 'bg-blue-500',
    iconText: 'text-blue-950',
    linkText: 'text-blue-400',
    cardBorder: 'border-blue-800',
  },
  amber: {
    border: 'border-amber-500',
    bg: 'bg-amber-950',
    headerBg: 'bg-amber-900',
    headerText: 'text-amber-100',
    iconBg: 'bg-amber-400',
    iconText: 'text-amber-950',
    linkText: 'text-amber-400',
    cardBorder: 'border-amber-800',
  },
}

const STATS = [
  { value: '<10%', label: 'of violations ever reported' },
  { value: '900K+', label: 'EPA-regulated facilities' },
  { value: '$25K', label: 'max fine per day per violation' },
  { value: '60 days', label: 'notice before citizen suit' },
]

export default function KnowYourRightsPage() {
  const [expanded, setExpanded] = useState<string | null>('standing')

  return (
    <div className="w-full">

      {/* Hero */}
      <div className="relative w-full h-72 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=1600&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-10">
          <div className="inline-flex items-center gap-2 bg-green-500 text-gray-900 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full w-fit mb-4">
            Know Your Rights
          </div>
          <h1 className="text-4xl font-black text-white leading-tight max-w-xl">
            You have more power<br />than you think.
          </h1>
          <p className="text-gray-300 mt-3 max-w-lg text-base leading-relaxed">
            Federal environmental laws give every citizen the right to file complaints, demand enforcement, and sue polluters directly — no lawyer required.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="w-full px-8 py-5 grid grid-cols-4 divide-x divide-gray-700">
          {STATS.map(s => (
            <div key={s.label} className="px-6 first:pl-0">
              <div className="text-2xl font-black text-green-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="w-full px-8 py-8 space-y-6">
        {SECTIONS.map(section => {
          const c = COLORS[section.color]
          const isOpen = expanded === section.id
          const Icon = section.icon
          return (
            <div key={section.id} className={`rounded-2xl border-2 overflow-hidden ${c.border} ${c.bg}`}>

              {/* Section header — always visible */}
              <button
                onClick={() => setExpanded(isOpen ? null : section.id)}
                className={`w-full flex items-center justify-between p-0 text-left transition-all ${c.headerBg}`}
              >
                <div className="flex items-stretch w-full">
                  {/* Image strip */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={section.img}
                    alt={section.imgAlt}
                    className="w-48 h-36 object-cover flex-shrink-0"
                  />
                  {/* Text */}
                  <div className="flex-1 flex items-center gap-5 px-7 py-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.iconBg}`}>
                      <Icon size={22} className={c.iconText} />
                    </div>
                    <div className="flex-1">
                      <h2 className={`text-2xl font-black ${c.headerText}`}>{section.title}</h2>
                      <p className="text-sm text-gray-300 mt-1 leading-relaxed max-w-2xl">{section.intro}</p>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      {isOpen
                        ? <ChevronUp size={24} className="text-gray-400" />
                        : <ChevronDown size={24} className="text-gray-400" />}
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {section.content.map((item, i) => (
                    <div key={i} className={`bg-gray-900 rounded-xl p-5 border ${c.cardBorder} flex flex-col`}>
                      <h3 className="font-bold text-white mb-2 text-sm">{item.heading}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed flex-1">{item.body}</p>
                      {item.link && (
                        <a
                          href={item.link}
                          target={item.link.startsWith('/') ? '_self' : '_blank'}
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 text-sm font-semibold mt-4 hover:underline ${c.linkText}`}
                        >
                          {item.linkLabel}
                          {!item.link.startsWith('/') && <ExternalLink size={12} />}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA footer */}
      <div className="relative w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1600&q=80"
          alt="Aerial view of industrial facility near water"
          className="w-full h-56 object-cover"
        />
      </div>

    </div>
  )
}
