"use client"

import { useParams } from "next/navigation"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation";
import { Suspense } from "react"

import Navbar from "../../NavBar"
import { useState, useEffect } from "react";
import Image from "next/image"
import {Button} from "../../../components/ui/button"
import EventStuff from "../eventStuff"
import RSVPButton from "../RSVPButton"
import AddToCalendarButton from "../AddToCalendarButton"
import InstagramLinkButton from "../InstagramLinkButton"

import { supabase } from "../../lib/supabase";
import { flyerSrc } from "../../lib/flyer-url"
import { campusLabel } from "../../lib/campus"
import posthog from "posthog-js"

interface EventDetail {
    id: number
    name: string
    originalDescription?: string
    startTime: string
    endTime?: string
    campus: string
    location: string
    club: string
    organizer?: string
    slug?: string
    instaShortURL: string
    flyerURL?: string
}

interface Organizer {
    id: string
    name: string
}

export default function EventPage() {

    const params = useParams()
    const test = params.id as string

    const [eventData, setEventData] = useState<EventDetail | null>(null)
    const [organizer, setOrganizer] = useState<Organizer | null>(null)

    const setNewView = async () => {
        const {data, error} = await supabase.from("events").select('*').or(`slug.eq.${test},instaShortURL.eq.${test}`).order("slug", { ascending: true })

        if (error) {
            console.error("Error fetching event:", error)
            return
        }

        if (!data || data.length === 0) {
            console.log("No event found")
            return
        }

        const event: EventDetail = data[0]
        setEventData(event)
        posthog.capture("event_detail_viewed", {
            event_id: event.id,
            event_name: event.name,
            campus: event.campus,
            club: event.club,
        })

        loadOrganizer(event)
    }

    // Older rows carry only the club name, so fall back to matching on that.
    const loadOrganizer = async (event: EventDetail) => {
        const query = supabase.from("organizers").select("id, name")

        const { data, error } = event.organizer
            ? await query.eq("id", event.organizer).maybeSingle()
            : event.club
                ? await query.ilike("name", event.club).maybeSingle()
                : { data: null, error: null }

        if (error) {
            console.error("Error fetching organizer:", error)
            return
        }
        setOrganizer(data)
    }

    useEffect(() => {
        setNewView()
    }, [test])

    const displayCampus = campusLabel(eventData?.campus);
    const flyerImageSrc = flyerSrc(eventData?.flyerURL);


    const router = useRouter();

    return (

        <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
            <Navbar useCase="non-landing"/>
            <div className="flex justify-center p-3 pb-20 md:p-0">
                <div className="flex flex-col w-full max-w-[1200px] mt-15 px-4 md:px-0">

                    <div className="mb-8">
                        <Button className="bg-[#001E60] hover:bg-[#06357A]" onClick={() => router.push("/events")}>
                            <div>
                                <ArrowLeft/>
                            </div>Back to events
                        </Button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">

                        <div>

                            {flyerImageSrc ?
                                <Suspense fallback={
                                    <div className='w-[350px] h-[200px] bg-gray-200/50 flex items-center justify-center rounded-md mx-auto md:mx-0'>
                                        <h2>Loading...</h2>
                                    </div>
                                }>
                                    <div className='w-[350px] rounded-md mx-auto md:mx-0'>
                                        <Image
                                            src={flyerImageSrc}
                                            alt="Event image"
                                            width={350}
                                            height={200}
                                            className="rounded-md object-cover"
                                        />
                                    </div>
                                </Suspense>

                            :
                            <div className='w-full h-[50px] md:size-[200px] bg-gray-200/50 flex items-center justify-center rounded-md mx-auto md:mx-0'>
                                <h2>No image</h2>
                            </div>
                            }

                        </div>

                        <div className="md:pl-5 flex flex-col gap-5">
                            <h1 className="text-4xl font-bold text-[#06357A]">{eventData?.name}</h1>
                            <div className="max-w-[700px]">
                                {
                                    eventData?.originalDescription ? <h2 className="text-sm">{eventData?.originalDescription}</h2> : <h2 className="text-sm">No description provided</h2>
                                }

                            </div>

                            <EventStuff
                                startTime={eventData?.startTime ?? ""}
                                endTime={eventData?.endTime}
                                displayCampus={displayCampus}
                                location={eventData?.location ?? ""}
                                club={organizer?.name ?? eventData?.club ?? ""}
                                clubId={organizer?.id}
                                instaShortURL={eventData?.instaShortURL ?? ""}
                                useCase="/[id]"
                            />

                            {eventData?.id ? (
                                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-center">
                                    <RSVPButton eventId={eventData.id}/>
                                    <AddToCalendarButton
                                        title={eventData.name}
                                        description={eventData.originalDescription}
                                        location={eventData.location}
                                        startTime={eventData.startTime}
                                        endTime={eventData.endTime}
                                    />
                                    <InstagramLinkButton
                                        instaShortURL={eventData.instaShortURL}
                                        club={organizer?.name ?? eventData.club}
                                        campus={displayCampus}
                                    />
                                </div>
                            ) : null}

                        </div>



                    </div>
                </div>
            </div>

        </div>



    )
}