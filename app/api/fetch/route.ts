import { NextRequest, NextResponse } from "next/server";
import { InstagramScraper } from "@/app/lib/apify";
import { LLMAnalyzer } from "@/app/lib/llm";
import { uploadFlyer } from "@/app/lib/flyer-storage";

import { supabase } from "@/app/lib/supabase";

type ScrapedPost = {
    id?: string;
    shortCode?: string;
    displayUrl?: string;
};

export async function GET(req: NextRequest) {

    try {
        
        const {data, error} = await supabase.from("organizers").select('*').not('socialLinks', 'is', null);

        const organizerList = data

        let insertedCount = 0

        if (organizerList) {

            for (const organizer of organizerList) {

                if (organizer.socialLinks.instagram) {

                    const {data, error} = await supabase.from("events_test").select('*').eq('organizer', organizer.id)
                    
                    const organizerEvents = data;
                    const noEventsOrg = organizerEvents?.length === 0;

                    const scraper = new InstagramScraper({
                        accountScraped: organizer.socialLinks.instagram,
                        resultsLimit: noEventsOrg ? 30 : 7,
                        onlyPostsNewerThan: noEventsOrg ? "2 months" : "4 hours",
                    });



                    const scrapedEventsofOrgRAW = await scraper.scrape()


                    // now that we have only unique events that were posted in last 4 hours, time to anaylyze them via AI if its event or not

                    

                    const alreadyStored = new Set(organizerEvents?.map(e => e.instaShortURL))

                    const scrapedEvents: ScrapedPost[] = []

                    for (const event of scrapedEventsofOrgRAW as ScrapedPost[]) {

                        if (event.shortCode && alreadyStored.has(event.shortCode)) {
                            continue
                        }

                        const LLM = new LLMAnalyzer({
                            passData: event
                        })

                        const eventOrNot = await LLM.eventOrNot()

                        if (eventOrNot) {
                            scrapedEvents.push(event)
                        }

                    }


                    for (const event of scrapedEvents) {

                        const LLM = new LLMAnalyzer({
                            passData: event
                        })

                        const eventInfo = await LLM.extractEventInfo()

                        const flyerName = `${organizer.id}/${event.shortCode ?? event.id ?? crypto.randomUUID()}`
                        const flyerPath = event.displayUrl
                            ? await uploadFlyer(event.displayUrl, flyerName)
                            : null

                        const { error: insertError } = await supabase.from("events_test").insert({
                            ...eventInfo,
                            organizer: organizer.id,
                            instaShortURL: event.shortCode ?? null,
                            instagramIDofPost: event.id ?? null,
                            flyerURL: flyerPath ?? event.displayUrl ?? null,
                        })

                        if (insertError) {
                            console.error(`Failed to insert event for organizer ${organizer.id}:`, insertError.message)
                        } else {
                            insertedCount++
                        }

                    }





                

                }
            }

        }

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ inserted: insertedCount });

    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });

    }
}
