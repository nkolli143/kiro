'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AlertTriangle, MapPin, Lightbulb, FileText } from 'lucide-react'

const TABS = [
  { href: '/', label: 'File a Complaint', icon: <FileText size={15} /> },
  { href: '/hotspots', label: 'US Hotspots', icon: <MapPin size={15} /> },
  { href: '/know-your-rights', label: 'Know Your Rights', icon: <Lightbulb size={15} /> },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <header className="bg-gray-900 sticky top-0 z-10 border-b border-gray-800">
      <div className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
            <AlertTriangle size={18} className="text-gray-900" fill="currentColor" />
          </div>
          <div>
            <span className="font-black text-white text-lg tracking-tight">File for Earth</span>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex gap-1">
          {TABS.map(tab => {
            const active = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-green-500 text-gray-900 font-bold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto text-xs text-gray-500">
          Powered by EPA ECHO · Built for environmental justice
        </div>
      </div>
    </header>
  )
}
