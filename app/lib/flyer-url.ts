export const FLYER_BUCKET = "flyers";

export function flyerSrc(flyer?: string | null): string | undefined {
    if (!flyer) {
        return undefined;
    }

    if (/^https?:\/\//i.test(flyer)) {
        return flyer;
    }

    const path = flyer.split("/").map(encodeURIComponent).join("/");

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${FLYER_BUCKET}/${path}`;
}
