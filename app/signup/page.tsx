"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MailCheck } from "lucide-react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "../lib/supabase"
import { campuses } from "../events/campusChoice"
import posthog from "posthog-js"

const ALLOWED_EMAIL_SUFFIX = "hccfl.edu"

export default function SignupPage() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [campus, setCampus] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!email.trim().toLowerCase().endsWith(ALLOWED_EMAIL_SUFFIX)) {
            setError("Use your Hawkmail (@hccfl.edu) email address")
            posthog.capture("signup_error_occurred", { error_reason: "invalid_email_domain" })
            return
        }
        if (!campus) {
            setError("Please select your home campus")
            posthog.capture("signup_error_occurred", { error_reason: "no_campus_selected" })
            return
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            posthog.capture("signup_error_occurred", { error_reason: "password_too_short" })
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match")
            posthog.capture("signup_error_occurred", { error_reason: "passwords_do_not_match" })
            return
        }

        setLoading(true)
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    campus,
                },
            },
        })
        setLoading(false)

        if (signUpError) {
            setError(signUpError.message)
            posthog.capture("signup_error_occurred", { error_reason: "server_error" })
            return
        }

        posthog.capture("user_signed_up", { campus })
        setSubmitted(true)
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-[400px]">

                <div className="flex items-center gap-2 mb-8 justify-center">
                    <Image src="/icon.png" alt="HawksConnect" width={32} height={32} className="rounded-md"/>
                    <span className="font-[family-name:var(--font-display)] font-semibold text-[#06357A]">HawksConnect</span>
                </div>

                {submitted ? (
                    <div className="flex flex-col items-center text-center gap-4 py-10">
                        <MailCheck size={40} color="#06357A"/>
                        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#06357A]">Check your inbox</h2>
                        <p className="text-gray-600">
                            We sent a confirmation link to <span className="font-medium">{email}</span>. Verify your email to finish creating your account.
                        </p>
                        <Link href="/login" className="text-sm text-[#06357A] font-medium underline underline-offset-4">
                            Back to log in
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#06357A] mb-1 text-center">Create your account</h1>
                        <p className="text-gray-500 mb-8 text-center">Join students across all five HC campuses.</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Full name</label>
                                <Input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Alex Hawkins"
                                    required
                                />
                            </div>

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
                                <label className="text-sm font-medium text-gray-700">Home campus</label>
                                <select
                                    value={campus}
                                    onChange={(e) => setCampus(e.target.value)}
                                    required
                                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-[#06357A] focus-visible:ring-[3px] focus-visible:ring-[#06357A]/20"
                                >
                                    <option value="" disabled>Select a campus</option>
                                    {campuses.map((c) => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 8 characters"
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

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Confirm password</label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    required
                                />
                            </div>

                            {error ? <p className="text-sm text-red-600">{error}</p> : null}

                            <Button type="submit" disabled={loading} className="bg-[#001E60] hover:bg-[#06357A] h-10 mt-2">
                                {loading ? "Creating account..." : "Create account"}
                            </Button>
                        </form>

                        <p className="text-sm text-gray-500 text-center mt-6">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[#06357A] font-medium underline underline-offset-4">
                                Log in
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}