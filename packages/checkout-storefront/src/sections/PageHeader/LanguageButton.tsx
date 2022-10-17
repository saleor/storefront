import { useFormattedMessages } from "@/checkout-storefront/hooks";
import { URL_CHANGED } from "@/checkout-storefront/hooks/useUrlChange";
import { getCurrentLocale, Locale, locales } from "@/checkout-storefront/lib/regions";
import { setLanguageInUrl } from "@/checkout-storefront/lib/utils";
import { languagesMessages } from "@/checkout-storefront/sections/PageHeader/messages";
import { Select } from "@saleor/ui-kit";
import React, { SyntheticEvent, useRef, useState } from "react";

interface LanguageButtonProps {}

export const LanguageButton: React.FC<LanguageButtonProps> = ({}) => {
  const formatMessage = useFormattedMessages();
  const [currentLanguage, setCurrentLanguage] = useState<Locale>(getCurrentLocale());
  const elementRef = useRef<HTMLSpanElement>(null);

  const handleLanguageChange = (locale: Locale) => {
    setCurrentLanguage(locale);

    setLanguageInUrl(locale);

    const navEvent = new PopStateEvent(URL_CHANGED);
    window.dispatchEvent(navEvent);
  };

  return (
    <>
      <span ref={elementRef} />
      <Select
        value={currentLanguage}
        onChange={(event: SyntheticEvent) => handleLanguageChange(event.target.value as Locale)}
        options={locales.map((locale) => ({
          label: formatMessage(languagesMessages[locale]),
          value: locale,
        }))}
      />
    </>
  );
};
