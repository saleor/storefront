"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "../atoms/Button";
import { FilterSidebar, type FilterGroup } from "./FilterSidebar";

export interface MobileFilterDrawerProps {
	filters: FilterGroup[];
	activeFilterCount?: number;
}

export function MobileFilterDrawer({ filters, activeFilterCount = 0 }: MobileFilterDrawerProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Trigger Button */}
			<Button
				variant="secondary"
				size="sm"
				onClick={() => setIsOpen(true)}
				className="lg:hidden flex items-center gap-2"
			>
				<SlidersHorizontal className="h-4 w-4" />
				<span>Filters</span>
				{activeFilterCount > 0 && (
					<span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-600 text-white text-xs font-medium">
						{activeFilterCount}
					</span>
				)}
			</Button>

			{/* Drawer */}
			<Transition show={isOpen} as={Fragment}>
				<Dialog onClose={() => setIsOpen(false)} className="relative z-50">
					{/* Backdrop */}
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
					</Transition.Child>

					{/* Drawer Panel */}
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="translate-x-full"
						enterTo="translate-x-0"
						leave="ease-in duration-200"
						leaveFrom="translate-x-0"
						leaveTo="translate-x-full"
					>
						<Dialog.Panel className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
							{/* Header */}
							<div className="flex items-center justify-between px-4 py-4 border-b border-secondary-200">
								<Dialog.Title className="text-lg font-semibold text-secondary-900">
									Filters
								</Dialog.Title>
								<button
									onClick={() => setIsOpen(false)}
									className="p-2 -mr-2 text-secondary-500 hover:text-secondary-700 transition-colors"
									aria-label="Close filters"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							{/* Filter Content */}
							<div className="overflow-y-auto h-[calc(100vh-140px)] px-4 py-4">
								<FilterSidebar filters={filters} />
							</div>

							{/* Footer */}
							<div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-secondary-200 bg-white">
								<Button
									variant="primary"
									fullWidth
									onClick={() => setIsOpen(false)}
								>
									Apply Filters
								</Button>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</Dialog>
			</Transition>
		</>
	);
}
