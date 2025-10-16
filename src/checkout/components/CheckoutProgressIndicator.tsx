import { CheckIcon, AlertCircleIcon } from "lucide-react";
import clsx from "clsx";

export interface CheckoutStep {
	id: string;
	label: string;
	status: "complete" | "incomplete" | "current";
	error?: string;
}

interface CheckoutProgressIndicatorProps {
	steps: CheckoutStep[];
	className?: string;
}

export const CheckoutProgressIndicator = ({ steps, className }: CheckoutProgressIndicatorProps) => {
	return (
		<div className={clsx("rounded-lg border border-neutral-200 bg-white p-4 shadow-sm", className)}>
			<h3 className="mb-3 text-sm font-semibold text-neutral-900">Checkout Progress</h3>
			<ul className="space-y-2">
				{steps.map((step) => (
					<li key={step.id} className="flex items-start gap-3">
						<div className="flex-shrink-0 pt-0.5">
							{step.status === "complete" ? (
								<div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
									<CheckIcon className="h-3.5 w-3.5 text-green-700" strokeWidth={3} />
								</div>
							) : step.status === "current" ? (
								<div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-50">
									<div className="h-2 w-2 rounded-full bg-blue-500" />
								</div>
							) : (
								<div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-neutral-300 bg-neutral-50">
									<div className="h-2 w-2 rounded-full bg-neutral-300" />
								</div>
							)}
						</div>
						<div className="flex-1 min-w-0">
							<p
								className={clsx("text-sm font-medium", {
									"text-green-700": step.status === "complete",
									"text-blue-700": step.status === "current",
									"text-neutral-500": step.status === "incomplete",
								})}
							>
								{step.label}
							</p>
							{step.error && (
								<p className="mt-1 flex items-start gap-1 text-xs text-red-600">
									<AlertCircleIcon className="mt-0.5 h-3 w-3 flex-shrink-0" />
									<span>{step.error}</span>
								</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
