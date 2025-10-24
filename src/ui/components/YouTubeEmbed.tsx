"use client";

import { useCookieConsent } from "@/hooks/useCookieConsent";

interface YouTubeEmbedProps {
	videoId: string;
	width?: string;
	height?: string;
	caption?: string;
}

/**
 * YouTube embed component that respects cookie consent
 * Shows the video only if user has accepted YouTube cookies
 */
export function YouTubeEmbed({ videoId, width = "100%", height = "450px", caption }: YouTubeEmbedProps) {
	const { hasConsent, openSettings } = useCookieConsent();
	const youtubeAllowed = hasConsent("youtube");

	if (youtubeAllowed) {
		return (
			<div className="editorjs-embed editorjs-youtube">
				<div className="relative" style={{ width, paddingBottom: "56.25%" }}>
					<iframe
						src={`https://www.youtube-nocookie.com/embed/${videoId}`}
						title={caption || "YouTube video"}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="absolute top-0 left-0 w-full h-full rounded-lg"
						style={{ border: "none" }}
					/>
				</div>
				{caption && <div className="editorjs-embed-caption mt-2 text-center text-sm text-gray-400">{caption}</div>}
			</div>
		);
	}

	// Show placeholder when consent is not given
	return (
		<div className="editorjs-embed editorjs-youtube-blocked">
			<div
				className="relative flex flex-col items-center justify-center bg-base-900 rounded-lg border-2 border-base-700 p-12"
				style={{ width, height }}
			>
				<svg
					className="w-16 h-16 text-base-600 mb-4"
					fill="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
				</svg>
				<p className="text-base-200 font-medium mb-2">YouTube video blocked</p>
				<p className="text-base-400 text-sm mb-4 px-4 text-center">
					This content requires your consent to view YouTube videos.
				</p>
				<button
					onClick={openSettings}
					className="px-4 py-2 bg-accent-700 hover:bg-accent-600 text-white rounded-lg transition-colors text-sm font-medium"
				>
					Manage Cookie Settings
				</button>
			</div>
			{caption && <div className="editorjs-embed-caption mt-2 text-center text-sm text-base-400">{caption}</div>}
		</div>
	);
}
