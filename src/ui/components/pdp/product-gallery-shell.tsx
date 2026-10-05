import { cn } from "@/lib/utils";

interface ProductGalleryShellProps {
	/** Total images — used for dots/thumbnail placeholder count when chrome is shown */
	imageCount: number;
	/** When false, only the main stage is rendered (avoids chrome flicker in skeletons/fallbacks) */
	showChrome?: boolean;
	/** `start` reserves a left thumbnail column from the `md` breakpoint. */
	thumbnailPlacement?: "below" | "start";
	children: React.ReactNode;
}

/**
 * Shared PDP gallery layout: main stage + mobile dots + desktop thumbnail strip.
 * Used by the Suspense fallback and skeleton so the streamed carousel does not shift layout.
 */
export function ProductGalleryShell({
	imageCount,
	children,
	showChrome = imageCount > 1,
	thumbnailPlacement = "below",
}: ProductGalleryShellProps) {
	const thumbs = showChrome ? (
		<div
			className={cn(
				"scrollbar-hide hidden gap-2 px-1 py-1 md:flex",
				thumbnailPlacement === "start" ? "flex-col" : "overflow-x-auto",
			)}
			aria-hidden
		>
			{Array.from({ length: imageCount }).map((_, index) => (
				<div
					key={index}
					className={cn(
						"relative isolate h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-secondary",
						index === 0 ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "opacity-60",
					)}
				/>
			))}
		</div>
	) : null;

	return (
		<div
			className={cn(
				"flex gap-4",
				thumbnailPlacement === "start" ? "flex-col md:flex-row md:items-start" : "flex-col",
			)}
		>
			{thumbnailPlacement === "start" ? thumbs : null}
			<div className="w-full min-w-0 flex-1">
				{children}
				{showChrome ? (
					<div className="mt-4 flex justify-center gap-1.5 md:hidden" aria-hidden>
						{Array.from({ length: imageCount }).map((_, index) => (
							<span
								key={index}
								className={cn("h-2 w-2 rounded-full", index === 0 ? "bg-foreground" : "bg-border")}
							/>
						))}
					</div>
				) : null}
			</div>
			{thumbnailPlacement === "below" ? thumbs : null}
		</div>
	);
}
