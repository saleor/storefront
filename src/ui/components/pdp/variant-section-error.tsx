"use client";

/**
 * Error fallback for variant section.
 * Shown when an error occurs during streaming/rendering.
 * Allows user to retry without losing the rest of the page.
 *
 * Must be a Client Component because it's passed as a prop to ErrorBoundary.
 */
export function VariantSectionError({ resetErrorBoundary }: { resetErrorBoundary?: () => void }) {
	return (
		<>
			{/* Empty space for category row - order:1 */}
			<div className="order-1" />

			{/* Error state - order:3 */}
			<div className="border-destructive/20 bg-destructive/5 order-3 mt-4 rounded-lg border p-6 text-center">
				<p className="mb-3 text-sm text-muted-foreground">Unable to load product options.</p>
				{resetErrorBoundary && (
					<button
						type="button"
						onClick={resetErrorBoundary}
						className="text-sm font-medium text-foreground underline underline-offset-4 hover:no-underline"
					>
						Try again
					</button>
				)}
			</div>
		</>
	);
}
