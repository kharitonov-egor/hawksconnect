"use client"
import moment from 'moment'
import { MapPin, Clock, UserRound, ChevronRight } from 'lucide-react'
import {TimeConverter} from "../../lib/utils"
import BothTimes from "./bothTimes"
import Link from 'next/link'


interface EventStuffProps {
    startTime: string
    endTime?: string
    displayCampus: string
    location: string
    club:string
    useCase:string
    instaShortURL: string
    clubId?: string
}

export default function EventStuff({startTime, endTime, displayCampus, location, club, useCase, clubId} : EventStuffProps) {
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

            {
                useCase == "/events" ? null :

                <div className='flex flex-row items-start gap-2 text-base'>
                    <UserRound color="#06357A" size={18} className='mt-1' />
                    {clubId ? (
                        <Link
                            href={`/clubs/${clubId}`}
                            className='group inline-flex items-center gap-1 font-semibold text-[#06357A] underline decoration-[#B99C5F] decoration-2 underline-offset-4 hover:decoration-[#06357A]'
                        >
                            Organized by {club}
                            <ChevronRight size={16} className='transition-transform group-hover:translate-x-0.5'/>
                        </Link>
                    ) : (
                        <h2>{club ? `Organized by ${club}` : "Organizer not listed"}</h2>
                    )}
                </div>
            }
        </div>

    )
}
