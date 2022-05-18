import { useRouter } from "next/router";
import React from "react";

import { LOCALES } from "@/lib/regions";

import { useRegions } from "../RegionsProvider";
import { BaseRegionsDropdown } from "./BaseRegionsDropdown";
import { BaseRegionsDropdownItem } from "./BaseRegionsDropdownItem";

interface DropdownOption {
  label: string;
  chosen: boolean;
  localeSlug: string;
}

export function LocaleDropdown() {
  const router = useRouter();
  const { currentLocale, currentChannel } = useRegions();

  const localeOptions: DropdownOption[] = LOCALES.map((loc) => ({
    label: loc.name,
    chosen: loc.slug === currentLocale,
    localeSlug: loc.slug,
  }));

  const onLocaleChange = (localeSlug: string) => {
    if (localeSlug === currentLocale) {
      return;
    }

    // Update current URL to use the chosen locale
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        channel: currentChannel.slug,
        locale: localeSlug,
      },
    });
  };

  return (
    <BaseRegionsDropdown label={currentLocale}>
      {localeOptions.map((option) => (
        <BaseRegionsDropdownItem
          key={option.label}
          chosen={option.chosen}
          label={option.label}
          onClick={() => onLocaleChange(option.localeSlug)}
        />
      ))}
    </BaseRegionsDropdown>
  );
}

export default LocaleDropdown;
