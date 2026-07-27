import { OpenRouter } from '@openrouter/sdk';
import type { ChatContentItems } from '@openrouter/sdk/models';
import { z } from 'zod';

const EventOrNotSchema = z.object({ isEvent: z.boolean() });

const CAMPUSES = ['brandon', 'dale_mabry', 'plantcity', 'southshore', 'ybor', 'hawkslanding'] as const;

const EventInfoSchema = z.object({
  name: z.string().nullable(),
  description: z.string().nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  campus: z.enum(CAMPUSES).nullable(),
  location: z.string().nullable(),
});

export type EventInfo = z.infer<typeof EventInfoSchema>;


export type LLMAnalyzerConstructor = {
  apiKey?: string;
  passData?: unknown;

};

export class LLMAnalyzer {   
    
  private apiKey: string;
  private passData: unknown;

  constructor(options: LLMAnalyzerConstructor = {}) {

    const apiKey = options.apiKey ?? process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("OpenRouter key is required!");
    }

    this.apiKey = apiKey;
    this.passData = options.passData ?? "error";

  }

  private async userContent(): Promise<ChatContentItems[]> {

    const content: ChatContentItems[] = [
      { type: 'text', text: JSON.stringify(this.passData) },
    ];

    const displayUrl =
      typeof this.passData === 'object' && this.passData !== null && 'displayUrl' in this.passData
        ? this.passData.displayUrl
        : undefined;

    if (typeof displayUrl !== 'string') {
      return content;
    }

    try {
      const image = await fetch(displayUrl);

      if (!image.ok) {
        return content;
      }

      const mimeType = image.headers.get('content-type') ?? 'image/jpeg';
      const base64 = Buffer.from(await image.arrayBuffer()).toString('base64');

      content.push({
        type: 'image_url',
        imageUrl: { url: `data:${mimeType};base64,${base64}`, detail: 'high' },
      });
    } catch {
      return content;
    }

    return content;
  }

  async eventOrNot(): Promise<boolean> {

    const client = new OpenRouter({
        apiKey: this.apiKey,
    });

    const response = await client.chat.send({
        chatRequest: {
          model: 'openai/gpt-5.6',
          stream: false,
          messages: [
            { role: 'system', content: PROMPT_eventOrNot },
            { role: 'user', content: await this.userContent() },
          ],
          responseFormat: {
            type: 'json_schema',
            jsonSchema: {
              name: 'event_or_not',
              strict: true,
              schema: {
                type: 'object',
                properties: { isEvent: { type: 'boolean' } },
                required: ['isEvent'],
                additionalProperties: false,
              },
            },
          },
        },
    });

    if (!('choices' in response)) {
      throw new Error('Unexpected streaming response from OpenRouter');
    }

    const content = response.choices[0]?.message.content;

    if (typeof content !== 'string') {
      throw new Error('Empty response from OpenRouter');
    }

    return EventOrNotSchema.parse(JSON.parse(content)).isEvent;

  }

  async extractEventInfo(): Promise<EventInfo> {

    const client = new OpenRouter({
      apiKey: this.apiKey,
    });

    const response = await client.chat.send({
      chatRequest: {
        model: 'openai/gpt-5.6',
        stream: false,
        messages: [
          { role: 'system', content: PROMPT_extractEventInfo },
          { role: 'user', content: await this.userContent() },
        ],
        responseFormat: {
          type: 'json_schema',
          jsonSchema: {
            name: 'event_info',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                name: { type: ['string', 'null'] },
                description: { type: ['string', 'null'] },
                startTime: { type: ['string', 'null'] },
                endTime: { type: ['string', 'null'] },
                campus: { type: ['string', 'null'], enum: [...CAMPUSES, null] },
                location: { type: ['string', 'null'] },
              },
              required: ['name', 'description', 'startTime', 'endTime', 'campus', 'location'],
              additionalProperties: false,
            },
          },
        },
      },
    });

    if (!('choices' in response)) {
      throw new Error('Unexpected streaming response from OpenRouter');
    }

    const content = response.choices[0]?.message.content;

    if (typeof content !== 'string') {
      throw new Error('Empty response from OpenRouter');
    }

    return EventInfoSchema.parse(JSON.parse(content));

  }
}


const PROMPT_eventOrNot = `


You are a Master at Classifying Instagram Posts for Hillsborough College. You will be fed all information about the post that was made by one of the Instagram accounts of a student organization, along with the post's image, and you will need to decide if it's an event or not. Read any text printed on the image itself - flyers usually carry the date, time, and location there rather than in the caption. Highlights to look for are:
- the date and event of the date
- the day of the event If it's a collage of multiple events, classify it as false. Respond with a JSON object of the form {"isEvent": true} or {"isEvent": false}.


`

const PROMPT_extractEventInfo = `

You extract structured event details from Instagram posts made by student organizations at Hillsborough  College. You are given the raw scraped post (caption, timestamp, and other metadata) together with the post's image, and must return the event's details. The image is usually a flyer: read the text printed on it carefully, since the date, time, and location are often only there and not in the caption. When the caption and the flyer disagree, trust the flyer.

Rules:
- name: a short, human-readable title for the event. Do not include hashtags, emojis, or the organization's handle.
- description: 1-3 sentences summarizing what the event is, in plain prose. You may pull wording directly from the caption, but strip hashtags, emojis, and handles. Do not include the event's date, start/end time, or location in the description; those belong in their own fields.
- startTime / endTime: ISO 8601 timestamps with an offset, in Eastern Time (e.g. "2026-03-14T18:00:00-04:00"). Any time shown on the flyer or in the caption is already Eastern Time, so use it exactly as written and only attach the correct offset (-05:00 for EST, -04:00 for EDT). The post's own timestamp tells you roughly when it was published; use it to infer the year, and assume the event is in the future relative to that. If a start time is given but no end time, set endTime to one hour after the start. If no time of day is given but a date is, use T00:00:00 for the start and null for the end.
- campus: exactly one of these lowercase values, or null if the campus is not stated or clearly implied:
  - "brandon" for Brandon Campus
  - "dale_mabry" for Dale Mabry Campus
  - "plantcity" for Plant City Campus
  - "southshore" for Southshore Campus
  - "ybor" for Ybor Campus
  - "hawkslanding" for Hawks Landing
- location: the specific spot within the campus. Prefer the building and room designation (for example, "STU 104"), including an auditorium or hall name if one is given. If no room or building is listed, use the street address printed on the flyer or in the caption. Null if neither is stated.

Use null for anything the post does not state. Do not guess, do not invent details, and do not fill a field with text like "TBD" or "unknown".
`