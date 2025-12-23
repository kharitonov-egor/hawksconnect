import { MapPin, Clock, UserRound } from 'lucide-react'
import {TimeConverter} from "../../lib/utils"
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation";



interface EventProps{
    title: string;
    description?: string;
    startTime: string;
    endTime?: string;
    campus:string;
    location:string;
    attending:number;
    imageUrl?:string;
    imageHeight?:number;
    imageWidth?: number;
    club:string;
    instaShortURL:string;
}

import Image from "next/image"

import moment from 'moment'

import BothTimes from "./bothTimes"

export default function Event({title, description, startTime, endTime, campus, location, attending, imageUrl, imageHeight, imageWidth, club, instaShortURL} : EventProps) {

    const campusDisplayNames: { [key: string]: string } = {
        "dale_mabry": "Dale Mabry Campus",
        "plant_city": "Plant City Campus",
        "brandon": "Brandon Campus",
        "south_shore": "South Shore Campus",
        "ybor": "Ybor Campus",
        "westshore": "Westshore Campus",
        "hawsklanding":"HawksLanding"
    };
    console.log('imageurl:')
    console.log(imageUrl)
    
    const displayCampus = campusDisplayNames[campus] || campus;

    const router = useRouter();

    return (
        <div className="w-full h-fit bg-gray-100 p-4 md:p-5 rounded-md border border-gray-400/50 shadow-sm">

            <div className='flex flex-col md:flex-row gap-4 md:gap-8'>

                {imageUrl ?
                            <div className='w-[200px] rounded-md mx-auto md:mx-0'>
                                <Image 
                                    src={imageUrl}
                                    alt="Event image" 
                                    width={200} 
                                    height={200} 
                                    className="rounded-md object-cover"
                                />
                            </div> 
                            
                        :
                        <div className='w-full h-[50px] md:size-[200px] bg-gray-200/50 flex items-center justify-center rounded-md mx-auto md:mx-0'>
                            <h2>No image</h2>
                        </div>
                        }
                


                <div>

                    <h1 className='font-semibold text-lg text-[#06357A] md:text-xl mb-3 md:mb-4 break-words'>{title}</h1>
                    
                    <div className='flex flex-col md:flex-row gap-3 md:gap-10'>

                        <div className='w-75 flex flex-row items-start gap-2'>
                            <Clock color="#06357A" size={18} />
                            <div className='flex flex-col'>
                                <h2>{moment(startTime).format('ddd, MMMM Do YYYY')}</h2>
                                {
                                    endTime ? <BothTimes startTime={TimeConverter(startTime, "start")} endTime={TimeConverter(endTime,"end")}/> : <h2>{TimeConverter(startTime,"startonly")}</h2>
                                }

                            </div>

                        </div>

                        <div className='w-75 flex flex-row items-start gap-2'>
                            <MapPin color="#06357A" size={18} />
                            <div className='flex flex-col'>
                                <h2>{displayCampus}</h2>
                                <h2>{location}</h2>

                            </div>


                        </div>

                        <div className='flex flex-row items-start gap-1'>
                            <UserRound color="#06357A" size={20} />
                            <h2>{club}</h2>

                        </div> 


                    

                    </div>

                    <div className='mt-7'>
                        <Button className='bg-[#001E60] hover:bg-[#06357A]' onClick={() => router.push(`/events/${instaShortURL}`)}>Find out more</Button>
                    </div>



                
                </div>



            </div>



            
        </div>
    )
}