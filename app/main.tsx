import CTAButton from "./CTAButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { supabase } from "./lib/supabase";
import posthog from "posthog-js";

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
        <div className="flex justify-center items-center mt-15">
        <div className="flex flex-col gap-2 items-center px-5">
          <h1 className="font-extrabold text-4xl md:text-5xl bg-gradient-to-r from-[#06357A] to-[#001E60] bg-clip-text text-transparent">HawksConnect</h1>

          <div className="hawk-mark my-1"></div>

          <p className="text-center text-gray-600 text-lg max-w-[500px]">
            Every campus event, club meetup in one place for Hillsborough College students.
          </p>

          <div className="mt-15 text-center">
            <CTAButton/>
          </div>




        </div>

      </div>
    )
}