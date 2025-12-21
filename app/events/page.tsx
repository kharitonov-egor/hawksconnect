"use client"
import { CalendarDays } from 'lucide-react'
import NavBar from "../NavBar"
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";


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
  
    const setNewView = async () => {
      const {data, error} = await supabase.from("events_test").select('*')
      console.log(20)
  
      if (data) {
        console.log(data)
        setData(data)
      }
      if (error) console.log(error)
    }
  
    useEffect(() => {
      setNewView();
    }, []);

    return (
        <div className="flex flex-col h-full w-full bg-zinc-50 text-black">
            <NavBar/>
            <div className="flex justify-center p-3 md:p-0">
                <div className="flex flex-col w-[1200px] mt-15">

                    <div className='flex flex-row gap-1 items-center mb-20'>
                        <CalendarDays color="#06357A" size={35}/>
                        <h2 className="text-3xl md:text-4xl font-semibold">Events</h2>
                    </div>

                    <div className='flex flex-col gap-4'>
                        {
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
                        }

                    </div>



                </div>


            </div>
        </div>
    )
}