import { redirect } from "next/navigation";
import { Search } from "lucide-react";

export const SearchBar = () => {
	async function onSubmit(formData: FormData) {
		"use server";
		const search = formData.get("search") as string;
		if (search && search.trim().length > 0) {
			redirect(`/search?query=${search}`);
		}
	}

	return (
		<form action={onSubmit} className="w-max-[650px] relative my-2 w-full lg:w-80 xl:w-full">
			<input
				type="text"
				name="search"
				placeholder="Search for products..."
				autoComplete="on"
				className="w-full rounded-md border border-neutral-300 bg-transparent px-4 py-2 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"
			/>
			<div className="absolute right-0 top-0 mr-3 flex h-full items-center">
				<button type="submit">
					<Search color="grey" size={18} />
				</button>
			</div>
		</form>
	);
};
