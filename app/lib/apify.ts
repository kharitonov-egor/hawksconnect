import { ApifyClient } from "apify-client";

export type InstagramScraperConstructor = {
  apiKey?: string;
  accountScraped?: string;
  resultsLimit?: number;
  onlyPostsNewerThan?: string;
};

export class InstagramScraper {  
    
  private apiKey: string;
  private accountScraped: string;
  private resultsLimit: number;
  private apifyActorID: string;
  private onlyPostsNewerThan: string;

  constructor(options: InstagramScraperConstructor = {}) {
    const apiKey = process.env.APIFY_KEY;
    if (!apiKey) {
      throw new Error("Apify API key is required (APIFY_KEY env var or options.apiKey)");
    }

    this.apiKey = apiKey;
    this.accountScraped = options.accountScraped ?? "https://www.instagram.com/kharitonoffegor";
    this.resultsLimit = options.resultsLimit ?? 5;
    this.onlyPostsNewerThan = options.onlyPostsNewerThan ?? "1 day";
    this.apifyActorID = "nH2AHrwxeTRJoN5hX"
  }

  async scrape(): Promise<unknown> {

    const client = new ApifyClient({
        token: this.apiKey,
    });

    const input = {
        "username": [this.accountScraped],
        "resultsLimit": this.resultsLimit,
        "onlyPostsNewerThan": this.onlyPostsNewerThan,
        "skipPinnedPosts": false,
        "dataDetailLevel": "basicData"
    };

    const run = await client.actor(this.apifyActorID).call(input);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return items;
  }
}
