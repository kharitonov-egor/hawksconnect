"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarCheck } from 'lucide-react'
import NavBar from "../NavBar"
import Footer from "../Footer"
import { Button } from "@/components/ui/button"
import { supabase } from "../lib/supabase"
import Event from "../events/event"

export default function MyEventsPage() {
    const router = useRouter()
    const [loadingAuth, setLoadingAuth] = useState(true)
    const [events, setEvents] = useState<any[] | null>(null)

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push("/login")
                return
            }

            setLoadingAuth(false)

            const { data, error } = await supabase
                .from("rsvps")
                .select("event_id, events_test(*)")
                .eq("user_id", user.id)

            if (error) {
                console.error("Error fetching RSVPs:", error)
                setEvents([])
                return
            }

            const rsvpEvents = (data ?? [])
                .map((row: any) => row.events_test)
                .filter(Boolean)
                .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

            setEvents(rsvpEvents)
        }
        load()
    }, [router])

    if (loadingAuth) return null

    return (
        <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
            <NavBar useCase="my-events"/>
            <div className="flex-1 flex justify-center px-3 pt-3 pb-20 md:px-0 md:pt-0">
                <div className="flex flex-col w-full max-w-[1200px] mt-15 px-4 md:px-0">

                    <div className='flex flex-row gap-1 items-center mb-6 md:mb-10'>
                        <CalendarCheck color="#06357A" size={30} className="md:w-[35px] md:h-[35px]"/>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">My Events</h2>
                    </div>

                    <div className='flex flex-col gap-4'>
                        {events === null && (
                            <h2 className='text-center text-gray-500'>Loading your events...</h2>
                        )}

                        {events !== null && events.length === 0 && (
                            <div className='flex flex-col items-center gap-4 py-16'>
                                <h2 className='text-center text-gray-500'>You haven&apos;t RSVP&apos;d to any events yet.</h2>
                                <Button
                                    onClick={() => router.push("/events")}
                                    className="bg-[#001E60] hover:bg-[#06357A]"
                                >
                                    Browse Events
                                </Button>
                            </div>
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