"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@/ui/atoms/Loader";

type ConfirmationState = "loading" | "success" | "error" | "invalid";

export default function ConfirmAccountPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [state, setState] = useState<ConfirmationState>("loading");
	const [errorMessage, setErrorMessage] = useState<string>("");

	useEffect(() => {
		const confirmAccount = async () => {
			const email = searchParams.get("email");
			const token = searchParams.get("token");

			if (!email || !token) {
				setState("invalid");
				setErrorMessage("Invalid confirmation link. Please check your email and try again.");
				return;
			}

			try {
				// First, let's generate the types by running the graphql codegen
				// We'll use fetch directly for now since the mutation might not be generated yet
				const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL!, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: `
							mutation confirmAccount($email: String!, $token: String!) {
								confirmAccount(email: $email, token: $token) {
									errors {
										message
										field
										code
									}
									user {
										id
										email
									}
								}
							}
						`,
						variables: { email, token },
					}),
				});

				const { data } = (await response.json()) as {
					data?: {
						confirmAccount?: {
							errors?: Array<{ message?: string; field?: string; code?: string }>;
							user?: { id: string; email: string };
						};
					};
				};

				if (data?.confirmAccount?.errors && data.confirmAccount.errors.length > 0) {
					const error = data.confirmAccount.errors[0];
					setState("error");

					// Handle specific error codes
					if (error.code === "INVALID") {
						setErrorMessage("The confirmation link is invalid or has expired. Please request a new one.");
					} else {
						setErrorMessage(error.message || "An error occurred while confirming your account.");
					}
				} else if (data?.confirmAccount?.user) {
					setState("success");
					// Auto-login after successful confirmation
					// The token should already be set by the confirmAccount mutation
					setTimeout(() => {
						router.push("/");
					}, 2000);
				} else {
					setState("error");
					setErrorMessage("An unexpected error occurred. Please try again.");
				}
			} catch (error) {
				console.error("Confirmation error:", error);
				setState("error");
				setErrorMessage("An unexpected error occurred. Please try again later.");
			}
		};

		void confirmAccount();
	}, [searchParams, router]);

	return (
		<section className="mx-auto max-w-7xl p-8">
			<div className="mx-auto mt-16 w-full max-w-lg">
				<div className="card p-8">
					<h2 className="mb-6 font-display text-2xl font-light text-white">
						{state === "loading" && "Confirming Your Account"}
						{state === "success" && "Account Confirmed!"}
						{state === "error" && "Confirmation Failed"}
						{state === "invalid" && "Invalid Link"}
					</h2>

					{state === "loading" && (
						<div className="flex flex-col items-center gap-4">
							<Loader />
							<p className="text-center text-neutral-300">
								Please wait while we confirm your email address...
							</p>
						</div>
					)}

					{state === "success" && (
						<div className="flex flex-col gap-4">
							<div className="rounded-md bg-green-50 p-4 border border-green-200">
								<p className="text-sm text-green-800">
									Your account has been successfully confirmed! You can now log in.
								</p>
							</div>
							<p className="text-center text-neutral-300">
								Redirecting you to the home page...
							</p>
						</div>
					)}

					{(state === "error" || state === "invalid") && (
						<div className="flex flex-col gap-4">
							<div className="rounded-md bg-red-50 p-4 border border-red-200">
								<p className="text-sm text-red-800">{errorMessage}</p>
							</div>
							<button
								className="btn-primary w-full"
								onClick={() => router.push("/login")}
							>
								Go to Login
							</button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
