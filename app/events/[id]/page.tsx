"use client"

import { useParams } from "next/navigation"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation";

import Navbar from "../../NavBar"
import { useState, useEffect } from "react";
import Image from "next/image"
import {Button} from "../../../components/ui/button"

import { supabase } from "../../lib/supabase";

export default function EventPage() {

    const params = useParams()
    const test = params.id as string

    const [eventData, setEventData] = useState<any>(null)

    const setNewView = async () => { 
        const {data, error} = await supabase.from("events_test").select('*').eq("instaShortURL", test)

        if (error) {
            console.error("Error fetching event:", error)
            return
        }

        if (data && data.length > 0) {
            setEventData(data[0])
            console.log("Event data:", data[0])
        } else {
            console.log("No event found")
        }
    }

    useEffect(() => {
        setNewView()
    }, [test])

    
    const router = useRouter();

    return (

        <div className="flex flex-col min-h-screen w-full bg-zinc-50 text-black">
            <Navbar/>
            <div className="flex justify-center p-3 pb-20 md:p-0">
                <div className="flex flex-col w-full max-w-[1200px] mt-15 px-4 md:px-0">

                    <div className="mb-8">
                        <Button className="bg-[#001E60] hover:bg-[#06357A]" onClick={() => router.push("/events")}>
                            <div>
                                <ArrowLeft/>
                            </div>Back to events
                        </Button>
                    </div>
                    <div className="flex flex-row">

                        <div>

                            {eventData?.imageURL ?
                                <div className='w-[350px] rounded-md mx-auto md:mx-0'>
                                    <Image 
                                        src={eventData.imageURL}
                                        alt="Event image" 
                                        width={350} 
                                        height={200} 
                                        className="rounded-md object-cover"
                                    />
                                </div> 
                                
                            :
                            <div className='w-full h-[50px] md:size-[200px] bg-gray-200/50 flex items-center justify-center rounded-md mx-auto md:mx-0'>
                                <h2>No image</h2>
                            </div>
                            }

                        </div>

                        <div className="pl-5 flex flex-col gap-5">
                            <h1 className="text-4xl font-bold">{eventData?.name}</h1>
                            <div className="max-w-[700px]">
                                {
                                    eventData?.originalDescription ? <h2 className="text-sm">{eventData?.originalDescription}</h2> : <h2 className="text-sm">No description provided</h2>
                                }
                                
                            </div>


                        </div>



                    </div>
                </div>
            </div>        
            
        </div>



    )
}