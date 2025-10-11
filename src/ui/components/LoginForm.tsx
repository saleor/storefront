import { getServerAuthClient } from "@/app/config";

export async function LoginForm() {
	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form
				className="card p-8"
				action={async (formData) => {
					"use server";

					const email = formData.get("email")?.toString();
					const password = formData.get("password")?.toString();

					if (!email || !password) {
						throw new Error("Email and password are required");
					}

					const { data } = await (
						await getServerAuthClient()
					).signIn({ email, password }, { cache: "no-store" });

					if (data.tokenCreate.errors.length > 0) {
						// setErrors(data.tokenCreate.errors.map((error) => error.message));
						// setFormValues(DefaultValues);
					}
				}}
			>
				<h2 className="mb-6 font-display text-2xl font-light text-white">Sign In</h2>
				<div className="mb-4">
					<label className="label" htmlFor="email">
						Email
					</label>
					<input
						type="email"
						name="email"
						id="email"
						placeholder="you@example.com"
						className="input"
						required
					/>
				</div>
				<div className="mb-6">
					<label className="label" htmlFor="password">
						Password
					</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Enter your password"
						autoCapitalize="off"
						autoComplete="current-password"
						className="input"
						required
					/>
				</div>

				<button className="btn-primary w-full" type="submit">
					Log In
				</button>
			</form>
		</div>
	);
}
