import type { AuthApiError } from "./auth-api-types";

export type { AuthApiError };

type AuthApiResponse = {
	ok?: boolean;
	success?: boolean;
	errors?: AuthApiError[];
};

async function parseAuthResponse(response: Response): Promise<AuthApiResponse> {
	try {
		return (await response.json()) as AuthApiResponse;
	} catch {
		return { errors: [{ message: "An error occurred. Please try again." }] };
	}
}

export async function loginWithBff(email: string, password: string): Promise<AuthApiResponse> {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
		credentials: "same-origin",
	});

	const data = await parseAuthResponse(response);

	if (!response.ok && !data.errors?.length) {
		return { errors: [{ message: "Sign in failed. Please try again." }] };
	}

	return data;
}

export async function setPasswordWithBff(
	email: string,
	token: string,
	password: string,
): Promise<AuthApiResponse> {
	const response = await fetch("/api/auth/set-password", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, token, password }),
		credentials: "same-origin",
	});

	const data = await parseAuthResponse(response);

	if (!response.ok && !data.errors?.length) {
		return { errors: [{ message: "Failed to reset password. Please try again." }] };
	}

	return data;
}
