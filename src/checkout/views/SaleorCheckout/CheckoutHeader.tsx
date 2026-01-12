"use client";

import Link from "next/link";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/ui/components/shared/Logo";
import { getCheckoutSteps } from "./flow";

/** Progress bar width classes mapped to step/total combinations */
const progressWidthClasses: Record<string, string> = {
	"1/3": "w-1/3",
	"2/3": "w-2/3",
	"3/3": "w-full",
	"1/4": "w-1/4",
	"2/4": "w-2/4",
	"3/4": "w-3/4",
	"4/4": "w-full",
};

/** Get progress bar width class based on current step and total steps */
const getProgressWidthClass = (step: number, totalSteps: number): string => {
	const clampedStep = Math.min(step, totalSteps);
	const key = `${clampedStep}/${totalSteps}`;
	return progressWidthClasses[key] ?? "w-0";
};

interface CheckoutHeaderProps {
	step: number;
	onStepClick?: (step: number) => void;
	isShippingRequired?: boolean;
}

export function CheckoutHeader({ step, onStepClick, isShippingRequired = true }: CheckoutHeaderProps) {
	// Use centralized flow definition, filtering out confirmation for progress bar
	const allSteps = getCheckoutSteps(isShippingRequired);
	const steps = allSteps
		.filter((s) => s.id !== "CONFIRMATION")
		.map((s) => ({
			number: s.index,
			label: s.label,
		}));

	const totalSteps = steps.length;
	const confirmationStepIndex = allSteps.find((s) => s.id === "CONFIRMATION")?.index ?? steps.length + 1;

	return (
		<header className="bg-background md:border-b md:border-border">
			<div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 md:pb-4 md:pt-4 lg:px-8">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center">
						<Logo className="h-5 w-auto text-foreground" />
					</Link>

					{/* Progress Steps - Desktop */}
					<nav className="hidden items-center gap-2 md:flex">
						{steps.map((s, i) => (
							<div key={s.number} className="flex items-center">
								<button
									type="button"
									onClick={() => step > s.number && onStepClick?.(s.number)}
									disabled={step < s.number}
									className={cn("flex items-center gap-2", step > s.number && "cursor-pointer")}
								>
									<span
										className={cn(
											"flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
											step >= s.number ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
										)}
									>
										{step > s.number ? <Check className="h-3.5 w-3.5" /> : s.number}
									</span>
									<span
										className={cn("text-sm", step >= s.number ? "text-foreground" : "text-muted-foreground")}
									>
										{s.label}
									</span>
								</button>
								{i < steps.length - 1 && (
									<div className={cn("mx-4 h-px w-8", step > s.number ? "bg-foreground" : "bg-border")} />
								)}
							</div>
						))}
					</nav>

					{/* Secure Badge */}
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<Lock className="h-3.5 w-3.5" />
						<span className="text-xs">Secure checkout</span>
					</div>
				</div>

				{/* Mobile Progress Bar */}
				<div className="mt-3 md:hidden">
					<div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
						<span>{step === confirmationStepIndex ? "Complete" : `Step ${step} of ${totalSteps}`}</span>
						<span>{steps[step - 1]?.label}</span>
					</div>
					<div className="h-1 overflow-hidden rounded-full bg-muted">
						<div
							className={cn(
								"h-full bg-foreground transition-all duration-300",
								getProgressWidthClass(step, totalSteps),
							)}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
