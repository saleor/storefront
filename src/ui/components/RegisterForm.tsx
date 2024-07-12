import { redirect } from "next/navigation";
import { SubmitButton } from "./SubmitButton";
import { registerUser } from "@/app/actions";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export async function RegisterForm({ channel }: { channel: string }) {
	const redirectUrl = `${process.env.NEXT_PUBLIC_STOREFRONT_URL}/${channel}/account-confirm/`;
	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form
				className="rounded border p-8 shadow-md"
				action={async (formData) => {
					"use server";

					const email = formData.get("email")?.toString();
					const password = formData.get("password")?.toString();
					const password2 = formData.get("password2")?.toString();

					if (!email || !password) {
						throw new Error("Email and password are required");
					}
					if (!password2) {
						throw new Error("Confirm your password");
					}

					const { accountRegister } = await registerUser(email, password, channel, redirectUrl);
					if (accountRegister && accountRegister.user) {
						redirect(`/${channel}/login`);
					}
					if (accountRegister && accountRegister.errors.length > 0) {
						throw new Error(`${accountRegister.errors[0].code} - ${accountRegister.errors[0].field}`);
					}
				}}
			>
				<div className="mb-2">
					<label className="sr-only" htmlFor="email">
						Email
					</label>
					<input
						type="email"
						name="email"
						placeholder="Email"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
					/>
				</div>
				<div className="mb-4">
					<label className="sr-only" htmlFor="password">
						Password
					</label>
					<input
						type="password"
						name="password"
						placeholder="Password"
						autoCapitalize="off"
						autoComplete="off"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
					/>
				</div>
				<div className="mb-4">
					<label className="sr-only" htmlFor="password">
						Password Confirmation
					</label>
					<input
						type="password"
						name="password2"
						placeholder="Password Confirmation"
						autoCapitalize="off"
						autoComplete="off"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
					/>
				</div>

				<SubmitButton label="Creer un compte" />
				<div className="text-right">
					<LinkWithChannel href="/login" className="h-6 w-6 flex-shrink-0">
						<p>Already have an account? Login</p>
					</LinkWithChannel>
				</div>
			</form>
			<div></div>
		</div>
	);
}
