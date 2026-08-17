"use client"

import { Button } from "@/components/ui/button"
import posthog from "posthog-js"

export default function CTAButton () {
    return (
        <Button asChild className="bg-[#B99C5F] hover:bg-[#a88a4f] text-white font-semibold md:h-12 md:px-8 md:text-lg">
            <a href="/events" onClick={() => posthog.capture("cta_clicked")}>Try it now</a>
        </Button>

    )
}