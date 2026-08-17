"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CalendarDays, HelpCircle, LogOut, Menu, User, Users, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { supabase } from "./lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface NavbarProps {
  useCase: string;
}

interface NavItem {
  href: string;
  label: string;
  Icon: typeof CalendarDays;
}

export default function NavBar({useCase} : NavbarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        setMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        setMenuOpen(false)
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    const links: NavItem[] = [
      { href: "/events", label: "Events", Icon: CalendarDays },
      { href: "/faq", label: "FAQ", Icon: HelpCircle },
      ...(user ? [{ href: "/my-events", label: "My Events", Icon: User }] : []),
    ]

    const navLink = ({ href, label, Icon }: NavItem) => {
      const active = pathname === href
      return (
        <Link href={href} key={href}>
          <div className={`flex flex-row items-center gap-1.5 px-1 py-1 border-b-2 transition-all duration-150 hover:scale-105 ${active ? "border-[#B99C5F] text-[#06357A]" : "border-transparent text-gray-600 hover:text-[#06357A]"}`}>
            <Icon size={17}/>
            <span className="font-medium text-sm">{label}</span>
          </div>
        </Link>
      )
    }

    return (
        <div className="w-full flex items-center justify-center h-[75px] sticky top-0 z-40">
        <div className="w-full max-w-[1200px] h-full flex flex-row justify-between items-center px-5 bg-white/90 backdrop-blur-sm mt-5 rounded-xl mx-4 md:mx-0 shadow-sm border border-gray-200 relative">
          <Link href="/" className="flex flex-row items-center gap-2">
            <Image src='/icon.png' alt="HawksConnect Logo" width={38} height={38} className="rounded-md"/>
            <span className="font-semibold text-lg text-[#06357A]">
              HawksConnect
            </span>
          </Link>

          <div className="hidden md:flex flex-row gap-7 items-center">
            {links.map(navLink)}

            <div className="w-px h-6 bg-gray-200"/>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Hi, {(user.user_metadata?.full_name as string)?.split(" ")[0] || "Hawk"}
                </span>
                <Button onClick={handleLogout} variant="outline" className="h-8 px-3 text-sm">
                  <LogOut size={14}/> Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#06357A] transition-all duration-150 hover:scale-105 px-1 whitespace-nowrap">
                  Log in
                </Link>
                <Link href="/signup" className="bg-[#001E60] hover:bg-[#06357A] text-white text-sm font-medium px-3 h-8 flex items-center rounded-md transition-all duration-150 hover:scale-105 whitespace-nowrap">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(open => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-md text-[#06357A] hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>

          {menuOpen ? (
            <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-1">
              {links.map(({ href, label, Icon }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex flex-row items-center gap-2.5 px-2 py-2.5 rounded-md transition-colors ${active ? "bg-[#06357A]/5 text-[#06357A] font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    <Icon size={18}/>
                    <span className="text-sm">{label}</span>
                  </Link>
                )
              })}

              <div className="h-px bg-gray-200 my-2"/>

              {user ? (
                <div className="flex flex-col gap-3 px-2">
                  <span className="text-sm text-gray-600">
                    Hi, {(user.user_metadata?.full_name as string)?.split(" ")[0] || "Hawk"}
                  </span>
                  <Button onClick={handleLogout} variant="outline" className="h-9 text-sm w-full">
                    <LogOut size={14}/> Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-gray-600 hover:text-[#06357A] py-2 text-center rounded-md border border-gray-200"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="bg-[#001E60] hover:bg-[#06357A] text-white text-sm font-medium py-2 text-center rounded-md transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    )
}