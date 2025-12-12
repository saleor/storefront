"use client";

import { useState } from "react";
import { clsx } from "clsx";
import xss from "xss";
import edjsHTML from "editorjs-html";

const parser = edjsHTML();

export interface ProductAttribute {
	name: string;
	value: string;
}

export interface ShippingReturnsContent {
	shippingTitle?: string;
	shippingContent?: string;
	returnsTitle?: string;
	returnsContent?: string;
	freeShippingThreshold?: string;
	returnPeriodDays?: number;
}

export interface ProductTabsProps {
	description?: string | null;
	attributes?: ProductAttribute[];
	additionalInfo?: string;
	shippingReturns?: ShippingReturnsContent;
}

type TabId = "description" | "specifications" | "shipping";

interface Tab {
	id: TabId;
	label: string;
}

const tabs: Tab[] = [
	{ id: "description", label: "Description" },
	{ id: "specifications", label: "Specifications" },
	{ id: "shipping", label: "Shipping & Returns" },
];

interface EditorJSData {
	blocks?: unknown[];
}

function parseEditorJSContent(content: string | null | undefined): string[] | null {
	if (!content) return null;
	try {
		const parsed = JSON.parse(content) as EditorJSData;
		if (parsed && parsed.blocks) {
			return parser.parse(parsed);
		}
		// If it's plain HTML or text, return as-is
		return [content];
	} catch {
		// If JSON parsing fails, treat as plain text/HTML
		return content ? [content] : null;
	}
}

export function ProductTabs({
	description,
	attributes = [],
	additionalInfo,
	shippingReturns,
}: ProductTabsProps) {
	const [activeTab, setActiveTab] = useState<TabId>("description");

	const parsedDescription = parseEditorJSContent(description);
	const parsedShippingContent = parseEditorJSContent(shippingReturns?.shippingContent);
	const parsedReturnsContent = parseEditorJSContent(shippingReturns?.returnsContent);

	// Filter out tabs with no content
	const availableTabs = tabs.filter((tab) => {
		if (tab.id === "description") return !!parsedDescription;
		if (tab.id === "specifications") return attributes.length > 0;
		return true; // Always show shipping
	});

	if (availableTabs.length === 0) {
		return null;
	}

	// Check if we have dynamic content or should show defaults
	const hasShippingContent = parsedShippingContent && parsedShippingContent.length > 0;
	const hasReturnsContent = parsedReturnsContent && parsedReturnsContent.length > 0;

	return (
		<div className="mt-12 border-t border-secondary-200 pt-8">
			{/* Tab Navigation */}
			<div className="border-b border-secondary-200">
				<nav className="flex gap-8" aria-label="Product information tabs">
					{availableTabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={clsx(
								"border-b-2 py-4 text-sm font-medium transition-colors",
								activeTab === tab.id
									? "border-primary-600 text-primary-600"
									: "border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700",
							)}
							aria-selected={activeTab === tab.id}
							role="tab"
						>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* Tab Content */}
			<div className="py-8">
				{activeTab === "description" && parsedDescription && (
					<div className="prose prose-sm max-w-none text-secondary-600">
						{parsedDescription.map((content, index) => (
							<div key={index} dangerouslySetInnerHTML={{ __html: xss(content) }} />
						))}
					</div>
				)}

				{activeTab === "specifications" && attributes.length > 0 && (
					<div className="overflow-hidden">
						<table className="min-w-full divide-y divide-secondary-200">
							<tbody className="divide-y divide-secondary-100">
								{attributes.map((attr, index) => (
									<tr key={index} className={index % 2 === 0 ? "bg-secondary-50" : "bg-white"}>
										<td className="w-1/3 px-4 py-3 text-sm font-medium text-secondary-900">{attr.name}</td>
										<td className="px-4 py-3 text-sm text-secondary-600">{attr.value}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === "shipping" && (
					<div className="space-y-6 text-sm text-secondary-600">
						{/* Shipping Information */}
						<div>
							<h3 className="mb-2 font-medium text-secondary-900">
								{shippingReturns?.shippingTitle || "Shipping Information"}
							</h3>
							{hasShippingContent ? (
								<div className="prose prose-sm max-w-none">
									{parsedShippingContent!.map((content, index) => (
										<div key={index} dangerouslySetInnerHTML={{ __html: xss(content) }} />
									))}
								</div>
							) : (
								<p>
									Free shipping on orders over KES {shippingReturns?.freeShippingThreshold || "6,000"}.
									Contact us for delivery times and options.
								</p>
							)}
						</div>

						{/* Returns & Exchanges */}
						<div>
							<h3 className="mb-2 font-medium text-secondary-900">
								{shippingReturns?.returnsTitle || "Returns & Exchanges"}
							</h3>
							{hasReturnsContent ? (
								<div className="prose prose-sm max-w-none">
									{parsedReturnsContent!.map((content, index) => (
										<div key={index} dangerouslySetInnerHTML={{ __html: xss(content) }} />
									))}
								</div>
							) : (
								<p>
									{shippingReturns?.returnPeriodDays || 30}-day return policy. Items must be unused and in
									original packaging. Contact customer service for details.
								</p>
							)}
						</div>

						{additionalInfo && (
							<div>
								<h3 className="mb-2 font-medium text-secondary-900">Additional Information</h3>
								<p>{additionalInfo}</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
