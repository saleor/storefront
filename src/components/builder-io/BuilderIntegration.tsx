"use client";

import { useEffect, useState } from "react";
import { Builder, builder } from "@builder.io/react";

// Define the props for our BuilderIntegration component
interface BuilderIntegrationProps {
	pageId: string;
	channel?: string;
}

// Define a type for the Builder content structure
interface BuilderContent {
	id: string;
	name: string;
	data?: any;
}

// Define the type for product data from Saleor
interface Product {
	id: string;
	name: string;
	description?: string;
	price?: number;
	thumbnail?: {
		url: string;
		alt: string;
	};
}

export function BuilderIntegration({ pageId, channel }: BuilderIntegrationProps) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [builderContent, setBuilderContent] = useState<BuilderContent | null>(null);
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		// Initialize Builder.io with your API key
		if (process.env.NEXT_PUBLIC_BUILDER_API_KEY) {
			builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);
		}

		// Fetch content from Builder.io and Saleor data
		const fetchBuilderContent = async () => {
			try {
				setLoading(true);

				// Mock product data for now since we're not implementing full GraphQL integration in this step
				// In a real implementation, you would use executeGraphQL here with proper type definitions
				const mockProducts: Product[] = [
					{
						id: "1",
						name: "Sample Product 1",
						price: 29.99,
						thumbnail: {
							url: "/placeholder-image-1.jpg",
							alt: "Sample Product 1",
						},
					},
					{
						id: "2",
						name: "Sample Product 2",
						price: 39.99,
						thumbnail: {
							url: "/placeholder-image-2.jpg",
							alt: "Sample Product 2",
						},
					},
					{
						id: "3",
						name: "Sample Product 3",
						price: 49.99,
						thumbnail: {
							url: "/placeholder-image-3.jpg",
							alt: "Sample Product 3",
						},
					},
				];
				setProducts(mockProducts);

				// Fetch content from Builder.io
				const content = await builder
					.get("page", {
						userAttributes: { channel },
						options: { cachebust: true },
					})
					.toPromise();

				if (content) {
					setBuilderContent({
						id: pageId,
						name: content.name || `Page ${pageId}`,
						data: content.data,
					});
				} else {
					throw new Error("No content found from Builder.io");
				}

				setError(null);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError(err instanceof Error ? err.message : "Failed to load page content");
			} finally {
				setLoading(false);
			}
		};

		fetchBuilderContent();
	}, [pageId, channel]);

	// Loading state
	if (loading) {
		return <div className="p-8 text-center">Loading page content...</div>;
	}

	// Error state
	if (error) {
		return <div className="p-8 text-center text-red-500">{error}</div>;
	}

	// Render the Builder.io content with Saleor data
	if (builderContent) {
		return (
			<div className="p-4">
				<h1>Builder.io Integration Component</h1>
				<p>This component demonstrates how to integrate Builder.io with Saleor&apos;s GraphQL data.</p>

				<div className="mt-6 rounded bg-blue-50 p-4">
					<h2>Integration Details:</h2>
					<ul className="mt-2 list-disc pl-5">
						<li>Page ID: {pageId}</li>
						<li>Channel: {channel || "default"}</li>
						<li>Builder.io content loaded successfully</li>
						<li>Products loaded: {products.length}</li>
					</ul>
				</div>

				<div className="mt-6">
					<h2>Products (from Saleor):</h2>
					<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{products.map((product) => (
							<div key={product.id} className="rounded border p-4">
								<h3 className="font-bold">{product.name}</h3>
								{product.thumbnail && product.thumbnail.url && (
									<img
										src={product.thumbnail.url}
										alt={product.thumbnail.alt || product.name}
										className="mt-2 max-h-40"
									/>
								)}
								{product.price && <p className="mt-2">Price: ${product.price}</p>}
							</div>
						))}
					</div>
				</div>

				<div className="mt-6">
					{/* Render actual Builder.io content */}
					<p className="text-gray-600">Builder.io components would be rendered here:</p>
					<pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-4">
						{`<Builder 
              model="page" 
              content={builderContent} 
              // Pass GraphQL data as props here
            />`}
					</pre>
				</div>
			</div>
		);
	}

	return <div className="p-8 text-center">No content found</div>;
}

// Helper function to fetch data that can be used in Builder.io components
export async function getBuilderPageData(pageId: string, channel?: string) {
	// Mock implementation for now - in real implementation, you would use executeGraphQL with proper types
	return {
		pageId,
		channel,
		products: [],
	};
}
