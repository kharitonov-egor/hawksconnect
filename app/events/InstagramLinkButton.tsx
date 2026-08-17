"use client"

import { ExternalLink, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import posthog from "posthog-js"

interface InstagramLinkButtonProps {
    instaShortURL: string
    club?: string
    campus?: string
}

export default function InstagramLinkButton({ instaShortURL, club, campus }: InstagramLinkButtonProps) {
    if (!instaShortURL) return null

    return (
        <Button
            asChild
            className="bg-linear-to-r from-[#833AB4] to-[#E1306C] hover:from-[#9B4FD1] hover:to-[#F56040] text-white border-0 font-semibold"
        >
            <a
                href={`https://instagram.com/p/${instaShortURL}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Opens the club's original Instagram post for this event"
                onClick={() => posthog.capture("event_instagram_link_clicked", { club, campus })}
            >
                <Instagram size={16}/> See original post
                <ExternalLink size={14} className="opacity-80"/>
            </a>
        </Button>
    )
}
