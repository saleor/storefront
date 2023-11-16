"use client";

import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
	const paramsString = params.toString();
	const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

	return `${pathname}${queryString}`;
};

export const SearchBar = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchValue, setSearchValue] = useState("");

	useEffect(() => {
		setSearchValue(searchParams?.get("query") || "");
	}, [searchParams, setSearchValue]);

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const val = e.target as HTMLFormElement;
		const search = val.search as HTMLInputElement;
		const newParams = new URLSearchParams(searchParams.toString());

		if (search.value && search.value.trim().length > 0) {
			newParams.set("query", search.value);
			router.push(createUrl("/search", newParams));
		} else {
			newParams.delete("query");
		}
	}

	return (
		<form onSubmit={onSubmit} className="w-max-[650px] relative my-2 w-full lg:w-80 xl:w-full">
			<input
				type="text"
				name="search"
				placeholder="Search for products..."
				autoComplete="on"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
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
