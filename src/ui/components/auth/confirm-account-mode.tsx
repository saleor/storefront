"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { confirmAccountWithBffDeduped } from "@/lib/auth/confirm-account-client";
import { buttonClassName } from "@/ui/components/ui/button";

type ConfirmState = "confirming" | "success" | "error";

type Props = {
	email: string;
	token: string;
	channel: string;
	/** Called after a successful confirmation (e.g. refresh checkout session). */
	onConfirmed?: () => void | Promise<void>;
	signInHref?: string;
	continueShoppingHref?: string;
};

export function ConfirmAccountMode({
	email,
	token,
	channel,
	onConfirmed,
	signInHref,
	continueShoppingHref,
}: Props) {
	const [state, setState] = useState<ConfirmState>("confirming");
	const [error, setError] = useState("");
	const onConfirmedRef = useRef(onConfirmed);

	const loginHref = signInHref ?? `/${channel}/login`;
	const storeHref = continueShoppingHref ?? `/${channel}`;

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
					setError(
						"This confirmation link has expired or was already used. Try signing in or register again.",
					);
				} else {
					setError(err.message || "Failed to confirm account");
				}
				setState("error");
				return;
			}

			if (result.success) {
				setState("success");
				await onConfirmedRef.current?.();
				return;
			}

			setError("Failed to confirm account. Please try again.");
			setState("error");
		}

		void run();

		return () => {
			cancelled = true;
		};
	}, [email, token]);

	if (state === "confirming") {
		return (
			<div className="mx-auto my-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="flex flex-col items-center gap-4 text-center">
						<Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-hidden />
						<h1 className="text-2xl font-semibold">Confirming your account</h1>
						<p className="text-sm text-muted-foreground">
							Verifying <span className="font-medium text-foreground">{email}</span>…
						</p>
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
						<h1 className="text-2xl font-semibold">Account confirmed</h1>
						<p className="text-muted-foreground">
							Your account for <span className="font-medium text-foreground">{email}</span> is active. Sign in
							with the password you created.
						</p>
						<Link
							href={loginHref}
							className={buttonClassName({
								asLink: true,
								className: "h-12 w-full text-base font-semibold",
							})}
						>
							Sign in
						</Link>
						<Link
							href={storeHref}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
						>
							Continue shopping
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
					<h1 className="text-2xl font-semibold">Couldn&apos;t confirm account</h1>
					<p role="alert" className="text-sm text-destructive">
						{error}
					</p>
					<Link
						href={loginHref}
						className={buttonClassName({
							variant: "outline-solid",
							asLink: true,
							className: "h-12 w-full text-base font-semibold",
						})}
					>
						Go to sign in
					</Link>
					<Link
						href={storeHref}
						className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
					>
						Continue shopping
					</Link>
				</div>
			</div>
		</div>
	);
}
