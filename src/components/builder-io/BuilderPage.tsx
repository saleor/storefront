"use client";

import { useEffect, useState } from "react";
import { builder } from "@builder.io/react";

// Define the props for our BuilderPage component
interface BuilderPageProps {
	pageId: string;
	channel?: string;
}

export function BuilderPage({ pageId, channel }: BuilderPageProps) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Initialize Builder.io with your API key
		if (process.env.NEXT_PUBLIC_BUILDER_API_KEY) {
			builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);
		}

		// Simulate loading - in a real implementation, you would fetch content from Builder.io
		const loadContent = async () => {
			try {
				// This is where you would fetch content from Builder.io
				// For example: const content = await builder.get('page', { ... }).toPromise();

				setLoading(false);
			} catch (err) {
				console.error("Error fetching Builder.io content:", err);
				setError("Failed to load page content");
				setLoading(false);
			}
		};

		loadContent();
	}, [pageId, channel]);

	// Loading state
	if (loading) {
		return <div className="p-8 text-center">Loading page content...</div>;
	}

	// Error state
	if (error) {
		return <div className="p-8 text-center text-red-500">{error}</div>;
	}

	// For now, we'll just render a placeholder that shows how to integrate with Builder.io
	return (
		<div className="p-8">
			<h1>Builder.io Integration</h1>
			<p>This component is designed to work with Builder.io for drag-and-drop page building.</p>
			<p>Page ID: {pageId}</p>
			<p>Channel: {channel || "default"}</p>

			{/* In a real implementation, you would render the Builder.io content here */}
			<div className="mt-8 rounded bg-gray-100 p-4">
				<h2>Integration Notes:</h2>
				<ul className="mt-2 list-disc pl-5">
					<li>Use Builder.io&apos;s React SDK to render dynamic content</li>
					<li>Pass GraphQL data as props to Builder.io components</li>
					<li>Implement custom components that can access Saleor data</li>
				</ul>
			</div>
		</div>
	);
}

// Helper function to create a component that can access both Builder.io and GraphQL data
export async function getBuilderPageData(pageId: string, channel?: string) {
	// This would be where you fetch data from GraphQL to pass to Builder.io
	// For example, fetching product lists or category information

	return {
		pageId,
		channel,
		// Add any GraphQL data you want to make available in Builder.io components
	};
}
