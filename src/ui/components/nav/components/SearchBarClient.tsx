"use client";

import { useEffect, useRef } from "react";
import { SearchIcon } from "lucide-react";

interface SearchBarClientProps {
	onSubmit: (formData: FormData) => Promise<void>;
}

/**
 * Client-side search bar with ⌘K keyboard shortcut support.
 */
export function SearchBarClient({ onSubmit }: SearchBarClientProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			// ⌘K (Mac) or Ctrl+K (Windows/Linux)
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				inputRef.current?.focus();
			}
			// Escape to blur
			if (e.key === "Escape" && document.activeElement === inputRef.current) {
				inputRef.current?.blur();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<form action={onSubmit} className="group relative w-full max-w-md">
			<label className="relative block">
				<span className="sr-only">Search for products</span>
				{/* Search icon */}
				<span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
					<SearchIcon
						className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground"
						aria-hidden
					/>
				</span>
				{/* Input */}
				<input
					ref={inputRef}
					type="text"
					name="search"
					placeholder="Search for products..."
					autoComplete="off"
					required
					className="hover:bg-secondary/80 h-10 w-full rounded-lg border border-transparent bg-secondary py-2 pl-11 pr-14 text-sm text-foreground transition-all placeholder:text-muted-foreground hover:border-border focus:border-ring focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring"
				/>
				{/* Keyboard shortcut hint */}
				<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 transition-opacity group-focus-within:opacity-0">
					<kbd className="hidden h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm lg:inline-flex">
						⌘K
					</kbd>
				</span>
			</label>
		</form>
	);
}
