"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormStatus } from "react-dom";
import { ShoppingBag } from "lucide-react";
import { throttle } from "lodash-es";
import { Button } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";

/** Scroll threshold (in pixels) before showing the sticky bar */
const SCROLL_THRESHOLD = 500;

interface StickyBarProps {
	productName: string;
	price: string;
	show?: boolean;
}

function StickyAddButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			type="submit"
			size="lg"
			disabled={pending}
			className={cn(
				"min-w-[130px] shrink-0",
				// Override transition to prevent flash on state change
				"transition-none disabled:opacity-100",
			)}
		>
			<ShoppingBag className="h-4 w-4" />
			{pending ? "Adding..." : "Add to bag"}
		</Button>
	);
}

export function StickyBar({ productName, price, show = false }: StickyBarProps) {
	// Initialize with current scroll position (avoids flash on page load)
	const [scrolledPastThreshold, setScrolledPastThreshold] = useState(
		() => typeof window !== "undefined" && window.scrollY > SCROLL_THRESHOLD,
	);

	// Throttle scroll handler to avoid excessive updates (especially on low-end devices)
	const handleScroll = useMemo(
		() =>
			throttle(() => {
				setScrolledPastThreshold(window.scrollY > SCROLL_THRESHOLD);
			}, 100),
		[],
	);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			handleScroll.cancel(); // Cancel any pending throttled calls
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	// Only show if both conditions are met
	const isVisible = show && scrolledPastThreshold;

	return (
		<div
			className={cn(
				"fixed bottom-0 left-0 right-0 z-50 border-t bg-background transition-transform duration-300 md:hidden",
				isVisible ? "translate-y-0" : "translate-y-full",
			)}
		>
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
				<div className="min-w-0 flex-1">
					<p className="truncate font-medium">{productName}</p>
					<p className="text-sm text-muted-foreground">{price}</p>
				</div>
				<StickyAddButton />
			</div>
		</div>
	);
}
