"use client";

import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCheckoutBrowseLocale } from "@/checkout/providers/checkout-browse";
import { useTranslations } from "next-intl";
import { useCheckoutSteps } from "@/checkout/hooks/use-checkout-steps";
import { Logo } from "@/ui/components/shared/logo";
import { StorefrontHomeLink } from "@/ui/components/shared/storefront-home-link";

interface CheckoutHeaderProps {
	step: number;
	onStepClick?: (step: number) => void;
	isShippingRequired?: boolean;
	storefrontChannel?: string | null;
}

export function CheckoutHeader({
	step,
	onStepClick,
	isShippingRequired = true,
	storefrontChannel,
}: CheckoutHeaderProps) {
	const storefrontLocale = useCheckoutBrowseLocale();
	const t = useTranslations("checkout.steps");
	const steps = useCheckoutSteps(isShippingRequired).map((s) => ({
		number: s.index,
		label: s.label,
	}));

	const totalSteps = steps.length;

	// Calculate progress percentage dynamically
	const progressPercentage = Math.min((step / totalSteps) * 100, 100);

	return (
		<header className="bg-background md:border-b md:border-border">
			<div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 md:pb-4 md:pt-4 lg:px-8">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<StorefrontHomeLink
						locale={storefrontLocale}
						channel={storefrontChannel}
						className="flex items-center"
					>
						<Logo className="h-7 w-auto" />
					</StorefrontHomeLink>

					{/* Progress Steps - Desktop */}
					<nav className="hidden items-center gap-2 md:flex" aria-label={t("stepsAriaLabel")}>
						{steps.map((s, i) => (
							<div key={s.number} className="flex items-center">
								<button
									type="button"
									onClick={() => step > s.number && onStepClick?.(s.number)}
									disabled={step < s.number}
									aria-current={step === s.number ? "step" : undefined}
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
						<span className="text-xs">{t("secureCheckout")}</span>
					</div>
				</div>

				{/* Mobile Progress Bar */}
				<div className="mt-3 md:hidden">
					<div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
						<span>{step > totalSteps ? t("complete") : t("stepOf", { step, total: totalSteps })}</span>
						<span>{steps[step - 1]?.label}</span>
					</div>
					<div
						className="h-1 overflow-hidden rounded-full bg-muted"
						role="progressbar"
						aria-valuenow={progressPercentage}
						aria-valuemin={0}
						aria-valuemax={100}
					>
						<div
							className="h-full bg-foreground transition-all duration-300"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
