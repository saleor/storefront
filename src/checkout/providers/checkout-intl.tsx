"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import type { LocaleSlug } from "@/config/locale";
import type { CheckoutMessages } from "@/i18n/load-messages";

type CheckoutIntlProviderProps = {
	locale: LocaleSlug;
	messages: CheckoutMessages;
	children: ReactNode;
};

/** next-intl for checkout — locale from browse cookie / `?locale=`, not URL segment (ADR 0001). */
export function CheckoutIntlProvider({ locale, messages, children }: CheckoutIntlProviderProps) {
	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</NextIntlClientProvider>
	);
}
