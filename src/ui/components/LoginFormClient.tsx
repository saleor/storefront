"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

interface LoginFormClientProps {
	action: (formData: FormData) => Promise<void>;
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			className="rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700 disabled:opacity-50"
			type="submit"
			disabled={pending}
		>
			{pending ? "Logging in..." : "Log In"}
		</button>
	);
}

export function LoginFormClient({ action }: LoginFormClientProps) {
	const [state, formAction] = useActionState(async (_previousState: string | null, formData: FormData) => {
		try {
			await action(formData);
			return null;
		} catch (error) {
			return error instanceof Error ? error.message : "An error occurred";
		}
	}, null);

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			{state && <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">{state}</div>}

			<form className="rounded border p-8 shadow-md" action={formAction}>
				<div className="mb-2">
					<label className="sr-only" htmlFor="email">
						Email
					</label>
					<input
						required
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
						required
						type="password"
						name="password"
						placeholder="Password"
						autoCapitalize="off"
						autoComplete="off"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
					/>
				</div>

				<SubmitButton />
			</form>
		</div>
	);
}
