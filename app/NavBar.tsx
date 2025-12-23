"use client"

import Image from "next/image"
import CTAButton from "./CTAButton"
import Link from "next/link"
import { ArrowUpRight } from 'lucide-react'

interface NavbarProps {
  useCase: string;
}

export default function NavBar({useCase} : NavbarProps) {
    return (
        <div className="w-full flex items-center justify-center h-[75px]">
        <div className="w-full max-w-[1200px] h-full flex flex-row justify-between items-center p-4 bg-gray-200 mt-5 rounded-md mx-2 md:mx-0 shadow-sm">
          <div>
            <Link href="/">
              <Image src='/icon.png' alt="HawksConnect Logo" width={50} height={50}/>
            </Link>
          </div>

          <div className="flex flex-row gap-5 items-center">
            

            <Link href="/faq">
              <div className="flex flex-row items-center gap-1">
                <h2 className="font-medium">FAQ</h2>
                <ArrowUpRight size={18}/>
                </div>

            </Link>



            {
              useCase == "landing" ? 
                <div>
                  <CTAButton/>
                </div> 
              : 
                null
            }


          </div>
        </div>
      </div>
    )
}