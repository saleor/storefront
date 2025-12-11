"use client";

import { Fragment, type ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	showCloseButton?: boolean;
}

export function Modal({ 
	isOpen, 
	onClose, 
	title, 
	children, 
	size = "md",
	showCloseButton = true 
}: ModalProps) {
	const sizeClasses = {
		sm: "max-w-md",
		md: "max-w-lg",
		lg: "max-w-2xl",
		xl: "max-w-4xl",
	};
	
	return (
		<Transition appear show={isOpen} as={Fragment}>
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
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel 
								className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all`}
							>
								{(title || showCloseButton) && (
									<div className="flex items-center justify-between mb-4">
										{title && (
											<Dialog.Title
												as="h3"
												className="text-lg font-medium leading-6 text-secondary-900"
											>
												{title}
											</Dialog.Title>
										)}
										{showCloseButton && (
											<Button
												variant="ghost"
												size="sm"
												onClick={onClose}
												className="p-1 hover:bg-secondary-100"
											>
												<X className="h-5 w-5" />
												<span className="sr-only">Close</span>
											</Button>
										)}
									</div>
								)}
								
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}