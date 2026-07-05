import CTAButton from "./CTAButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { supabase } from "./lib/supabase";

export default function Main() {

    async function handleSubmit (formData: FormData) {
      const query = formData.get('email') as string

      const {data, error} = await supabase.from('wailtlistEmails').insert({emal: `${query}`})

      if (error) {
        console.error('Error inserting:', error);
        alert("Failure when inserting =(");
        return
      }
      
      alert ("Success!")

    }

    return (
        <div className="flex justify-center items-center mt-15">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="font-extrabold text-4xl md:text-5xl bg-gradient-to-r from-[#06357A] to-[#001E60] bg-clip-text text-transparent">HawksConnect</h1>

          <div className="hawk-mark my-1"></div>

          <p className="text-center text-gray-600 text-lg max-w-[500px]">
            Every campus event, club meetup, and RSVP — all in one place for Hillsborough College students.
          </p>

          <div className="mt-15 text-center">
          <form action={handleSubmit}>
            <div className="p-3 bg-gray-200 rounded-xl flex flex-col md:flex-row gap-5 ">
            <Input 
                type="email"
                placeholder="test@gmail.com"
                className="w-70 h-10"
                name="email"
              />

              <Button type="submit" className="bg-[#001E60] hover:bg-[#06357A] h-10">Join waitlist!</Button>
            </div>
              </form>
          </div>




        </div>

      </div>
    )
}