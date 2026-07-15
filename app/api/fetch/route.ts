import { NextRequest, NextResponse } from "next/server";
import { InstagramScraper } from "@/app/lib/apify";

import { supabase } from "@/app/lib/supabase";

export async function GET(req: NextRequest) {

    try {
        
        const {data, error} = await supabase.from("organizers").select('*').not('socialLinks', 'is', null);

        

        if (error) {
            NextResponse.json("suka", { status: 500 });
        }



        const scraper = new InstagramScraper({accountScraped: "https://www.instagram.com/usfathletics"});
        const testing = await scraper.scrape();

        return NextResponse.json(testing);



    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });

    }

}