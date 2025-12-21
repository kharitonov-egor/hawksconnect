"use client"
import { CalendarDays } from 'lucide-react'
import NavBar from "../NavBar"

import Event from "./event"

export default function App() {
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
                        <Event/>
                        <Event/>
                        <Event/>
                    </div>



                </div>


            </div>
        </div>
    )
}