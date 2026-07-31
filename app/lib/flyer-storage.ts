import { supabaseAdmin } from "./supabase-admin";
import { FLYER_BUCKET } from "./flyer-url";

const EXTENSIONS: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
};

let bucketReady: Promise<void> | null = null;

function ensureBucket(): Promise<void> {
    if (!bucketReady) {
        bucketReady = supabaseAdmin.storage
            .createBucket(FLYER_BUCKET, { public: true })
            .then(({ error }) => {
                if (error && !/exist/i.test(error.message)) {
                    throw new Error(error.message);
                }
            })
            .catch((e) => {
                bucketReady = null;
                throw e;
            });
    }

    return bucketReady;
}

export async function uploadFlyer(sourceUrl: string, name: string): Promise<string | null> {
    try {
        await ensureBucket();

        const response = await fetch(sourceUrl);

        if (!response.ok) {
            console.error(`Failed to download flyer ${sourceUrl}: ${response.status}`);
            return null;
        }

        const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "image/jpeg";
        const path = `${name}.${EXTENSIONS[contentType] ?? "jpg"}`;

        const { error } = await supabaseAdmin.storage
            .from(FLYER_BUCKET)
            .upload(path, await response.arrayBuffer(), { contentType, upsert: true });

        if (error) {
            console.error(`Failed to upload flyer ${path}:`, error.message);
            return null;
        }

        return path;
    } catch (e) {
        console.error(`Failed to store flyer ${sourceUrl}:`, (e as Error).message);
        return null;
    }
}
