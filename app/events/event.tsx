
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation";
import posthog from "posthog-js"



interface EventProps{
    title: string;
    description?: string;
    startTime: string;
    endTime?: string;
    campus:string;
    location:string;
    attending:number;
    flyerURL?: string;
    imageUrl?:string;
    imageHeight?:number;
    imageWidth?: number;
    club:string;
    instaShortURL:string;
}

import Image from "next/image"

import EventStuff from "./eventStuff"

import { flyerSrc } from "@/app/lib/flyer-url"
import { campusLabel } from "@/app/lib/campus"



export default function Event({title, description, startTime, endTime, campus, location, attending, flyerURL, imageHeight, imageWidth, club, instaShortURL} : EventProps) {

    const displayCampus = campusLabel(campus);

    const flyerImageSrc = flyerSrc(flyerURL);

    const router = useRouter();

    return (
        <div className="w-full h-fit bg-gray-100/60 p-4 md:p-5 rounded-md border border-gray-400/50 shadow-sm">

            <div className='flex flex-col md:flex-row gap-4 md:gap-8'>

                {flyerImageSrc ?
                            <div className='w-[200px] rounded-md mx-auto md:mx-0'>
                                <Image
                                    src={flyerImageSrc}
                                    alt="Event image" 
                                    width={200} 
                                    height={200} 
                                    className="rounded-md object-cover"
                                />
                            </div> 
                            
                        :
                        <div className='w-full h-[50px] md:size-[200px] bg-gray-200/50 flex items-center justify-center rounded-md mx-auto md:mx-0'>
                            <h2>No image!</h2>
                        </div>
                        }
                

                <div>

                    <h1 className='font-semibold text-xl text-[#06357A] md:text-2xl mb-3 md:mb-4 wrap-break-word'>{title}</h1>
                    
                        <EventStuff 
                            startTime={startTime}
                            endTime={endTime}
                            displayCampus={displayCampus}
                            location={location}
                            club={club}
                            instaShortURL={instaShortURL}
                            useCase="/events"
                        />

                    <div className='mt-7'>
                        <Button className='bg-[#001E60] hover:bg-[#06357A]' onClick={() => {
                            posthog.capture("event_find_out_more_clicked", {
                                event_title: title,
                                campus,
                                club,
                            })
                            router.push(`/events/${instaShortURL}`)
                        }}>Find out more</Button>
                    </div>



                
                </div>



            </div>



            
        </div>
    )
}