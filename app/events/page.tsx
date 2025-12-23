"use client"
import { CalendarDays } from 'lucide-react'
import NavBar from "../NavBar"
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import CampusChoice, { campuses } from "./campusChoice"
import { Button } from "@/components/ui/button"
import UpcomingPastChoice from "./UpcomingPastChoice"



interface EventFromSupabase {
    id: string;
    created_at: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    campus: string;
    location: string;
    attending: number;
    club: string;
    instaShortURL:string;

}

import Event from "./event"

export default function App() {

    const [data, setData] = useState<any[] | null>(null);
    const [selectedCampuses, setSelectedCampuses] = useState<string[]>(["dale_mabry"]);
    const [selectedUpcoming, setSelectedUpcoming] = useState<string>("past");
  
    const setNewView = async () => {
      const now = new Date().toISOString()
      console.log(selectedUpcoming)
      let data, error;
      
      if (selectedUpcoming == "upcoming") {
        const result = await supabase.from("events_test").select('*').in("campus", selectedCampuses).gte("startTime", now);
        data = result.data;
        error = result.error;
      } else {
        const result = await supabase.from("events_test").select('*').in("campus", selectedCampuses).lt("startTime", now);
        data = result.data;
        error = result.error;
      }


      console.log(data)

      if (data) {
        setData(data)
      }
      if (error) console.log(error)
    }

    useEffect(() => {
        setNewView();
    }, [selectedCampuses, selectedUpcoming]);
  
    return (
        <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
            <NavBar useCase="events"/>
            <div className="flex justify-center p-3 pb-20 md:p-0">
                <div className="flex flex-col w-full max-w-[1200px] mt-15 px-4 md:px-0">

                    <div className='flex flex-row gap-1 items-center mb-6 md:mb-10'>
                        <CalendarDays color="#06357A" size={30} className="md:w-[35px] md:h-[35px]"/>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Events</h2>
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
                        { data ? 
                            data?.map(event => (
                                <Event 
                                    key={event.id}
                                    title={event.name} 
                                    description={event.description}
                                    startTime={event.startTime} 
                                    endTime={event.endTime} 
                                    campus={event.campus} 
                                    location={event.location} 
                                    attending={event.attending} 
                                    imageUrl={event.imageURL}
                                    imageHeight={event.imageHeight}
                                    imageWidth={event.imageWidth}
                                    club={event.club}
                                    instaShortURL={event.instaShortURL}
                                />
                            ))
                            : <h2 className='text-center'>Select parametrs above</h2>
                        }

                        {data?.length == 0 ? <h2 className='text-center'>Unfortunately, no events founds using paramaters above 🥲</h2> : null}

                    </div>



                </div>


            </div>
        </div>
    )
}