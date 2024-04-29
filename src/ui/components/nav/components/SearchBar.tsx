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
		<form action={onSubmit}>
			<input
				id="search"
				type="text"
				name="search"
				placeholder="Search for products..."
				autoComplete="on"
				required
				className="absolute left-auto right-12 z-10 h-full w-0 rounded-lg border-0 bg-neutral-200 p-0 text-neutral-200 placeholder-gray-600 transition-width duration-300 focus:w-96 focus:border focus:border-neutral-200 focus:pl-4 focus:pt-0 focus:ring-neutral-100"
			/>
			<label
				htmlFor="search"
				className="absolute m-0 inline-block h-12 w-full cursor-pointer select-none stroke-neutral-200 p-0 text-center text-xl leading-10 hover:stroke-neutral-400"
			>
				<SearchIcon aria-hidden className="pointer-events-none inline-block stroke-inherit" />
			</label>
		</form>
	);
};
