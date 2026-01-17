import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
	/** Size of the spinner. Defaults to "sm" */
	size?: "sm" | "md" | "lg";
	/** Additional class names */
	className?: string;
}

const sizeClasses = {
	sm: "h-4 w-4",
	md: "h-6 w-6",
	lg: "h-8 w-8",
};

/**
 * Loading spinner with GPU-accelerated animation.
 * Wraps SVG in a div for hardware acceleration.
 *
 * @example
 * ```tsx
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" />
 * ```
 */
export const LoadingSpinner = ({ size = "sm", className }: LoadingSpinnerProps) => (
	<div className={cn(sizeClasses[size], "animate-spin", className)}>
		<svg viewBox="0 0 24 24" className="h-full w-full">
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
				fill="none"
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	</div>
);
