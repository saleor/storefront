"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { confirmAccountWithBffDeduped } from "@/lib/auth/confirm-account-client";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { buttonClassName } from "@/ui/components/ui/button";

type ConfirmState = "confirming" | "success" | "error";

type ConfirmErrorKey = "invalidConfirmToken" | "confirmFailed";

type Props = {
	email: string;
	token: string;
	locale: string;
	channel: string;
	/** Called after a successful confirmation (e.g. refresh checkout session). */
	onConfirmed?: () => void | Promise<void>;
	signInHref?: string;
	continueShoppingHref?: string;
};

export function ConfirmAccountMode({
	email,
	token,
	locale,
	channel,
	onConfirmed,
	signInHref,
	continueShoppingHref,
}: Props) {
	const t = useTranslations("account");
	const [state, setState] = useState<ConfirmState>("confirming");
	const [errorKey, setErrorKey] = useState<ConfirmErrorKey | null>(null);
	const onConfirmedRef = useRef(onConfirmed);

	const loginHref = signInHref ?? buildStorefrontPath(locale, channel, "/login");
	const storeHref = continueShoppingHref ?? buildStorefrontPath(locale, channel);

	useEffect(() => {
		onConfirmedRef.current = onConfirmed;
	}, [onConfirmed]);

	useEffect(() => {
		let cancelled = false;

		async function run() {
			const result = await confirmAccountWithBffDeduped(email, token);

			if (cancelled) {
				return;
			}

			if (result.errors?.length) {
				const err = result.errors[0];
				if (err.code === "INVALID_TOKEN" || err.message?.toLowerCase().includes("token")) {
					setErrorKey("invalidConfirmToken");
				} else {
					setErrorKey("confirmFailed");
				}
				setState("error");
				return;
			}

			if (result.success) {
				setState("success");
				await onConfirmedRef.current?.();
				return;
			}

			setErrorKey("confirmFailed");
			setState("error");
		}

		void run();

		return () => {
			cancelled = true;
		};
	}, [email, token]);

	const errorMessage = errorKey ? t(`errors.${errorKey}`) : "";

	if (state === "confirming") {
		return (
			<div className="mx-auto my-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="flex flex-col items-center gap-4 text-center">
						<Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-hidden />
						<h1 className="text-2xl font-semibold">{t("confirm.confirmingTitle")}</h1>
						<p className="text-sm text-muted-foreground">{t("confirm.confirmingBody", { email })}</p>
					</div>
				</div>
			</div>
		);
	}

	if (state === "success") {
		return (
			<div className="mx-auto my-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
							<CheckCircle className="h-8 w-8 text-green-600" aria-hidden />
						</div>
						<h1 className="text-2xl font-semibold">{t("confirm.successTitle")}</h1>
						<p className="text-muted-foreground">{t("confirm.successBody", { email })}</p>
						<Link
							href={loginHref}
							className={buttonClassName({
								asLink: true,
								className: "h-12 w-full text-base font-semibold",
							})}
						>
							{t("confirm.signIn")}
						</Link>
						<Link
							href={storeHref}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
						>
							{t("confirm.continueShopping")}
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto my-16 w-full max-w-md">
			<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
				<div className="flex flex-col items-center gap-4 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						<Mail className="h-8 w-8 text-muted-foreground" aria-hidden />
					</div>
					<h1 className="text-2xl font-semibold">{t("confirm.errorTitle")}</h1>
					<p role="alert" className="text-sm text-destructive">
						{errorMessage}
					</p>
					<Link
						href={loginHref}
						className={buttonClassName({
							variant: "outline-solid",
							asLink: true,
							className: "h-12 w-full text-base font-semibold",
						})}
					>
						{t("confirm.goToSignIn")}
					</Link>
					<Link
						href={storeHref}
						className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
					>
						{t("confirm.continueShopping")}
					</Link>
				</div>
			</div>
		</div>
	);
}
