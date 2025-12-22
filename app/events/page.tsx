"use client"
import { CalendarDays } from 'lucide-react'
import NavBar from "../NavBar"
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import ComboboxDemo, { campuses } from "./campusChoice"
import { Button } from "@/components/ui/button"

interface EventFromSupabase {
    id: string;
    created_at: string;
    name: string;
    description: string;
    date:string;
    startTime: string;
    endTime: string;
    campus: string;
    location: string;
    attending: number;
    club: string;

}

import Event from "./event"

export default function App() {

    const [data, setData] = useState<any[] | null>(null);
    const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  
    const setNewView = async () => {
      const {data, error} = await supabase.from("events_test").select('*').in("campus", selectedCampuses)
  
      if (data) {
        setData(data)
      }
      if (error) console.log(error)
    }
  
    return (
        <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
            <NavBar/>
            <div className="flex justify-center p-3 md:p-0">
                <div className="flex flex-col w-[1200px] mt-15">

                    <div className='flex flex-row gap-1 items-center mb-10'>
                        <CalendarDays color="#06357A" size={35}/>
                        <h2 className="text-3xl md:text-4xl font-semibold">Events</h2>
                    </div>

                    <div className='flex flex-row gap-5 mb-7'>
                        <ComboboxDemo 
                        selectedValues={selectedCampuses}
                        onSelectedValuesChange={setSelectedCampuses}
                        />

                        <Button onMouseDown={setNewView} className="bg-[#001E60] hover:bg-[#06357A]">Find</Button>

                    </div>
                    


                    <div className='flex flex-col gap-4'>
                        { data ? 
                            data?.map(event => (
                                <Event 
                                    key={event.id}
                                    title={event.name} 
                                    date={event.date}
                                    startTime={event.startTime} 
                                    endTime={event.endTime} 
                                    campus={event.campus} 
                                    location={event.location} 
                                    attending={event.attending} 
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