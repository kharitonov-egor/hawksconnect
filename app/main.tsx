"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Main() {

    const router = useRouter()

    return (
        <div className="flex justify-center items-center mt-15">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="font-extrabold text-4xl md:text-5xl bg-gradient-to-r from-[#06357A] to-[#001E60] bg-clip-text text-transparent">HawksConnect</h1>

          <div className="hawk-mark my-1"></div>

          <p className="text-center text-gray-600 text-lg max-w-[500px]">
            Every campus event, club meetup, and RSVP in one place for Hillsborough College students.
          </p>

          <div className="mt-10 text-center">
            <Button
                onClick={() => router.push("/events")}
                className="bg-[#001E60] hover:bg-[#06357A] h-11 px-6 text-base"
            >
                Try it now
            </Button>
          </div>

        </div>

      </div>
    )
}