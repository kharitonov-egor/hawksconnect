"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, MapPin, Link as LinkIcon } from "lucide-react"
import NavBar from "../../NavBar"
import Footer from "../../Footer"
import { Button } from "@/components/ui/button"
import { supabase } from "../../lib/supabase"
import Event from "../../events/event"
import FollowButton from "../FollowButton"

export default function ClubDetailPage() {
    const params = useParams()
    const router = useRouter()
    const clubId = params.id as string

    const [club, setClub] = useState<any>(null)
    const [events, setEvents] = useState<any[] | null>(null)

    useEffect(() => {
        const load = async () => {
            const { data: clubData, error: clubError } = await supabase
                .from("organizers")
                .select("*")
                .eq("id", clubId)
                .maybeSingle()

            if (clubError || !clubData) {
                console.error("Error fetching club:", clubError)
                return
            }
            setClub(clubData)

            const { data: eventData, error: eventError } = await supabase
                .from("events_test")
                .select("*")
                .eq("organizer", clubId)
                .order("startTime", { ascending: false })

            if (eventError) {
                console.error("Error fetching club events:", eventError)
                setEvents([])
                return
            }
            setEvents(eventData)
        }
        load()
    }, [clubId])

    // Renders socialLinks/leadershipInfo defensively, regardless of exact JSON shape
    const renderJsonField = (data: any) => {
        if (!data) return null
        if (typeof data === "string") return <p className="text-sm text-gray-600">{data}</p>

        const entries = Array.isArray(data)
            ? data.map((v, i) => [String(i), v])
            : Object.entries(data)

        if (entries.length === 0) return null

        return (
            <div className="flex flex-col gap-1">
                {entries.map(([key, value]) => (
                    <div key={key} className="text-sm text-gray-600 flex gap-2">
                        <span className="font-medium capitalize">{key}:</span>
                        <span>{typeof value === "object" ? JSON.stringify(value) : String(value)}</span>
                    </div>
                ))}
            </div>
        )
    }

    if (!club) {
        return (
            <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
                <NavBar useCase="clubs"/>
                <div className="flex-1 flex items-center justify-center">
                    <h2 className="text-gray-500">Loading club...</h2>
                </div>
                <Footer/>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
            <NavBar useCase="clubs"/>
            <div className="flex-1 flex justify-center p-3 pb-20 md:p-0">
                <div className="flex flex-col w-full max-w-[1200px] mt-15 px-4 md:px-0">

                    <div className="mb-8">
                        <Button className="bg-[#001E60] hover:bg-[#06357A]" onClick={() => router.push("/clubs")}>
                            <ArrowLeft/> Back to clubs
                        </Button>
                    </div>

                    <div className="bg-white rounded-md border border-gray-400/50 shadow-sm p-5 md:p-8 mb-8">
                        <span className="text-xs font-medium text-[#B99C5F] uppercase tracking-wide">
                            {club.type?.replace("_", " ") || "Organization"}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#06357A] mt-1 mb-3">{club.name}</h1>
                        <p className="text-gray-600 max-w-[700px] mb-4">{club.description}</p>

                        {club.location && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
                                <MapPin size={16} color="#06357A"/>
                                <span>{club.location}</span>
                            </div>
                        )}

                        {club.socialLinks && (
                            <div className="flex items-center gap-1.5 mb-2">
                                <LinkIcon size={14} color="#06357A"/>
                                {renderJsonField(club.socialLinks)}
                            </div>
                        )}

                        {club.leadershipInfo && (
                            <div className="mt-3">
                                <h3 className="text-sm font-semibold text-[#06357A] mb-1">Leadership</h3>
                                {renderJsonField(club.leadershipInfo)}
                            </div>
                        )}

                        <div className="mt-5">
                            <FollowButton organizerId={club.id}/>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-[#06357A] mb-4">Events by {club.name}</h2>

                    <div className='flex flex-col gap-4'>
                        {events === null && (
                            <h2 className='text-center text-gray-500'>Loading events...</h2>
                        )}
                        {events?.length === 0 && (
                            <h2 className='text-center text-gray-500'>No events from this club yet.</h2>
                        )}
                        {events?.map(event => (
                            <Event
                                key={event.id}
                                title={event.name}
                                description={event.description}
                                startTime={event.startTime}
                                endTime={event.endTime}
                                campus={event.campus}
                                location={event.location}
                                attending={event.attending}
                                flyerURL={event.flyerURL}
                                imageHeight={event.imageHeight}
                                imageWidth={event.imageWidth}
                                club={event.club}
                                instaShortURL={event.instaShortURL}
                            />
                        ))}
                    </div>

                </div>
            </div>
            <Footer/>
        </div>
    )
}