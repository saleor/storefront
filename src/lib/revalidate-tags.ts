import { revalidateTag } from "next/cache";
import type { CacheLifeProfile, CacheProfile } from "@/lib/cache-manifest";

/**
 * Revalidate multiple tags in parallel.
 * Sequential revalidateTag() calls in one request only honor the first tag in some Next.js versions.
 */
export async function revalidateTags(
	entries: ReadonlyArray<{ tag: string; profile: CacheLifeProfile | CacheProfile["cacheProfile"] }>,
): Promise<string[]> {
	if (entries.length === 0) return [];

	await Promise.all(entries.map(({ tag, profile }) => revalidateTag(tag, profile)));
	return entries.map(({ tag }) => tag);
}
