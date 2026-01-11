import { redirect } from "next/navigation";
import { SearchIcon } from "lucide-react";

export const SearchBar = ({ channel }: { channel: string }) => {
	async function onSubmit(formData: FormData) {
		"use server";
		const search = formData.get("search") as string;
		if (search && search.trim().length > 0) {
			redirect(`/${encodeURIComponent(channel)}/search?query=${encodeURIComponent(search)}`);
		}
	}

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
					type="text"
					name="search"
					placeholder="Search for products..."
					autoComplete="off"
					required
					className="hover:bg-secondary/80 h-10 w-full rounded-lg border border-transparent bg-secondary py-2 pl-11 pr-4 text-sm text-foreground transition-all placeholder:text-muted-foreground hover:border-border focus:border-ring focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring"
				/>
			</label>
		</form>
	);
};
