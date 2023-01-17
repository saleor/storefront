import { useRouter } from "next/router";
import { useMemo } from "react";

import English from "../../content/compiled-locales/en.json";
import Polish from "../../content/compiled-locales/pl.json";
import Slovak from "../../content/compiled-locales/sk.json";

export const useFormattedMessages = () => {
  const { locale } = useRouter();
  const [shortLocale] = locale ? locale.split("-") : ["en"];

  const messages = useMemo(() => {
    switch (shortLocale) {
      case "pl":
        return Polish;
      case "sk":
        return Slovak;
      case "en":
        return English;
      default:
        return English;
    }
  }, [shortLocale]);

  return {
    locale: shortLocale,
    messages,
  };
};
