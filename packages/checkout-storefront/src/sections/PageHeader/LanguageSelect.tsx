import { useFormattedMessages } from "@/checkout-storefront/hooks";
import { POPSTATE_EVENT } from "@/checkout-storefront/hooks/useUrlChange";
import { LanguageIcon } from "@/checkout-storefront/icons";
import { getCurrentLocale, Locale, locales } from "@/checkout-storefront/lib/regions";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { setLanguageInUrl } from "@/checkout-storefront/lib/utils";
import { languagesMessages } from "@/checkout-storefront/sections/PageHeader/messages";
import { IconButton, Select } from "@saleor/ui-kit";
import React, { ChangeEvent, useState } from "react";

export const LanguageSelect: React.FC = ({}) => {
  const formatMessage = useFormattedMessages();
  const [currentLanguage, setCurrentLanguage] = useState<Locale>(getCurrentLocale());

  const handleLanguageChange = (locale: Locale) => {
    setCurrentLanguage(locale);

    setLanguageInUrl(locale);

    const navEvent = new PopStateEvent(POPSTATE_EVENT);
    window.dispatchEvent(navEvent);
  };

  return (
    <div className="language-select-container">
      <IconButton
        icon={<img src={getSvgSrc(LanguageIcon)} alt="" />}
        label={formatMessage(languagesMessages[currentLanguage])}
        className="pointer-events-none"
      />
      <Select
        classNames={{ container: "language-select" }}
        value={currentLanguage}
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
