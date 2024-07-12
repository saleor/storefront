import { getServerAuthClient } from "@/app/config";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { SubmitButton } from "@/ui/components/SubmitButton";

export async function LoginForm() {
	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form
				className="rounded border p-8 shadow-md"
				action={async (formData) => {
					"use server";

					const email = formData.get("email")?.toString();
					const password = formData.get("password")?.toString();

					if (!email || !password) {
						throw new Error("Email and password are required");
					}

					const { data } = await getServerAuthClient().signIn({ email, password }, { cache: "no-store" });

					if (data.tokenCreate.errors.length > 0) {
						// setErrors(data.tokenCreate.errors.map((error) => error.message));
						// setFormValues(DefaultValues);
						data.tokenCreate.errors.map((error) => {
							throw new Error(error.message);
						});
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

				<SubmitButton label="Se Connecter" />
				<div className="text-right">
					<LinkWithChannel href="/register" className="h-6 w-6 flex-shrink-0">
						<p>Don&#39;t have an account? Create one</p>
					</LinkWithChannel>
				</div>
			</form>
			<div></div>
		</div>
	);
}
