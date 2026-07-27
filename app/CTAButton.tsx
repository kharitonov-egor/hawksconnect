"use client"

import { Button } from "@/components/ui/button"
import posthog from "posthog-js"

export default function CTAButton () {
    return (
        <Button asChild className="bg-[#001E60] hover:bg-[#06357A]">
            <a href="/events" onClick={() => posthog.capture("cta_clicked")}>Try it now</a>
        </Button>

    )
}