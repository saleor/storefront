"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import Image from "next/image";

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

export function SearchBar({ channel, placeholder = "Search products...", className }: SearchBarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	// Extract current query from URL if on search page
	useEffect(() => {
		if (pathname?.includes("/search")) {
			const urlParams = new URLSearchParams(window.location.search);
			const urlQuery = urlParams.get("query");
			if (urlQuery && urlQuery !== query) {
				setQuery(urlQuery);
			}
		}
	}, [pathname]);

	// Fetch suggestions from API
	const fetchSuggestions = useCallback(async (searchQuery: string) => {
		if (searchQuery.trim().length < 2) {
			setSuggestions([]);
			return;
		}

		setIsLoading(true);
		try {
			const url = `/api/search/suggestions?query=${encodeURIComponent(searchQuery)}&channel=${encodeURIComponent(channel)}`;
			console.log("Fetching suggestions from:", url);
			
			const response = await fetch(url);
			const data = await response.json() as { suggestions?: SearchSuggestion[]; error?: string };
			
			console.log("Search response:", data);
			
			if (response.ok && data.suggestions) {
				setSuggestions(data.suggestions);
			} else {
				console.error("Search API error:", data.error);
				setSuggestions([]);
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

	const navigateToSearch = useCallback((searchQuery: string) => {
		if (searchQuery.trim().length > 0) {
			setIsOpen(false);
			const searchUrl = `/${channel}/search?query=${encodeURIComponent(searchQuery.trim())}`;
			router.push(searchUrl);
		}
	}, [channel, router]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		navigateToSearch(query);
	};

	const handleSuggestionClick = (suggestion: SearchSuggestion) => {
		setIsOpen(false);
		setQuery("");
		router.push(`/${channel}/products/${suggestion.slug}`);
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
		<div ref={containerRef} className={clsx("relative w-full max-w-md", className)}>
			<form onSubmit={handleSubmit} className="relative">
				<label className="sr-only" htmlFor="search-input">
					Search for products
				</label>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400 pointer-events-none" />
					<input
						ref={inputRef}
						id="search-input"
						type="search"
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
						className="h-10 w-full rounded-full border border-secondary-300 bg-white pl-10 pr-16 text-sm text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
					/>
					<div className="absolute inset-y-0 right-1 flex items-center gap-1">
						{query.length > 0 && (
							<button
								type="button"
								onClick={clearSearch}
								className="p-1.5 text-secondary-400 hover:text-secondary-600 transition-colors rounded-full hover:bg-secondary-100"
								aria-label="Clear search"
							>
								<X className="h-4 w-4" />
							</button>
						)}
						<button
							type="submit"
							disabled={query.trim().length === 0}
							className="p-2 text-white bg-primary-600 hover:bg-primary-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							aria-label="Search"
						>
							{isLoading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Search className="h-4 w-4" />
							)}
						</button>
					</div>
				</div>
			</form>

			{/* Autocomplete Dropdown */}
			{isOpen && (query.length >= 2 || suggestions.length > 0) && (
				<div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-secondary-200 bg-white shadow-xl overflow-hidden">
					{isLoading && suggestions.length === 0 ? (
						<div className="flex items-center justify-center py-6">
							<Loader2 className="h-5 w-5 animate-spin text-primary-500" />
							<span className="ml-2 text-sm text-secondary-500">Searching...</span>
						</div>
					) : suggestions.length > 0 ? (
						<ul className="max-h-96 overflow-auto py-2" role="listbox">
							{suggestions.map((suggestion, index) => (
								<li
									key={suggestion.id}
									role="option"
									aria-selected={index === selectedIndex}
									className={clsx(
										"flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
										index === selectedIndex
											? "bg-primary-50"
											: "hover:bg-secondary-50"
									)}
									onClick={() => handleSuggestionClick(suggestion)}
									onMouseEnter={() => setSelectedIndex(index)}
								>
									{suggestion.thumbnail ? (
										<div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-secondary-100">
											<Image
												src={suggestion.thumbnail}
												alt=""
												fill
												className="object-contain"
												sizes="48px"
											/>
										</div>
									) : (
										<div className="h-12 w-12 flex-shrink-0 rounded-md bg-secondary-100 flex items-center justify-center">
											<Search className="h-5 w-5 text-secondary-300" />
										</div>
									)}
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-secondary-900 truncate">
											{suggestion.name}
										</p>
										{suggestion.category && (
											<p className="text-xs text-secondary-500 truncate">
												in {suggestion.category}
											</p>
										)}
									</div>
								</li>
							))}
							<li className="border-t border-secondary-100 mt-2 pt-3 px-4 pb-3">
								<button
									type="button"
									onClick={() => navigateToSearch(query)}
									className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium w-full"
								>
									<Search className="h-4 w-4" />
									See all results for &quot;{query}&quot;
								</button>
							</li>
						</ul>
					) : query.length >= 2 && !isLoading ? (
						<div className="py-6 px-4 text-center">
							<div className="mx-auto w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mb-3">
								<Search className="h-6 w-6 text-secondary-400" />
							</div>
							<p className="text-sm text-secondary-600 mb-3">No products found for &quot;{query}&quot;</p>
							<button
								type="button"
								onClick={() => navigateToSearch(query)}
								className="text-sm text-primary-600 hover:text-primary-700 font-medium"
							>
								Search anyway →
							</button>
						</div>
					) : null}
				</div>
			)}
		</div>
	);
}
