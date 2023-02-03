import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { POPSTATE_EVENT } from "@/checkout-storefront/hooks/useUrlChange";
import { LanguageIcon } from "@/checkout-storefront/icons";
import { Locale, locales } from "@/checkout-storefront/lib/regions";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { replaceUrl } from "@/checkout-storefront/lib/utils/url";
import { languagesMessages } from "@/checkout-storefront/sections/PageHeader/messages";
import { IconButton, Select } from "@saleor/ui-kit";
import React, { ChangeEvent } from "react";

export const LanguageSelect: React.FC = ({}) => {
  const formatMessage = useFormattedMessages();
  const { locale } = useLocale();

  const handleLanguageChange = (locale: Locale) => {
    replaceUrl({ query: { locale } });

    const navEvent = new PopStateEvent(POPSTATE_EVENT);
    window.dispatchEvent(navEvent);
  };

  return (
    <div className="language-select-container">
      <IconButton
        icon={<img src={getSvgSrc(LanguageIcon)} alt="" />}
        label={formatMessage(languagesMessages[locale])}
        className="pointer-events-none"
      />
      <Select
        classNames={{ container: "language-select" }}
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
