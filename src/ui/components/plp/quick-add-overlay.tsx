"use client";

import { Plus } from "lucide-react";
import { Button } from "@/ui/components/ui/button";

interface QuickAddOverlayProps {
	onQuickAdd: () => void;
	/** Preview — always visible on desktop instead of hover-only. */
	alwaysVisible?: boolean;
}

export function QuickAddOverlay({ onQuickAdd, alwaysVisible = false }: QuickAddOverlayProps) {
	return (
		<div
			className={
				alwaysVisible
					? "absolute bottom-0 left-0 right-0 hidden p-3 md:block"
					: "absolute bottom-0 left-0 right-0 hidden translate-y-2 p-3 opacity-0 transition-all duration-300 md:block md:group-hover:translate-y-0 md:group-hover:opacity-100"
			}
		>
			<Button
				className="w-full"
				size="sm"
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onQuickAdd();
				}}
			>
				<Plus className="mr-1.5 h-4 w-4" />
				Quick Add
			</Button>
		</div>
	);
}
