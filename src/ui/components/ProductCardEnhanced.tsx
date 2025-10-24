"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { InfoIcon, XIcon } from "lucide-react";
import xss from "xss";
import { type ProductListItemFragment } from "@/gql/graphql";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { formatMoneyRange } from "@/lib/utils";
import { parseEditorJsToHTML } from "@/lib/editorjs/parser";

interface ProductCardEnhancedProps {
	product: ProductListItemFragment;
	loading?: "eager" | "lazy";
	priority?: boolean;
}

/**
 * Extract plain text from EditorJS HTML for preview
 */
function extractTextFromHTML(html: string, maxLength: number = 120): string {
	// Remove HTML tags and decode entities
	const text = html
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'")
		.replace(/\s+/g, " ")
		.trim();

	return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Enhanced product card with expandable description feature.
 * Displays product image, name, category, price, and a truncated description
 * with an icon to view the full description in a modal.
 */
export function ProductCardEnhanced({ product, loading = "lazy", priority = false }: ProductCardEnhancedProps) {
	const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

	// Parse EditorJS description
	const parsedDescription = product.description ? parseEditorJsToHTML(product.description) : [];
	const hasDescription = parsedDescription.length > 0;

	// Create preview from first block
	const descriptionPreview = hasDescription ? extractTextFromHTML(parsedDescription[0], 100) : "";

	return (
		<>
			<li data-testid="ProductCardEnhanced" className="stagger-item">
				<div className="card-elevated hover-lift group relative flex h-full flex-col overflow-hidden">
					{/* Product Image */}
					<LinkWithChannel
						href={`/products/${product.slug}`}
						className="block"
						aria-label={`View ${product.name} product image`}
					>
						{product?.thumbnail?.url && (
							<div className="relative overflow-hidden bg-gradient-to-br from-base-900 to-base-950">
								<ProductImageWrapper
									loading={loading}
									src={product.thumbnail.url}
									alt={product.thumbnail.alt ?? ""}
									width={400}
									height={400}
									priority={priority}
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
								/>
								{/* Shimmer effect on hover */}
								<div className="animate-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
							</div>
						)}
					</LinkWithChannel>

					{/* Product Info - flex-1 to fill space, flex-col to stack content */}
					<div className="mt-4 flex flex-1 flex-col">
						<LinkWithChannel
							href={`/products/${product.slug}`}
							className="block flex-1"
							aria-label={`View details for ${product.name}`}
						>
							<div className="flex h-full flex-col">
								{/* Title */}
								<h3 className="text-base font-medium text-white transition-colors duration-300 group-hover:text-accent-200">
									{product.name}
								</h3>

								{/* Category */}
								{product.category?.name && (
									<p className="mt-1.5 text-sm text-base-300 transition-colors duration-300 group-hover:text-base-200">
										{product.category.name}
									</p>
								)}

								{/* Description Preview - takes available space */}
								{hasDescription && (
									<div className="mt-3 flex items-start gap-2">
										<p className="flex-1 text-xs leading-relaxed text-base-400 transition-colors duration-300 group-hover:text-base-300">
											{descriptionPreview}
										</p>
										{/* Info Icon Button */}
										<button
											type="button"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												setIsDescriptionOpen(true);
											}}
											className="flex-shrink-0 rounded-full p-1.5 text-base-400 transition-all duration-200 hover:bg-base-800 hover:text-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-base-950"
											aria-label="View full description"
											title="View full description"
										>
											<InfoIcon className="h-4 w-4" aria-hidden="true" />
										</button>
									</div>
								)}
							</div>
						</LinkWithChannel>

						{/* Price - pushed to bottom with mt-auto */}
						<LinkWithChannel
							href={`/products/${product.slug}`}
							className="mt-auto block"
							aria-label={`View pricing for ${product.name}`}
						>
							<div className="mt-4 flex items-center justify-between border-t border-base-800 pt-4">
								<p className="gradient-text text-base font-semibold">
									{formatMoneyRange({
										start: product?.pricing?.priceRange?.start?.gross,
										stop: product?.pricing?.priceRange?.stop?.gross,
									})}
								</p>
								{/* Animated arrow indicator */}
								<span
									className="translate-x-0 transform text-accent-200 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
									aria-hidden="true"
								>
									→
								</span>
							</div>
						</LinkWithChannel>
					</div>

					{/* Glow effect on hover */}
					<div
						className="rounded-inherit pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						style={{ boxShadow: "0 0 30px rgba(var(--glow-color), 0.15)" }}
					/>
				</div>
			</li>

			{/* Description Modal */}
			<Transition show={isDescriptionOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-[100]"
					onClose={() => setIsDescriptionOpen(false)}
				>
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
						<div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
					</Transition.Child>

					{/* Modal Container - fixed positioning with flex centering */}
					<div className="fixed inset-0 flex items-center justify-center p-4">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-base-700 bg-base-950 p-6 shadow-xl">
								{/* Modal Header */}
								<div className="flex items-start justify-between">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-white"
									>
										{product.name}
									</Dialog.Title>
									<button
										type="button"
										className="rounded-full p-1 text-base-400 transition-colors hover:bg-base-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
										onClick={() => setIsDescriptionOpen(false)}
										aria-label="Close dialog"
									>
										<XIcon className="h-5 w-5" aria-hidden="true" />
									</button>
								</div>

								{/* Modal Content */}
								<div className="mt-4 max-h-[60vh] overflow-y-auto">
									{product.category?.name && (
										<p className="mb-3 text-sm text-accent-400">
											{product.category.name}
										</p>
									)}
									<div className="prose prose-invert max-w-none">
										<div className="space-y-4 text-sm leading-relaxed text-base-300">
											{parsedDescription.map((content, index) => (
												<div key={index} dangerouslySetInnerHTML={{ __html: xss(content) }} />
											))}
										</div>
									</div>
								</div>

								{/* Modal Footer */}
								<div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-base-800 pt-4">
									<p className="gradient-text text-lg font-semibold">
										{formatMoneyRange({
											start: product?.pricing?.priceRange?.start?.gross,
											stop: product?.pricing?.priceRange?.stop?.gross,
										})}
									</p>
									<LinkWithChannel href={`/products/${product.slug}`}>
										<button
											type="button"
											className="btn-primary rounded-md px-4 py-2 text-sm font-medium"
											onClick={() => setIsDescriptionOpen(false)}
										>
											View Product
										</button>
									</LinkWithChannel>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
