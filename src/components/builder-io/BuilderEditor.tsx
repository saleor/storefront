"use client";

import { useState, useEffect } from "react";
import { Builder, builder } from "@builder.io/react";

// Import our schema types
import type {
	BuilderLayout,
	CreateBuilderLayoutInput,
	UpdateBuilderLayoutInput,
} from "@/lib/builder-io-schema";

// Define the props for our BuilderEditor component
interface BuilderEditorProps {
	layoutId?: string;
	channel?: string;
	onLayoutSaved?: (layout: BuilderLayout) => void;
}

export function BuilderEditor({ layoutId, channel, onLayoutSaved }: BuilderEditorProps) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [layoutData, setLayoutData] = useState<BuilderLayout | null>(null);
	const [isEditing, setIsEditing] = useState(false);

	// Initialize Builder.io
	useEffect(() => {
		if (process.env.NEXT_PUBLIC_BUILDER_API_KEY) {
			builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);
		}

		// Simulate loading existing layout data
		const loadLayout = async () => {
			try {
				setLoading(true);

				// In a real implementation, this would fetch from your GraphQL API
				if (layoutId) {
					// Simulate fetching existing layout data
					const mockLayout: BuilderLayout = {
						id: layoutId,
						name: "My Custom Page",
						content: {
							// This would be the actual Builder.io JSON structure
							data: {
								component: "div",
								props: {},
							},
						},
						channel,
						createdAt: new Date(),
						updatedAt: new Date(),
						isActive: true,
					};

					setLayoutData(mockLayout);
				}

				setLoading(false);
			} catch (err) {
				setError("Failed to load layout data");
				setLoading(false);
			}
		};

		loadLayout();
	}, [layoutId, channel]);

	// Handle saving layout
	const handleSave = async (content: any) => {
		try {
			setLoading(true);

			// In a real implementation, this would call your GraphQL API
			const newLayout: BuilderLayout = {
				id: layoutId || `layout-${Date.now()}`,
				name: "New Layout",
				content,
				channel,
				createdAt: new Date(),
				updatedAt: new Date(),
				isActive: true,
			};

			// Simulate API call to save layout
			console.log("Saving layout:", newLayout);

			// Call the callback if provided
			if (onLayoutSaved) {
				onLayoutSaved(newLayout);
			}

			// Update local state
			setLayoutData(newLayout);
			setIsEditing(false);
		} catch (err) {
			setError("Failed to save layout");
		} finally {
			setLoading(false);
		}
	};

	// Handle content changes
	const handleContentChange = (content: any) => {
		if (layoutData && content) {
			setLayoutData({
				...layoutData,
				content,
				updatedAt: new Date(),
			});
		}
	};

	if (loading) {
		return <div className="p-8 text-center">Loading Builder editor...</div>;
	}

	if (error) {
		return <div className="p-8 text-center text-red-500">{error}</div>;
	}

	return (
		<div className="p-4">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Builder.io Page Editor</h1>
				<div className="flex space-x-2">
					{layoutData && (
						<button
							onClick={() => setIsEditing(!isEditing)}
							className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						>
							{isEditing ? "Preview" : "Edit"}
						</button>
					)}
					<button
						onClick={() => handleSave(layoutData?.content || {})}
						className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
					>
						Save Layout
					</button>
				</div>
			</div>

			<div className="mb-6 rounded-lg border p-4">
				<h2 className="mb-4 text-xl font-semibold">Layout Information</h2>
				{layoutData ? (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<p>
								<strong>ID:</strong> {layoutData.id}
							</p>
							<p>
								<strong>Name:</strong> {layoutData.name}
							</p>
							<p>
								<strong>Channel:</strong> {layoutData.channel || "default"}
							</p>
						</div>
						<div>
							<p>
								<strong>Created:</strong> {layoutData.createdAt.toLocaleString()}
							</p>
							<p>
								<strong>Last Updated:</strong> {layoutData.updatedAt.toLocaleString()}
							</p>
							<p>
								<strong>Status:</strong> {layoutData.isActive ? "Active" : "Inactive"}
							</p>
						</div>
					</div>
				) : (
					<p>No layout data available</p>
				)}
			</div>

			{/* Builder.io Editor */}
			<div className="rounded-lg border p-4">
				<h2 className="mb-4 text-xl font-semibold">Page Builder</h2>

				{isEditing ? (
					<div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
						<Builder
							model="page"
							content={layoutData?.content}
							onContentChange={handleContentChange}
							// Pass channel information to Builder.io
							userAttributes={{
								channel: channel || "default",
							}}
						/>
					</div>
				) : (
					<div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
						<p className="py-8 text-center text-gray-500">Preview mode - Drag and drop components to edit</p>
						{/* In a real implementation, this would render the Builder.io content */}
					</div>
				)}
			</div>

			<div className="mt-6 rounded bg-blue-50 p-4">
				<h3 className="font-semibold">How to Use:</h3>
				<ul className="mt-2 list-disc pl-5">
					<li>Click &quot;Edit&quot; to enable drag-and-drop editing</li>
					<li>Drag components from the left panel onto the canvas</li>
					<li>Click on components to edit their properties</li>
					<li>Click &quot;Save Layout&quot; to store your changes in the database</li>
				</ul>
			</div>
		</div>
	);
}
