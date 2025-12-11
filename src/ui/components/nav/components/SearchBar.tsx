"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface SearchSuggestion {
	id: string;
	name: string;
	slug: string;
	category?: string;
	thumbnail?: string;
}

interface SearchBarProps {
	channel: string;
	placeholder?: string;
	className?: string;
}

export function SearchBar({ channel, placeholder = "Search for products...", className }: SearchBarProps) {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	// Fetch suggestions from API
	const fetchSuggestions = useCallback(async (searchQuery: string) => {
		if (searchQuery.trim().length < 2) {
			setSuggestions([]);
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(`/api/search/suggestions?query=${encodeURIComponent(searchQuery)}&channel=${channel}`);
			if (response.ok) {
				const data = await response.json() as { suggestions?: SearchSuggestion[] };
				setSuggestions(data.suggestions || []);
			}
		} catch (error) {
			console.error("Failed to fetch suggestions:", error);
			setSuggestions([]);
		} finally {
			setIsLoading(false);
		}
	}, [channel]);

	// Debounced search
	useEffect(() => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		if (query.trim().length >= 2) {
			debounceRef.current = setTimeout(() => {
				fetchSuggestions(query);
			}, 300);
		} else {
			setSuggestions([]);
		}

		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, [query, fetchSuggestions]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim().length > 0) {
			setIsOpen(false);
			router.push(`/${encodeURIComponent(channel)}/search?query=${encodeURIComponent(query.trim())}`);
		}
	};

	const handleSuggestionClick = (suggestion: SearchSuggestion) => {
		setIsOpen(false);
		setQuery("");
		router.push(`/${encodeURIComponent(channel)}/products/${suggestion.slug}`);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isOpen || suggestions.length === 0) {
			if (e.key === "Enter") {
				handleSubmit(e);
			}
			return;
		}

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
				break;
			case "Enter":
				e.preventDefault();
				if (selectedIndex >= 0 && suggestions[selectedIndex]) {
					handleSuggestionClick(suggestions[selectedIndex]);
				} else {
					handleSubmit(e);
				}
				break;
			case "Escape":
				setIsOpen(false);
				setSelectedIndex(-1);
				break;
		}
	};

	const clearSearch = () => {
		setQuery("");
		setSuggestions([]);
		setIsOpen(false);
		inputRef.current?.focus();
	};

	return (
		<div ref={containerRef} className={clsx("relative", className)}>
			<form onSubmit={handleSubmit} className="relative">
				<label className="sr-only" htmlFor="search-input">
					Search for products
				</label>
				<input
					ref={inputRef}
					id="search-input"
					type="text"
					name="search"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsOpen(true);
						setSelectedIndex(-1);
					}}
					onFocus={() => query.length >= 2 && setIsOpen(true)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					autoComplete="off"
					className="h-10 w-full rounded-md border border-secondary-300 bg-white px-4 py-2 pr-20 text-sm text-secondary-900 placeholder:text-secondary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 transition-colors"
				/>
				<div className="absolute inset-y-0 right-0 flex items-center">
					{query.length > 0 && (
						<button
							type="button"
							onClick={clearSearch}
							className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
							aria-label="Clear search"
						>
							<X className="h-4 w-4" />
						</button>
					)}
					<button
						type="submit"
						disabled={query.trim().length === 0}
						className="inline-flex aspect-square w-10 items-center justify-center text-secondary-500 hover:text-primary-600 focus:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						aria-label="Search"
					>
						{isLoading ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<Search className="h-5 w-5" />
						)}
					</button>
				</div>
			</form>

			{/* Autocomplete Dropdown */}
			{isOpen && (query.length >= 2 || suggestions.length > 0) && (
				<div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-secondary-200 bg-white shadow-lg">
					{isLoading && suggestions.length === 0 ? (
						<div className="flex items-center justify-center py-4">
							<Loader2 className="h-5 w-5 animate-spin text-secondary-400" />
							<span className="ml-2 text-sm text-secondary-500">Searching...</span>
						</div>
					) : suggestions.length > 0 ? (
						<ul className="max-h-80 overflow-auto py-2" role="listbox">
							{suggestions.map((suggestion, index) => (
								<li
									key={suggestion.id}
									role="option"
									aria-selected={index === selectedIndex}
									className={clsx(
										"flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors",
										index === selectedIndex
											? "bg-primary-50 text-primary-900"
											: "hover:bg-secondary-50"
									)}
									onClick={() => handleSuggestionClick(suggestion)}
									onMouseEnter={() => setSelectedIndex(index)}
								>
									{suggestion.thumbnail && (
										<img
											src={suggestion.thumbnail}
											alt=""
											className="h-10 w-10 rounded object-cover bg-secondary-100"
										/>
									)}
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-secondary-900 truncate">
											{suggestion.name}
										</p>
										{suggestion.category && (
											<p className="text-xs text-secondary-500 truncate">
												{suggestion.category}
											</p>
										)}
									</div>
								</li>
							))}
							<li className="border-t border-secondary-100 mt-2 pt-2 px-4 pb-2">
								<button
									type="button"
									onClick={handleSubmit as any}
									className="text-sm text-primary-600 hover:text-primary-700 font-medium"
								>
									See all results for &quot;{query}&quot;
								</button>
							</li>
						</ul>
					) : query.length >= 2 && !isLoading ? (
						<div className="py-4 px-4 text-center">
							<p className="text-sm text-secondary-500">No suggestions found</p>
							<button
								type="button"
								onClick={handleSubmit as any}
								className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
							>
								Search for &quot;{query}&quot;
							</button>
						</div>
					) : null}
				</div>
			)}
		</div>
	);
}
