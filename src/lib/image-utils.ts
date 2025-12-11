/**
 * Ensures image URLs use HTTPS to avoid mixed content warnings
 */
export function ensureHttps(url: string | null | undefined): string | undefined {
	if (!url) return undefined;
	
	// If already HTTPS or relative URL, return as-is
	if (url.startsWith("https://") || url.startsWith("/")) {
		return url;
	}
	
	// Convert HTTP to HTTPS
	if (url.startsWith("http://")) {
		return url.replace("http://", "https://");
	}
	
	return url;
}

/**
 * Process image object to ensure HTTPS
 */
export function processImageUrl<T extends { url: string }>(
	image: T | null | undefined
): T | undefined {
	if (!image) return undefined;
	
	return {
		...image,
		url: ensureHttps(image.url) || image.url,
	};
}
