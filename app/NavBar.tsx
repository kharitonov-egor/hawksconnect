"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, HelpCircle } from 'lucide-react'

interface NavbarProps {
  useCase: string;
}

export default function NavBar({useCase} : NavbarProps) {
    const pathname = usePathname()

    const navLink = (href: string, label: string, Icon: typeof CalendarDays) => {
      const active = pathname === href
      return (
        <Link href={href}>
          <div className={`flex flex-row items-center gap-1.5 px-1 py-1 border-b-2 transition-all duration-150 hover:scale-105 ${active ? "border-[#B99C5F] text-[#06357A]" : "border-transparent text-gray-600 hover:text-[#06357A]"}`}>
            <Icon size={17}/>
            <span className="font-medium text-sm">{label}</span>
          </div>
        </Link>
      )
    }

    return (
        <div className="w-full flex items-center justify-center h-[75px] sticky top-0 z-40">
        <div className="w-full max-w-[1200px] h-full flex flex-row justify-between items-center px-4 md:px-5 bg-white/90 backdrop-blur-sm mt-5 rounded-xl mx-2 md:mx-0 shadow-sm border border-gray-200">
          <Link href="/" className="flex flex-row items-center gap-2">
            <Image src='/icon.png' alt="HawksConnect Logo" width={38} height={38} className="rounded-md"/>
            <span className="font-semibold text-lg text-[#06357A] hidden sm:block">
              HawksConnect
            </span>
          </Link>

          <div className="flex flex-row gap-4 md:gap-7 items-center">
            {navLink("/events", "Events", CalendarDays)}
            {navLink("/faq", "FAQ", HelpCircle)}

          </div>
        </div>
      </div>
    )
}