"use client";

import { Fragment } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { X, ShoppingBag } from "lucide-react";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { Button } from "../atoms/Button";
import { formatMoney, getHrefForVariant } from "@/lib/utils";

export interface MiniCartItem {
	id: string;
	quantity: number;
	totalPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	variant: {
		id: string;
		name: string;
		product: {
			name: string;
			slug: string;
			thumbnail?: {
				url: string;
				alt?: string | null;
			} | null;
		};
	};
}

export interface MiniCartProps {
	isOpen: boolean;
	onClose: () => void;
	items: MiniCartItem[];
	total: {
		amount: number;
		currency: string;
	};
	checkoutId?: string;
	channel: string;
}

export function MiniCart({ isOpen, onClose, items, total, checkoutId }: MiniCartProps) {
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<Transition show={isOpen} as={Fragment}>
			<Dialog onClose={onClose} className="relative z-50">
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

				{/* Drawer */}
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="translate-x-full"
					enterTo="translate-x-0"
					leave="ease-in duration-200"
					leaveFrom="translate-x-0"
					leaveTo="translate-x-full"
				>
					<Dialog.Panel className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col">
						{/* Header */}
						<div className="flex items-center justify-between px-4 py-4 border-b border-secondary-200">
							<Dialog.Title className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
								<ShoppingBag className="h-5 w-5" />
								Cart ({itemCount})
							</Dialog.Title>
							<button
								onClick={onClose}
								className="p-2 -mr-2 text-secondary-500 hover:text-secondary-700 transition-colors"
								aria-label="Close cart"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Cart Items */}
						<div className="flex-1 overflow-y-auto px-4 py-4">
							{items.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-full text-center">
									<ShoppingBag className="h-12 w-12 text-secondary-300 mb-4" />
									<p className="text-secondary-600 mb-4">Your cart is empty</p>
									<LinkWithChannel href="/products" onClick={onClose}>
										<Button variant="primary">Start Shopping</Button>
									</LinkWithChannel>
								</div>
							) : (
								<ul className="space-y-4">
									{items.map((item) => (
										<li key={item.id} className="flex gap-4">
											<div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-secondary-200 bg-secondary-50">
												{item.variant.product.thumbnail?.url ? (
													<Image
														src={item.variant.product.thumbnail.url}
														alt={item.variant.product.thumbnail.alt ?? item.variant.product.name}
														fill
														className="object-cover"
														sizes="64px"
													/>
												) : (
													<div className="flex h-full items-center justify-center text-secondary-400 text-xs">
														No image
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<LinkWithChannel
													href={getHrefForVariant({
														productSlug: item.variant.product.slug,
														variantId: item.variant.id,
													})}
													onClick={onClose}
												>
													<h3 className="text-sm font-medium text-secondary-900 truncate hover:text-primary-600">
														{item.variant.product.name}
													</h3>
												</LinkWithChannel>
												{item.variant.name !== item.variant.id && (
													<p className="text-xs text-secondary-500 mt-0.5">{item.variant.name}</p>
												)}
												<div className="flex items-center justify-between mt-1">
													<span className="text-xs text-secondary-500">Qty: {item.quantity}</span>
													<span className="text-sm font-medium text-secondary-900">
														{formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency)}
													</span>
												</div>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>

						{/* Footer */}
						{items.length > 0 && (
							<div className="border-t border-secondary-200 px-4 py-4 space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-base font-semibold text-secondary-900">Subtotal</span>
									<span className="text-base font-bold text-secondary-900">
										{formatMoney(total.amount, total.currency)}
									</span>
								</div>
								<p className="text-xs text-secondary-500">
									Shipping and taxes calculated at checkout
								</p>
								<div className="space-y-2">
									<a
										href={`/checkout?checkout=${checkoutId}`}
										className="block w-full rounded-md bg-primary-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-primary-700 transition-colors"
									>
										Checkout
									</a>
									<LinkWithChannel href="/cart" onClick={onClose}>
										<Button variant="secondary" fullWidth>
											View Cart
										</Button>
									</LinkWithChannel>
								</div>
							</div>
						)}
					</Dialog.Panel>
				</Transition.Child>
			</Dialog>
		</Transition>
	);
}
