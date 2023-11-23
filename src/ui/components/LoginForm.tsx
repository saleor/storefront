import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { type FormEvent, useState } from "react";

type FormValues = {
	email: string;
	password: string;
};

const DefaultValues: FormValues = { email: "", password: "" };

export function LoginForm() {
	const { signIn } = useSaleorAuthContext();

	const [formValues, setFormValues] = useState<FormValues>(DefaultValues);
	const [errors, setErrors] = useState<string[]>([]);

	const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { data } = await signIn(formValues);

		if (data.tokenCreate.errors.length > 0) {
			setErrors(data.tokenCreate.errors.map((error) => error.message));
			setFormValues(DefaultValues);
		}
	};

	const changeHandler = (event: FormEvent<HTMLInputElement>) => {
		const { name, value } = event.currentTarget;
		setFormValues((prev) => ({ ...prev, [name]: value }));

		if (errors.length > 0) setErrors([]);
	};
	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form className="rounded border p-8 shadow-md" onSubmit={submitHandler}>
				<div className="mb-2">
					<label className="sr-only" htmlFor="email">
						Email
					</label>
					<input
						type="email"
						name="email"
						placeholder="Email"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
						value={formValues.email}
						onChange={changeHandler}
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
						value={formValues.password}
						onChange={changeHandler}
					/>
				</div>

				<button
					className="rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
					type="submit"
				>
					Log In
				</button>
			</form>
			<div>
				{errors.map((error) => (
					<p key={error} className="text-red-500">
						{error}
					</p>
				))}
			</div>
		</div>
	);
}
