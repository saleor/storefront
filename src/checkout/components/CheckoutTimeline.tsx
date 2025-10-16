import { type FC } from "react";
import clsx from "clsx";
import { CheckIcon, CircleIcon } from "lucide-react";

export interface TimelineStep {
	/** Unique identifier */
	id: string;
	/** Step title */
	title: string;
	/** Step number */
	stepNumber: number;
	/** Whether this step is complete */
	isComplete: boolean;
	/** Whether this step is currently active */
	isActive: boolean;
	/** Whether this step is locked */
	isLocked: boolean;
}

export interface CheckoutTimelineProps {
	/** List of checkout steps */
	steps: TimelineStep[];
	/** Optional CSS class */
	className?: string;
}

/**
 * Timeline component that displays checkout progress in a friendly, non-aggressive manner.
 * Uses grey background with accessible white text (WCAG AA compliant).
 */
export const CheckoutTimeline: FC<CheckoutTimelineProps> = ({ steps, className }) => {
	return (
		<div
			className={clsx(
				"rounded-lg bg-neutral-700 p-6 shadow-sm",
				className,
			)}
			role="navigation"
			aria-label="Checkout progress"
		>
			<h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
				Checkout Progress
			</h2>
			<ol className="space-y-3">
				{steps.map((step, index) => {
					const isLastStep = index === steps.length - 1;

					return (
						<li key={step.id} className="relative">
							<div className="flex items-center gap-3">
								{/* Step indicator */}
								<div className="relative flex-shrink-0">
									{step.isComplete ? (
										<div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500">
											<CheckIcon className="h-4 w-4 text-white" strokeWidth={3} />
										</div>
									) : step.isActive ? (
										<div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white ring-4 ring-blue-400/30">
											{step.stepNumber}
										</div>
									) : step.isLocked ? (
										<div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-500">
											<CircleIcon className="h-3 w-3 fill-neutral-600 text-neutral-600" />
										</div>
									) : (
										<div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-500 text-xs font-semibold text-white">
											{step.stepNumber}
										</div>
									)}

									{/* Connector line */}
									{!isLastStep && (
										<div
											className={clsx(
												"absolute left-1/2 top-7 h-3 w-px -translate-x-1/2",
												{
													"bg-green-500": step.isComplete,
													"bg-neutral-500": !step.isComplete,
												},
											)}
											aria-hidden="true"
										/>
									)}
								</div>

								{/* Step title */}
								<div className="min-w-0 flex-1 py-0.5">
									<span
										className={clsx("text-sm font-medium", {
											"text-white": step.isActive,
											"text-green-200": step.isComplete && !step.isActive,
											"text-neutral-300": step.isLocked,
											"text-neutral-200": !step.isActive && !step.isComplete && !step.isLocked,
										})}
									>
										{step.title}
									</span>
								</div>
							</div>
						</li>
					);
				})}
			</ol>
		</div>
	);
};
