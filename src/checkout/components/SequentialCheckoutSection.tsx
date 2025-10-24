import { type ReactNode, type FC } from "react";
import clsx from "clsx";
import { CheckIcon, LockIcon } from "lucide-react";

export interface SequentialCheckoutSectionProps {
	/** Unique section identifier */
	id: string;
	/** Section title */
	title: string;
	/** Section number (e.g., 1, 2, 3) */
	stepNumber: number;
	/** Whether this section is complete */
	isComplete: boolean;
	/** Whether this section is currently active/editable */
	isActive: boolean;
	/** Whether this section is locked (not yet available) */
	isLocked: boolean;
	/** Summary text shown when collapsed and complete */
	completedSummary?: string;
	/** Content to show when expanded */
	children: ReactNode;
	/** Optional test id */
	"data-testid"?: string;
}

/**
 * Sequential checkout section that expands/collapses based on completion status.
 * Provides a clear, step-by-step checkout flow.
 */
export const SequentialCheckoutSection: FC<SequentialCheckoutSectionProps> = ({
	title,
	stepNumber,
	isComplete,
	isActive,
	isLocked,
	completedSummary: _completedSummary, // TODO: Display summary when section is complete but collapsed
	children,
	"data-testid": dataTestId,
}) => {
	return (
		<div
			className={clsx(
				"overflow-hidden rounded-lg border transition-all duration-200",
				{
					// Complete section - success styling with dark theme
					"border-green-700 bg-base-950": isComplete,
					// Locked section - muted styling with reduced opacity and dark theme
					"border-base-700 bg-base-900 opacity-60": isLocked,
					// Active unlocked section - dark theme
					"border-base-700 bg-base-950": !isComplete && !isLocked,
				},
			)}
			data-testid={dataTestId}
		>
			{/* Header */}
			<div className="flex items-start gap-4 p-4">
				{/* Step indicator */}
				<div className="flex-shrink-0">
					{isComplete ? (
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
							<CheckIcon className="h-5 w-5 text-white" strokeWidth={3} />
						</div>
					) : isLocked ? (
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-base-700">
							<LockIcon className="h-4 w-4 text-base-400" />
						</div>
					) : (
						<div
							className={clsx(
								"flex h-8 w-8 items-center justify-center rounded-full font-semibold",
								{
									"bg-accent-600 text-white": isActive,
									"bg-base-700 text-base-200": !isActive,
								},
							)}
						>
							{stepNumber}
						</div>
					)}
				</div>

				{/* Title and summary */}
				<div className="min-w-0 flex-1">
					<h3
						className={clsx("text-base font-semibold", {
							"text-green-400": isComplete,
							"text-white": !isComplete || isLocked,
						})}
					>
						{title}
					</h3>
				</div>
			</div>

			{/* Content - always visible for active sections, with pointer-events disabled when locked */}
			<div
				className={clsx("border-t border-base-800 px-4 pb-4 pt-4", {
					"pointer-events-none select-none": isLocked,
				})}
			>
				{children}
			</div>
		</div>
	);
};
