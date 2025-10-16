import { AlertTriangleIcon, InfoIcon } from "lucide-react";
import clsx from "clsx";

export interface ValidationIssue {
	id: string;
	message: string;
	severity: "error" | "warning" | "info";
}

interface CheckoutValidationSummaryProps {
	issues: ValidationIssue[];
	className?: string;
	title?: string;
}

export const CheckoutValidationSummary = ({
	issues,
	className,
	title = "Complete the following steps to proceed",
}: CheckoutValidationSummaryProps) => {
	if (issues.length === 0) {
		return null;
	}

	const errors = issues.filter((i) => i.severity === "error");
	const warnings = issues.filter((i) => i.severity === "warning");
	const infos = issues.filter((i) => i.severity === "info");

	return (
		<div
			className={clsx(
				"rounded-lg border p-4",
				{
					"border-red-300 bg-red-50": errors.length > 0,
					"border-amber-300 bg-amber-50": errors.length === 0 && warnings.length > 0,
					"border-blue-300 bg-blue-50": errors.length === 0 && warnings.length === 0 && infos.length > 0,
				},
				className,
			)}
			role="alert"
			aria-live="polite"
		>
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 pt-0.5">
					<AlertTriangleIcon
						className={clsx("h-5 w-5", {
							"text-red-600": errors.length > 0,
							"text-amber-600": errors.length === 0 && warnings.length > 0,
							"text-blue-600": errors.length === 0 && warnings.length === 0,
						})}
					/>
				</div>
				<div className="flex-1">
					<h3
						className={clsx("text-sm font-semibold", {
							"text-red-900": errors.length > 0,
							"text-amber-900": errors.length === 0 && warnings.length > 0,
							"text-blue-900": errors.length === 0 && warnings.length === 0,
						})}
					>
						{title}
					</h3>
					<ul className="mt-2 space-y-1.5">
						{errors.map((issue) => (
							<li
								key={issue.id}
								className="flex items-start gap-2 text-sm text-red-800"
							>
								<span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
								<span>{issue.message}</span>
							</li>
						))}
						{warnings.map((issue) => (
							<li
								key={issue.id}
								className="flex items-start gap-2 text-sm text-amber-800"
							>
								<span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" />
								<span>{issue.message}</span>
							</li>
						))}
						{infos.map((issue) => (
							<li
								key={issue.id}
								className="flex items-start gap-2 text-sm text-blue-800"
							>
								<InfoIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
								<span>{issue.message}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
