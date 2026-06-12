import { AuthFormSection } from "@/ui/components/auth/auth-form-section";

/** Session cookies exist but profile could not be loaded — not the same as signed out. */
export function AccountUnavailable() {
	return (
		<AuthFormSection>
			<div className="mx-auto my-16 w-full max-w-md text-center">
				<h1 className="text-2xl font-semibold">Unable to load your account</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					The store is temporarily unavailable. Refresh the page or try again in a moment.
				</p>
			</div>
		</AuthFormSection>
	);
}
