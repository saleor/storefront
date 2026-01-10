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
		<form action={onSubmit} className="relative w-full max-w-md">
			<label className="relative block">
				<span className="sr-only">Search for products</span>
				<span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
					<SearchIcon className="h-4 w-4 text-muted-foreground" aria-hidden />
				</span>
				<input
					type="text"
					name="search"
					placeholder="Search for products..."
					autoComplete="off"
					required
					className="hover:bg-secondary/80 h-10 w-full rounded-lg bg-secondary py-2 pl-11 pr-14 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
				/>
				<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<kbd className="hidden h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline-flex">
						⌘K
					</kbd>
				</span>
			</label>
		</form>
	);
};
