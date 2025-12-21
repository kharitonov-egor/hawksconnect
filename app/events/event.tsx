import { MapPin, Clock, UserRound } from 'lucide-react'

interface EventProps{
    title: string;
    date:string;
    startTime: string;
    endTime?: string;
    campus:string;
    location:string;
    attending:number;
}

import BothTimes from "./bothTimes"

export default function Event({title, date, startTime, endTime, campus, location, attending} : EventProps) {

    const campusDisplayNames: { [key: string]: string } = {
        "dale_mabry": "Dale Mabry Campus",
        "plant_city": "Plant City Campus",
        "brandon": "Brandon Campus",
        "south_shore": "South Shore Campus",
        "ybor": "Ybor Campus",
        "westshore": "Westshore Campus"
    };
    
    const displayCampus = campusDisplayNames[campus] || campus;


    return (
        <div className="w-full h-fit md:h-[150px] bg-gray-200 p-4 rounded-md border border-gray-400/50 shadow-sm">

            <div className='flex flex-row gap-5'>

                <div className='bg-gray-400/20 size-[90px] rounded-md'>

                </div>

                <div>

                    <h1 className='font-semibold text-xl mb-3'>{title}</h1>
                    
                    <div className='flex flex-col md:flex-row gap-10'>
                        <div className='flex flex-row items-start gap-1'>
                            <Clock color="#06357A" size={20} />
                            <div className='flex flex-col'>
                                <h2>{date}</h2>
                                {
                                    endTime ? <BothTimes startTime={startTime} endTime={endTime}/> : <h2>{startTime}</h2>
                                }

                            </div>

                        </div>

                        <div className='flex flex-row items-center gap-1'>
                            <MapPin color="#06357A" size={20} />
                            <div className='flex flex-col'>
                                <h2>{displayCampus}</h2>
                                <h2>{location}</h2>

                            </div>


                        </div>

                        <div className='flex flex-row items-center gap-1'>
                            <UserRound color="#06357A" size={20} />
                            <h2>{attending} attending</h2>

                        </div>
                    

                    </div>



                
                </div>



            </div>



            
        </div>
    )
}