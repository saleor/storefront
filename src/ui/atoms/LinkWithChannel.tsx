"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type ComponentProps, useEffect, useRef } from "react";

// Cache for prefetched images per pathname
const imageCache = new Map<string, string[]>();

/**
 * Enhanced Link component with NextFaster-style image prefetching
 * - Prefetches route on intersection (viewport visibility)
 * - Prefetches images on hover for instant navigation
 * - Integrates with channel-based routing
 */
export const LinkWithChannel = ({
	href,
	prefetch = true,
	...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) => {
	const { channel } = useParams<{ channel?: string }>();
	const router = useRouter();
	const linkRef = useRef<HTMLAnchorElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	// Build final href with channel
	const finalHref = href.startsWith("/")
		? `/${encodeURIComponent(channel ?? "")}${href}`
		: href;

	/**
	 * Prefetch images for a given pathname
	 */
	async function prefetchImages(pathname: string) {
		// Check cache first
		if (imageCache.has(pathname)) {
			const cached = imageCache.get(pathname)!;
			cached.forEach(prefetchImage);
			return;
		}

		try {
			// Fetch images from API
			const response = await fetch(
				`/api/prefetch-images?pathname=${encodeURIComponent(pathname)}&channel=${encodeURIComponent(channel ?? "default-channel")}`,
			);
			const data = (await response.json()) as { images: string[] };

			// Cache the results
			imageCache.set(pathname, data.images);

			// Prefetch each image
			data.images.forEach((src: string) => prefetchImage(src));
		} catch (error) {
			console.error("Failed to prefetch images:", error);
		}
	}

	/**
	 * Prefetch a single image using Image() constructor
	 */
	function prefetchImage(src: string) {
		const img = new Image();
		img.decoding = "async";
		img.src = src;
	}

	/**
	 * Intersection Observer for viewport-based prefetching
	 */
	useEffect(() => {
		if (!prefetch || !linkRef.current || !finalHref.startsWith("/")) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Debounce prefetch by 300ms to avoid unnecessary fetches
						timeoutRef.current = setTimeout(() => {
							router.prefetch(finalHref);
							prefetchImages(href); // Use original href without channel for API
						}, 300);
					} else {
						// Clear timeout if link leaves viewport before delay completes
						if (timeoutRef.current) {
							clearTimeout(timeoutRef.current);
						}
					}
				});
			},
			{ threshold: 0.1 }, // Trigger when 10% visible
		);

		observer.observe(linkRef.current);

		return () => {
			observer.disconnect();
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [finalHref, href, prefetch, router]);

	/**
	 * Hover prefetch handler
	 */
	const handleMouseEnter = () => {
		if (prefetch && finalHref.startsWith("/")) {
			router.prefetch(finalHref);
			prefetchImages(href);
		}
	};

	// For external links, use default Link behavior
	if (!href.startsWith("/")) {
		return <Link {...props} href={href} prefetch={prefetch} />;
	}

	return (
		<Link
			ref={linkRef}
			{...props}
			href={finalHref}
			prefetch={false} // Disable default prefetch, use custom logic
			onMouseEnter={handleMouseEnter}
		/>
	);
};
