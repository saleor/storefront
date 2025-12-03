"use client";

import { Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const sortOptions = [
	{ name: "A to Z", value: "name-asc" },
	{ name: "Price: Low to High", value: "price-asc" },
	{ name: "Price: High to Low", value: "price-desc" },
];

export const SortBy = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentSortValue = searchParams.get("sort") || "name-asc";

	const selectedOption = sortOptions.find((option) => option.value === currentSortValue) || sortOptions[0];

	const handleChange = (value: string) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.set("sort", value);
		newParams.delete("cursor");
		newParams.delete("direction");
		router.push(`?${newParams.toString()}`);
	};

	return (
		<div className="w-auto">
			<Listbox value={currentSortValue} onChange={handleChange}>
				<div className="relative mt-1">
					<Listbox.Button className="relative w-full cursor-pointer bg-transparent py-2 pl-3 pr-10 text-left text-sm font-medium text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-300 sm:text-sm">
						<span className="block truncate">{selectedOption.name}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronDown className="h-4 w-4 text-neutral-500" aria-hidden="true" />
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-max min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
							{sortOptions.map((option) => (
								<Listbox.Option
									key={option.value}
									className={({ active }) =>
										clsx(
											"relative cursor-default select-none py-2 pl-4 pr-4",
											active ? "bg-neutral-100 text-neutral-900" : "text-neutral-700",
										)
									}
									value={option.value}
								>
									{({ selected }) => (
										<span className={clsx("block truncate", selected ? "font-medium" : "font-normal")}>
											{option.name}
										</span>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
};
