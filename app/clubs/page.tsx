"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users } from 'lucide-react'
import NavBar from "../NavBar"
import Footer from "../Footer"
import { supabase } from "../lib/supabase"

export default function ClubsPage() {
    const [clubs, setClubs] = useState<any[] | null>(null)

    useEffect(() => {
        const load = async () => {
            const { data, error } = await supabase
                .from("organizers")
                .select("*")
                .order("name", { ascending: true })

            if (error) {
                console.error("Error fetching clubs:", error)
                setClubs([])
                return
            }
            setClubs(data)
        }
        load()
    }, [])

    return (
        <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
            <NavBar useCase="clubs"/>
            <div className="flex-1 flex justify-center px-3 pt-3 pb-20 md:px-0 md:pt-0">
                <div className="flex flex-col w-full max-w-[1200px] mt-15 px-4 md:px-0">

                    <div className='flex flex-row gap-1 items-center mb-6 md:mb-10'>
                        <Users color="#06357A" size={30} className="md:w-[35px] md:h-[35px]"/>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Clubs & Organizations</h2>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {clubs === null && (
                            <h2 className='text-center col-span-full text-gray-500'>Loading clubs...</h2>
                        )}

                        {clubs?.map(club => (
                            <Link key={club.id} href={`/clubs/${club.id}`}>
                                <div className="h-full bg-white rounded-md border border-gray-400/50 shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow flex flex-col">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-xs font-medium text-[#B99C5F] uppercase tracking-wide">
                                            {club.type?.replace("_", " ") || "Organization"}
                                        </span>
                                        {club.location && (
                                            <span className="text-xs font-medium text-[#06357A] bg-[#06357A]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                {club.location}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-lg text-[#06357A] mb-2">{club.name}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-3">{club.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
            <Footer/>
        </div>
    )
}