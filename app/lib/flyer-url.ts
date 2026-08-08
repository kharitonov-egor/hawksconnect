import { supabase } from "./supabase"

// Name of the Supabase Storage bucket flyers are uploaded to.
// Confirm this matches what Egor actually named it in his Supabase project —
// check Supabase dashboard → Storage → bucket list.
const FLYER_BUCKET = "flyers"

export function flyerSrc(flyerURL?: string): string | undefined {
    if (!flyerURL) return undefined

    if (flyerURL.startsWith("http://") || flyerURL.startsWith("https://")) {
        return flyerURL
    }

    const { data } = supabase.storage.from(FLYER_BUCKET).getPublicUrl(flyerURL)
    return data?.publicUrl
}