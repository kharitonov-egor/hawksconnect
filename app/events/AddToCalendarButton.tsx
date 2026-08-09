"use client"

import { useEffect, useRef, useState } from "react"
import { CalendarPlus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildGoogleCalendarUrl, buildOutlookUrl, downloadICS } from "../lib/calendar-links"

interface AddToCalendarButtonProps {
    title: string
    description?: string
    location?: string
    startTime: string
    endTime?: string
}

export default function AddToCalendarButton(props: AddToCalendarButtonProps) {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const options = [
        {
            label: "Google Calendar",
            action: () => window.open(buildGoogleCalendarUrl(props), "_blank"),
        },
        {
            label: "Apple Calendar",
            action: () => downloadICS(props),
        },
        {
            label: "Microsoft 365",
            action: () => window.open(buildOutlookUrl(props), "_blank"),
        },
        {
            label: "Download .ics",
            action: () => downloadICS(props),
        },
    ]

    return (
        <div className="relative w-fit" ref={containerRef}>
            <Button
                onClick={() => setOpen(!open)}
                variant="outline"
                className="border-[#06357A] text-[#06357A] hover:bg-[#06357A]/5"
            >
                <CalendarPlus size={16}/> Add to Calendar
            </Button>

            {open && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-md z-50 py-1">
                    {options.map((opt) => (
                        <button
                            key={opt.label}
                            onClick={() => { opt.action(); setOpen(false) }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            {opt.label === "Download .ics" ? <Download size={14}/> : <CalendarPlus size={14}/>}
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}