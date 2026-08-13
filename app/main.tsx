"use client"

import CTAButton from "./CTAButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CalendarDays,
  Music,
  Trophy,
  Coffee,
  Users,
  MessageCircle,
  Ticket,
  BookOpen,
  Mic2,
  Sparkles,
  PartyPopper,
  Camera,
  Star,
  GraduationCap,
  Gamepad2,
  Heart,
  Palette,
  Megaphone,
  Award,
  Gift,
} from "lucide-react"

import { supabase } from "./lib/supabase";
import posthog from "posthog-js";

const floatingIcons = [
  { Icon: CalendarDays, size: 46, top: "6%", left: "6%", rot: -12, delay: "0s", duration: "5s" },
  { Icon: Music, size: 38, top: "10%", left: "88%", rot: 12, delay: "0.4s", duration: "5.5s" },
  { Icon: Trophy, size: 36, top: "20%", left: "70%", rot: -12, delay: "0.8s", duration: "4.5s" },
  { Icon: Mic2, size: 40, top: "8%", left: "45%", rot: 6, delay: "1.2s", duration: "5.2s" },
  { Icon: Users, size: 42, top: "78%", left: "8%", rot: 12, delay: "0.2s", duration: "6s" },
  { Icon: Coffee, size: 36, top: "82%", left: "85%", rot: -6, delay: "1.6s", duration: "4.8s" },
  { Icon: Sparkles, size: 38, top: "70%", left: "30%", rot: 12, delay: "0.6s", duration: "5.4s" },
  { Icon: Ticket, size: 34, top: "75%", left: "60%", rot: -6, delay: "1s", duration: "5s" },
  { Icon: BookOpen, size: 32, top: "88%", left: "45%", rot: 6, delay: "1.4s", duration: "4.6s" },
  { Icon: MessageCircle, size: 32, top: "40%", left: "4%", rot: -12, delay: "0.3s", duration: "5.6s" },
  { Icon: PartyPopper, size: 36, top: "30%", left: "92%", rot: -8, delay: "1.8s", duration: "5.3s" },
  { Icon: Camera, size: 30, top: "55%", left: "94%", rot: 10, delay: "0.7s", duration: "4.7s" },
  { Icon: Star, size: 28, top: "60%", left: "3%", rot: -10, delay: "1.1s", duration: "5.8s" },
  { Icon: GraduationCap, size: 40, top: "15%", left: "60%", rot: 8, delay: "0.5s", duration: "5.1s" },
  { Icon: Gamepad2, size: 32, top: "50%", left: "20%", rot: -6, delay: "1.5s", duration: "4.9s" },
  { Icon: Heart, size: 28, top: "35%", left: "78%", rot: 12, delay: "0.9s", duration: "5.7s" },
  { Icon: Megaphone, size: 32, top: "18%", left: "18%", rot: 10, delay: "0.6s", duration: "5s" },
  { Icon: Palette, size: 34, top: "24%", left: "30%", rot: -8, delay: "1.3s", duration: "5.4s" },
  { Icon: Award, size: 34, top: "48%", left: "83%", rot: -10, delay: "1.7s", duration: "5.6s" },
  { Icon: Gift, size: 30, top: "60%", left: "88%", rot: 8, delay: "0.9s", duration: "4.8s" },
]

export default function Main() {

    async function handleSubmit (formData: FormData) {
      const query = formData.get('email') as string

      const {data, error} = await supabase.from('wailtlistEmails').insert({emal: `${query}`})

      if (error) {
        console.error('Error inserting:', error);
        alert("Failure when inserting =(");
        return
      }

      posthog.capture("waitlist_email_submitted")

      alert ("Success!")

    }

    return (
        <div className="flex-1 relative overflow-hidden bg-[#06357A] flex items-center justify-center min-h-[calc(100vh-80px)]">

          <div className="absolute inset-0 overflow-hidden opacity-35 text-white pointer-events-none">
            {floatingIcons.map(({ Icon, size, top, left, rot, delay, duration }, i) => (
              <Icon
                key={i}
                size={size}
                className="absolute icon-float"
                style={{
                  top,
                  left,
                  "--icon-rot": `${rot}deg`,
                  animationDelay: delay,
                  animationDuration: duration,
                } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col gap-2 items-center px-5 text-center">
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#D9C596]">
              Hillsborough College
            </span>

            <h1 className="font-extrabold text-4xl md:text-5xl text-white mt-1">HawksConnect</h1>

            <div className="hawk-mark my-1"></div>

            <p className="text-center text-white/85 text-lg max-w-[500px]">
              Every campus event, club meetup in one place for Hillsborough College students.
            </p>

            <div className="mt-8 text-center">
              <CTAButton/>
            </div>
          </div>

        </div>
    )
}