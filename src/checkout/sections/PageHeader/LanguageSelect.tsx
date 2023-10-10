import React from "react";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { useLocale } from "@/checkout/hooks/useLocale";
import { POPSTATE_EVENT } from "@/checkout/hooks/useUrlChange";
import { type Locale, locales } from "@/checkout/lib/regions";
import { replaceUrl } from "@/checkout/lib/utils/url";
import { languagesMessages } from "@/checkout/sections/PageHeader/messages";

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
				className="h-10 w-full cursor-pointer appearance-none rounded border border-gray-600 px-3 py-2 pr-12 text-base"
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
