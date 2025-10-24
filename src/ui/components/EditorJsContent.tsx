"use client";

import { useMemo } from "react";
import { YouTubeEmbed } from "./YouTubeEmbed";

interface EditorJsContentProps {
	html: string;
	className?: string;
}

interface YouTubeEmbedData {
	videoId: string;
	width?: string;
	height?: string;
	caption?: string;
}

interface ParsedContent {
	htmlParts: string[];
	youtubeEmbeds: YouTubeEmbedData[];
}

/**
 * Parse HTML and extract YouTube placeholders
 */
function parseHtmlWithYouTube(html: string): ParsedContent {
	// Split HTML by YouTube placeholders
	const youtubeRegex =
		/<div[^>]*class="youtube-embed-placeholder"[^>]*data-video-id="([^"]+)"(?:[^>]*data-width="([^"]*)")?(?:[^>]*data-height="([^"]*)")?(?:[^>]*data-caption="([^"]*)")?[^>]*><\/div>/g;

	const htmlParts: string[] = [];
	const youtubeEmbeds: YouTubeEmbedData[] = [];

	let lastIndex = 0;
	let match;

	while ((match = youtubeRegex.exec(html)) !== null) {
		// Add HTML before this placeholder
		htmlParts.push(html.substring(lastIndex, match.index));

		// Extract YouTube data
		youtubeEmbeds.push({
			videoId: match[1],
			width: match[2] || undefined,
			height: match[3] || undefined,
			caption: match[4] || undefined,
		});

		lastIndex = match.index + match[0].length;
	}

	// Add remaining HTML
	htmlParts.push(html.substring(lastIndex));

	return { htmlParts, youtubeEmbeds };
}

/**
 * Client component that renders Editor.js HTML content and hydrates
 * YouTube embeds with cookie consent support
 */
export function EditorJsContent({ html, className = "" }: EditorJsContentProps) {
	const { htmlParts, youtubeEmbeds } = useMemo(() => parseHtmlWithYouTube(html), [html]);

	// If no YouTube embeds, render HTML as-is
	if (youtubeEmbeds.length === 0) {
		return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
	}

	// Render HTML parts with YouTube embeds interleaved
	return (
		<div className={className}>
			{htmlParts.map((htmlPart, index) => (
				<span key={index}>
					<span dangerouslySetInnerHTML={{ __html: htmlPart }} />
					{youtubeEmbeds[index] && (
						<YouTubeEmbed
							videoId={youtubeEmbeds[index].videoId}
							width={youtubeEmbeds[index].width}
							height={youtubeEmbeds[index].height}
							caption={youtubeEmbeds[index].caption}
						/>
					)}
				</span>
			))}
		</div>
	);
}
