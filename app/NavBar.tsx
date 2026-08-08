"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CalendarDays, HelpCircle, LogOut, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { supabase } from "./lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface NavbarProps {
  useCase: string;
}

export default function NavBar({useCase} : NavbarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<SupabaseUser | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

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
            {user ? navLink("/my-events", "My Events", User) : null}

            <div className="w-px h-6 bg-gray-200 hidden sm:block"/>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Hi, {(user.user_metadata?.full_name as string)?.split(" ")[0] || "Hawk"}
                </span>
                <Button onClick={handleLogout} variant="outline" className="h-8 px-3 text-sm">
                  <LogOut size={14}/> Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#06357A] transition-all duration-150 hover:scale-105 px-1">
                  Log in
                </Link>
                <Link href="/signup" className="bg-[#001E60] hover:bg-[#06357A] text-white text-sm font-medium px-3 h-8 flex items-center rounded-md transition-all duration-150 hover:scale-105">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
}