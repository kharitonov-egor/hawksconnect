import moment from 'moment'
import { MapPin, Clock, UserRound, Instagram } from 'lucide-react'
import {TimeConverter} from "../../lib/utils"
import BothTimes from "./bothTimes"
import { Button } from "@/components/ui/button"
import Link from 'next/link'


interface EventStuffProps {
    startTime: string
    endTime?: string
    displayCampus: string
    location: string
    club:string
    useCase:string
    instaShortURL: string
}

export default function EventStuff({startTime, endTime, displayCampus, location, club, useCase, instaShortURL} : EventStuffProps) {
    return (
        <div className={`text-lg flex flex-col ${useCase == "/events" ? "gap-0" : "gap-5"}`}>
            <div className='flex flex-col md:flex-row gap-3 md:gap-10 text-base'>

                <div className='w-75 flex flex-row items-start gap-2 '>
                    <Clock color="#06357A" size={18} className='mt-1' />
                    <div className='flex flex-col'>
                        <h2>{moment(startTime).format('ddd, MMMM Do YYYY')}</h2>
                        {
                            endTime ? <BothTimes startTime={TimeConverter(startTime, "start")} endTime={TimeConverter(endTime,"end")}/> : <h2>{TimeConverter(startTime,"startonly")}</h2>
                        }

                    </div>

                </div>

                <div className='w-75 flex flex-row items-start gap-2'>
                    <MapPin color="#06357A" size={18} className='mt-1' />
                    <div className='flex flex-col'>
                        <h2>{displayCampus}</h2>
                        <h2>{location}</h2>

                    </div>


                </div>


            </div>

                <div>
                        {
                        useCase == "/events" ? null :

                        <div className='flex flex-col gap-8'>
                            
                            <div className='flex flex-row items-start gap-1'>
                                <UserRound color="#06357A" size={18} className='mt-1' />
                                <h2>Organized by {club}</h2>
                
                            </div> 

                            
                            {/* <div className='flex items-center'>
                                <Link href="/">
                                    <h3 className='text-xs text-[#06357A] font-semibold'>Learn more</h3>
                                </Link>

                            </div> */}

                            <div>
                                <a 
                                    href={`https://instagram.com/p/${instaShortURL}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button 
                                        className="bg-gradient-to-r from-[#833AB4] to-[#E1306C] hover:from-[#9B4FD1] hover:to-[#F56040] text-white border-0 font-semibold flex items-center gap-2"
                                    >
                                        <Instagram size={18} />
                                        Instagram Link
                                    </Button>
                                </a>

                            </div>


                        </div>


                    }

                </div>
        </div>

    )
}