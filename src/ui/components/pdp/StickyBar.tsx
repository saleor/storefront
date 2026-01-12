"use client";

import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/ui/components/ui/Button";
import { cn } from "@/lib/utils";

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
	const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolledPastThreshold(window.scrollY > 500);
		};

		// Check initial scroll position
		handleScroll();

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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
