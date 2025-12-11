"use client";

import { Fragment } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";

const sortOptions = [
	{ name: "Name: A to Z", value: "name-asc" },
	{ name: "Name: Z to A", value: "name-desc" },
	{ name: "Price: Low to High", value: "price-asc" },
	{ name: "Price: High to Low", value: "price-desc" },
	{ name: "Newest First", value: "newest" },
];

export const SortBy = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentSortValue = searchParams.get("sort") || "name-asc";

	const selectedOption = sortOptions.find((option) => option.value === currentSortValue) || sortOptions[0];

	const handleChange = (value: string) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.set("sort", value);
		newParams.delete("cursor");
		newParams.delete("direction");
		router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
	};

	return (
		<div className="w-auto">
			<Listbox value={currentSortValue} onChange={handleChange}>
				<div className="relative">
					<Listbox.Button className="relative flex items-center gap-2 cursor-pointer rounded-md border border-secondary-300 bg-white py-2 pl-3 pr-8 text-left text-sm font-medium text-secondary-900 hover:border-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
						<span className="text-secondary-500 text-xs">Sort by:</span>
						<span className="block truncate">{selectedOption.name}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronDown className="h-4 w-4 text-secondary-500" aria-hidden="true" />
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
											"relative cursor-pointer select-none py-2 pl-10 pr-4",
											active ? "bg-primary-50 text-primary-900" : "text-secondary-700",
										)
									}
									value={option.value}
								>
									{({ selected }) => (
										<>
											<span className={clsx("block truncate", selected ? "font-medium" : "font-normal")}>
												{option.name}
											</span>
											{selected && (
												<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
													<Check className="h-4 w-4" aria-hidden="true" />
												</span>
											)}
										</>
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
