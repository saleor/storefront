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

export interface ProductTabsProps {
	description?: string | null;
	attributes?: ProductAttribute[];
	additionalInfo?: string;
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

export function ProductTabs({ description, attributes = [], additionalInfo }: ProductTabsProps) {
	const [activeTab, setActiveTab] = useState<TabId>("description");

	const parsedDescription = description ? parser.parse(JSON.parse(description)) : null;

	// Filter out tabs with no content
	const availableTabs = tabs.filter((tab) => {
		if (tab.id === "description") return !!parsedDescription;
		if (tab.id === "specifications") return attributes.length > 0;
		return true; // Always show shipping
	});

	if (availableTabs.length === 0) {
		return null;
	}

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
								"py-4 text-sm font-medium border-b-2 transition-colors",
								activeTab === tab.id
									? "border-primary-600 text-primary-600"
									: "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
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
										<td className="py-3 px-4 text-sm font-medium text-secondary-900 w-1/3">
											{attr.name}
										</td>
										<td className="py-3 px-4 text-sm text-secondary-600">
											{attr.value}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === "shipping" && (
					<div className="space-y-6 text-sm text-secondary-600">
						<div>
							<h3 className="font-medium text-secondary-900 mb-2">Shipping Information</h3>
							<ul className="list-disc list-inside space-y-1">
								<li>Free standard shipping on orders over $50</li>
								<li>Standard shipping: 5-7 business days</li>
								<li>Express shipping: 2-3 business days</li>
								<li>Next-day delivery available for select areas</li>
							</ul>
						</div>
						<div>
							<h3 className="font-medium text-secondary-900 mb-2">Returns & Exchanges</h3>
							<ul className="list-disc list-inside space-y-1">
								<li>30-day return policy for unused items</li>
								<li>Free returns on all orders</li>
								<li>Items must be in original packaging</li>
								<li>Refunds processed within 5-7 business days</li>
							</ul>
						</div>
						{additionalInfo && (
							<div>
								<h3 className="font-medium text-secondary-900 mb-2">Additional Information</h3>
								<p>{additionalInfo}</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
