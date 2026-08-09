"use client"

import { useEffect, useState } from "react"
import { Check, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabase"

interface FollowButtonProps {
    organizerId: number
}

export default function FollowButton({ organizerId }: FollowButtonProps) {
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null)
    const [isFollowing, setIsFollowing] = useState(false)
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
                .from("club_follows")
                .select("id")
                .eq("user_id", user.id)
                .eq("organizer_id", organizerId)
                .maybeSingle()

            setIsFollowing(!!data)
            setChecking(false)
        }
        checkStatus()
    }, [organizerId])

    const toggleFollow = async () => {
        if (loading) return

        if (!userId) {
            router.push("/login")
            return
        }

        setLoading(true)

        if (isFollowing) {
            const { error } = await supabase
                .from("club_follows")
                .delete()
                .eq("user_id", userId)
                .eq("organizer_id", organizerId)

            setLoading(false)
            if (error) {
                console.error("Error unfollowing:", error)
                alert("Couldn't update — try again in a bit.")
                return
            }
            setIsFollowing(false)
        } else {
            const { error } = await supabase
                .from("club_follows")
                .insert({ user_id: userId, organizer_id: organizerId })

            setLoading(false)
            if (error) {
                console.error("Error following:", error)
                alert("Couldn't update — try again in a bit.")
                return
            }
            setIsFollowing(true)
        }
    }

    if (checking) return null

    return (
        <Button
            onClick={toggleFollow}
            disabled={loading}
            className={
                isFollowing
                    ? "bg-white text-[#06357A] border border-[#06357A] hover:bg-gray-50"
                    : "bg-[#001E60] hover:bg-[#06357A] text-white"
            }
        >
            {isFollowing ? (
                <span className="flex items-center gap-2"><Check size={16}/> Following</span>
            ) : (
                <span className="flex items-center gap-2"><Bell size={16}/> Follow</span>
            )}
        </Button>
    )
}