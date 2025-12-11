"use client";

import { Grid3X3, List } from "lucide-react";
import { clsx } from "clsx";

export interface ViewToggleProps {
	view: "grid" | "list";
	onViewChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
	return (
		<div className="flex items-center border border-secondary-200 rounded-md overflow-hidden">
			<button
				onClick={() => onViewChange("grid")}
				className={clsx(
					"p-2 transition-colors",
					view === "grid" 
						? "bg-primary-600 text-white" 
						: "bg-white text-secondary-600 hover:bg-secondary-50"
				)}
				aria-label="Grid view"
				aria-pressed={view === "grid"}
			>
				<Grid3X3 className="h-4 w-4" />
			</button>
			<button
				onClick={() => onViewChange("list")}
				className={clsx(
					"p-2 transition-colors",
					view === "list" 
						? "bg-primary-600 text-white" 
						: "bg-white text-secondary-600 hover:bg-secondary-50"
				)}
				aria-label="List view"
				aria-pressed={view === "list"}
			>
				<List className="h-4 w-4" />
			</button>
		</div>
	);
}