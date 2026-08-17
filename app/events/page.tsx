"use client"
import { CalendarDays, Search } from 'lucide-react'
import NavBar from "../NavBar"
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import CampusChoice, { campuses } from "./campusChoice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UpcomingPastChoice from "./UpcomingPastChoice"
import Footer from "../Footer"
import posthog from "posthog-js"



interface EventFromSupabase {
    id: string;
    created_at: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    campus: string;
    flyerURL?: string;
    location: string;
    attending: number;
    club: string;
    instaShortURL:string;
    imageHeight?: number;
    imageWidth?: number;
}

import Event from "./event"

export default function App() {

    const [data, setData] = useState<EventFromSupabase[] | null>(null);
    const [selectedCampuses, setSelectedCampuses] = useState<string[]>(campuses.map(campus => campus.value));
    const [selectedUpcoming, setSelectedUpcoming] = useState<string>("upcoming");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const setNewView = async () => {
      const now = new Date().toISOString()
      const query = supabase.from("events_test").select('*').in("campus", selectedCampuses)

      const { data, error } = selectedUpcoming == "upcoming"
        ? await query.gte("startTime", now).order("startTime", { ascending: true })
        : await query.lt("startTime", now).order("startTime", { ascending: false })

      posthog.capture("event_searched", {
        campuses: selectedCampuses,
        time_filter: selectedUpcoming,
        results_count: data?.length ?? 0,
      })

      if (data) {
        setData(data)
      }
      if (error) console.log(error)
    }

    useEffect(() => {
        setNewView();
    }, []);

    const filteredData = useMemo(() => {
        if (!data) return data
        if (!searchQuery.trim()) return data

        const query = searchQuery.trim().toLowerCase()
        return data.filter(event =>
            event.name?.toLowerCase().includes(query) ||
            event.club?.toLowerCase().includes(query)
        )
    }, [data, searchQuery])

    return (
        <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
            <NavBar useCase="events"/>
            <div className="flex-1 flex justify-center p-3 pb-20 md:p-0">
                <div className="flex flex-col w-full max-w-[1200px] mt-15 px-4 md:px-0">

                    <div className='flex flex-row gap-1 items-center mb-6 md:mb-10'>
                        <CalendarDays color="#06357A" size={30} className="md:w-[35px] md:h-[35px]"/>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Events</h2>
                    </div>

                    <div className='relative mb-5'>
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by event title or club name..."
                            className="pl-9 h-10 bg-white"
                        />
                    </div>

                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-5 mb-7'>
                        <CampusChoice
                        selectedValues={selectedCampuses}
                        onSelectedValuesChange={setSelectedCampuses}
                        />

                        <UpcomingPastChoice
                            selectedValues={selectedUpcoming}
                            onSelectedValuesChangeUpcoming={setSelectedUpcoming}
                        />

                        <Button onMouseDown={setNewView} className="bg-[#001E60] hover:bg-[#06357A] w-full sm:w-auto">Find</Button>

                    </div>



                    <div className='flex flex-col gap-4'>
                        { filteredData ?
                            filteredData?.map(event => (
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
                            ))
                            : <h2 className='text-center'>Select parametrs above</h2>
                        }

                        {filteredData?.length == 0 ? <h2 className='text-center'>Unfortunately, no events founds using paramaters above 🥲</h2> : null}

                    </div>



                </div>


            </div>
            <Footer/>
        </div>
    )
}