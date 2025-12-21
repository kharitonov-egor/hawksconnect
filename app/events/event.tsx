import { MapPin, Clock, UserRound } from 'lucide-react'

export default function Event() {
    return (
        <div className="w-full h-fit md:h-[125px] bg-gray-200 p-4 rounded-md border border-gray-400/50 shadow-sm">

            <div className='flex flex-row gap-5'>

                <div className='bg-gray-400/20 size-[90px] rounded-md'>

                </div>

                <div>

                    <h1 className='font-semibold text-xl mb-3'>Title of the event</h1>
                    
                    <div className='flex flex-col md:flex-row gap-10'>
                        <div className='flex flex-row items-center gap-1'>
                            <Clock color="#06357A" size={20} />
                            <h2>date of the event</h2>
                        </div>

                        <div className='flex flex-row items-center gap-1'>
                            <MapPin color="#06357A" size={20} />
                            <h2>place of the event</h2>

                        </div>

                        <div className='flex flex-row items-center gap-1'>
                            <UserRound color="#06357A" size={20} />
                            <h2>how many attending</h2>

                        </div>
                    

                    </div>



                
                </div>



            </div>



            
        </div>
    )
}