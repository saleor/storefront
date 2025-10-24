"use client";

import { YouTubeEmbed } from "./YouTubeEmbed";

interface ProductVideoEmbedProps {
	embedUrl: string;
}

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
 */
function extractYouTubeVideoId(url: string): string | null {
	try {
		// Handle different YouTube URL formats
		const patterns = [
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
			/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
		];

		for (const pattern of patterns) {
			const match = url.match(pattern);
			if (match && match[1]) {
				return match[1];
			}
		}

		return null;
	} catch (error) {
		console.error("Error parsing YouTube URL:", error);
		return null;
	}
}

/**
 * Component that renders a YouTube video embed for product demo/preview videos
 * Respects cookie consent and only shows video if user has accepted YouTube cookies
 */
export function ProductVideoEmbed({ embedUrl }: ProductVideoEmbedProps) {
	// Extract video ID from the embed URL
	const videoId = extractYouTubeVideoId(embedUrl);

	// If we can't extract a video ID, don't render anything
	if (!videoId) {
		console.warn("Could not extract YouTube video ID from URL:", embedUrl);
		return null;
	}

	return (
		<div className="border-t border-base-800 pt-8 mt-8">
			<h2 className="mb-4 font-display text-xl font-light text-white">Product Demo</h2>
			<div className="rounded-lg overflow-hidden">
				<YouTubeEmbed videoId={videoId} width="100%" height="450px" />
			</div>
		</div>
	);
}
