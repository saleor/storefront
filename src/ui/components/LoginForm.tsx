import { redirect } from "next/navigation";
import { getServerAuthClient } from "@/app/config";
import { LoginFormClient } from "./LoginFormClient";

interface LoginFormProps {
	channel: string;
}

export async function LoginForm({ channel }: LoginFormProps) {
	const handleLogin = async (formData: FormData) => {
		"use server";

		const email = formData.get("email")?.toString();
		const password = formData.get("password")?.toString();

		if (!email || !password) {
			throw new Error("Email and password are required");
		}

		const { data } = await (await getServerAuthClient()).signIn({ email, password }, { cache: "no-store" });

		if (data.tokenCreate.errors.length > 0) {
			const errorMessage = data.tokenCreate.errors.map((e) => e.message).join(", ");
			throw new Error(errorMessage);
		}

		// Success - redirect to channel home
		redirect(`/${channel}`);
	};

	return <LoginFormClient action={handleLogin} />;
}
