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
		<form action={onSubmit} className="search-form desktop-search-form">
			<div className="input-group">
				<input
					type="text"
					name="search"
					placeholder="Search for products"
					autoComplete="on"
					required
					className="form-control"
				/>
				<button type="submit" className="btn">
					<SearchIcon className="bi bi-search" />
				</button>
			</div>
		</form>
	);
};
