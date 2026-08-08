"use client"

import { useEffect, useState } from "react"
import { Check, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabase"
import posthog from "posthog-js"

interface RSVPButtonProps {
    eventId: number
}

export default function RSVPButton({ eventId }: RSVPButtonProps) {
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null)
    const [isGoing, setIsGoing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setChecking(false)
                return
            }

            setUserId(user.id)

            const { data } = await supabase
                .from("rsvps")
                .select("id")
                .eq("user_id", user.id)
                .eq("event_id", eventId)
                .maybeSingle()

            setIsGoing(!!data)
            setChecking(false)
        }
        checkStatus()
    }, [eventId])

    const toggleRSVP = async () => {
        if (loading) return

        if (!userId) {
            router.push("/login")
            return
        }

        setLoading(true)

        if (isGoing) {
            const { error } = await supabase
                .from("rsvps")
                .delete()
                .eq("user_id", userId)
                .eq("event_id", eventId)

            setLoading(false)

            if (error) {
                console.error("Error removing RSVP:", error)
                alert("Couldn't update your RSVP — try again in a bit.")
                return
            }

            posthog.capture("event_unrsvp", { event_id: eventId })
            setIsGoing(false)
        } else {
            const { error } = await supabase
                .from("rsvps")
                .insert({ user_id: userId, event_id: eventId })

            setLoading(false)

            if (error) {
                console.error("Error creating RSVP:", error)
                alert("Couldn't save your RSVP — try again in a bit.")
                return
            }

            posthog.capture("event_rsvp", { event_id: eventId })
            setIsGoing(true)
        }
    }

    if (checking) return null

    return (
        <Button
            onClick={toggleRSVP}
            disabled={loading}
            className={
                isGoing
                    ? "bg-white text-[#06357A] border border-[#06357A] hover:bg-gray-50"
                    : "bg-[#001E60] hover:bg-[#06357A] text-white"
            }
        >
            {isGoing ? (
                <span className="flex items-center gap-2"><Check size={16}/> You&apos;re going</span>
            ) : (
                <span className="flex items-center gap-2"><PartyPopper size={16}/> RSVP</span>
            )}
        </Button>
    )
}