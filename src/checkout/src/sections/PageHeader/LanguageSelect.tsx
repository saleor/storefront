import React, { type ChangeEvent } from "react";
import { LanguageIcon } from "../../assets/icons";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { useLocale } from "@/checkout/src/hooks/useLocale";
import { POPSTATE_EVENT } from "@/checkout/src/hooks/useUrlChange";
import { type Locale, locales } from "@/checkout/src/lib/regions";
import { replaceUrl } from "@/checkout/src/lib/utils/url";
import { languagesMessages } from "@/checkout/src/sections/PageHeader/messages";
import { IconButton, Select } from "@/checkout/ui-kit";

export const LanguageSelect: React.FC = ({}) => {
	const formatMessage = useFormattedMessages();
	const { locale } = useLocale();

	const handleLanguageChange = (locale: Locale) => {
		replaceUrl({ query: { locale } });

		const navEvent = new PopStateEvent(POPSTATE_EVENT);
		window.dispatchEvent(navEvent);
	};

	return (
		<div className="relative flex flex-row justify-end">
			<IconButton
				icon={<LanguageIcon />}
				label={formatMessage(languagesMessages[locale])}
				className="pointer-events-none"
			/>
			<Select
				classNames={{ container: "!absolute right-0 !min-w-0 opacity-0" }}
				value={locale}
				onChange={(event: ChangeEvent<HTMLSelectElement>) =>
					handleLanguageChange(event.target.value as Locale)
				}
				options={locales.map((locale) => ({
					label: formatMessage(languagesMessages[locale]),
					value: locale,
				}))}
			/>
		</div>
	);
};
