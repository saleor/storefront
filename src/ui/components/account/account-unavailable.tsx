import { getTranslations } from "next-intl/server";
import { AuthFormSection } from "@/ui/components/auth/auth-form-section";

/** Session cookies exist but profile could not be loaded — not the same as signed out. */
export async function AccountUnavailable({ locale }: { locale: string }) {
	const t = await getTranslations({ locale, namespace: "account.unavailable" });

	return (
		<AuthFormSection>
			<div className="mx-auto my-16 w-full max-w-md text-center">
				<h1 className="text-balance text-h1">{t("title")}</h1>
				<p className="mt-2 text-sm text-muted-foreground">{t("body")}</p>
			</div>
		</AuthFormSection>
	);
}
