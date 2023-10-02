import React from "react";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { useLocale } from "@/checkout/src/hooks/useLocale";
import { POPSTATE_EVENT } from "@/checkout/src/hooks/useUrlChange";
import { type Locale, locales } from "@/checkout/src/lib/regions";
import { replaceUrl } from "@/checkout/src/lib/utils/url";
import { languagesMessages } from "@/checkout/src/sections/PageHeader/messages";

export const LanguageSelect = () => {
	const formatMessage = useFormattedMessages();
	const { locale } = useLocale();

	const handleLanguageChange = (locale: Locale) => {
		replaceUrl({ query: { locale } });

		const navEvent = new PopStateEvent(POPSTATE_EVENT);
		window.dispatchEvent(navEvent);
	};

	return (
		<div className="relative flex flex-row justify-end">
			<select
				value={locale}
				onChange={(event) => handleLanguageChange(event.currentTarget.value as Locale)}
				className="h-10 w-full cursor-pointer appearance-none rounded border border-slate-600 px-3 py-2 pr-12 text-base"
			>
				{locales.map((locale) => (
					<option value={locale} key={locale}>
						{formatMessage(languagesMessages[locale])}
					</option>
				))}
			</select>
		</div>
	);
};
