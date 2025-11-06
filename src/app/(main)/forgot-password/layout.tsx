import { type ReactNode, Suspense } from "react";
import { AuthProvider } from "@/ui/components/AuthProvider";

export default function ForgotPasswordLayout(props: { children: ReactNode }) {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-500 border-t-transparent" />
				</div>
			}
		>
			<AuthProvider>{props.children}</AuthProvider>
		</Suspense>
	);
}
