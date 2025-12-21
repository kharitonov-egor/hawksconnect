"use client"

import { Button } from "@/components/ui/button"

export default function CTAButton () {
    return (
        <Button asChild className="bg-[#001E60] hover:bg-[#06357A]">
            <a href="/events">Try it now</a>
        </Button>

    )
}