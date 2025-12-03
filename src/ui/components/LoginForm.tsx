import { LoginButton } from "@/ui/atoms/LoginButton";
import { getServerAuthClient } from "@/app/config";

export async function LoginForm() {
	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form
				className="flex flex-col gap-y-2 rounded border p-8 shadow-md"
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
				<label>
					<span className="sr-only">Email</span>
					<input
						required
						type="email"
						name="email"
						placeholder="Email"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
						required
					/>
				</label>
				<label>
					<span className="sr-only">Password</span>
					<input
						required
						type="password"
						name="password"
						placeholder="Password"
						autoCapitalize="off"
						autoComplete="off"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
						required
					/>
				</label>
				<LoginButton />
			</form>
		</div>
	);
}
