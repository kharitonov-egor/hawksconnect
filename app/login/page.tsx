"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "../lib/supabase"
import posthog from "posthog-js"

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        setLoading(false)

        if (signInError) {
            setError(signInError.message === "Invalid login credentials"
                ? "Incorrect email or password"
                : signInError.message)
            posthog.capture("login_failed", {
                error_message: signInError.message,
            })
            return
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            posthog.identify(user.id, {
                campus: user.user_metadata?.campus,
            })
            posthog.capture("user_logged_in")
        }

        router.push("/events")
        router.refresh()
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-[400px]">

                <div className="flex items-center gap-2 mb-8 justify-center">
                    <Image src="/icon.png" alt="HawksConnect" width={32} height={32} className="rounded-md"/>
                    <span className="font-[family-name:var(--font-display)] font-semibold text-[#06357A]">HawksConnect</span>
                </div>

                <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#06357A] mb-1 text-center">Log in</h1>
                <p className="text-gray-500 mb-8 text-center">Good to see you again.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Hawkmail email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="yourname@hccfl.edu"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                            </button>
                        </div>
                    </div>

                    {error ? <p className="text-sm text-red-600">{error}</p> : null}

                    <Button type="submit" disabled={loading} className="bg-[#001E60] hover:bg-[#06357A] h-10 mt-2">
                        {loading ? "Logging in..." : "Log in"}
                    </Button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-6">
                    New to HawksConnect?{" "}
                    <Link href="/signup" className="text-[#06357A] font-medium underline underline-offset-4">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    )
}