import { cn } from "@/lib/utils";

interface GalleryProgressDotsProps {
	count: number;
	activeIndex: number;
	onSelect?: (index: number) => void;
	getAriaLabel: (index: number) => string;
	className?: string;
}

/**
 * Pill-style gallery position indicators — active dot expands horizontally.
 * Shared by PDP galleries and the fullscreen image viewer.
 */
export function GalleryProgressDots({
	count,
	activeIndex,
	onSelect,
	getAriaLabel,
	className,
}: GalleryProgressDotsProps) {
	if (count <= 1) return null;

	return (
		<div className={cn("flex items-center justify-center gap-1.5", className)} role="group">
			{Array.from({ length: count }).map((_, index) => {
				const isActive = activeIndex === index;

				return (
					<button
						key={index}
						type="button"
						onClick={onSelect ? () => onSelect(index) : undefined}
						disabled={!onSelect}
						aria-label={getAriaLabel(index + 1)}
						aria-current={isActive ? "true" : undefined}
						className={cn(
							"h-2 rounded-full transition-all",
							isActive ? "w-5 bg-foreground" : "w-2 bg-border",
							onSelect && !isActive && "hover:bg-muted-foreground",
							!onSelect && "cursor-default",
						)}
					/>
				);
			})}
		</div>
	);
}
