"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { type AddressFragment } from "@/checkout/graphql";
import { SimpleAddressForm } from "./SimpleAddressForm";

interface AddressDialogProps {
	mode: "create" | "edit";
	address: AddressFragment | null;
	onClose: () => void;
	onAddressCreated: (address: AddressFragment) => void;
	onAddressUpdated: (address: AddressFragment) => void;
	onAddressDeleted: (id: string) => void;
}

export function AddressDialog({
	mode,
	address,
	onClose,
	onAddressCreated,
	onAddressUpdated,
	onAddressDeleted,
}: AddressDialogProps) {
	const handleSuccess = (updatedAddress: AddressFragment) => {
		if (mode === "create") {
			onAddressCreated(updatedAddress);
		} else {
			onAddressUpdated(updatedAddress);
		}
	};

	return (
		<Transition show={true} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/50" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
								<div className="mb-6 flex items-center justify-between">
									<Dialog.Title className="text-2xl font-bold text-neutral-900">
										{mode === "create" ? "Add New Address" : "Edit Address"}
									</Dialog.Title>
									<button
										onClick={onClose}
										className="rounded p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
										aria-label="Close dialog"
									>
										<X className="h-5 w-5" />
									</button>
								</div>

								<div className="max-h-[70vh] overflow-y-auto">
									<SimpleAddressForm
										mode={mode}
										address={address}
										onClose={onClose}
										onSuccess={handleSuccess}
										onDelete={mode === "edit" ? onAddressDeleted : undefined}
									/>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
