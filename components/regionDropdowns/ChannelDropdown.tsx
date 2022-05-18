import { useRouter } from "next/router";
import React from "react";

import { useRegions } from "../RegionsProvider";
import { BaseRegionsDropdown } from "./BaseRegionsDropdown";
import { BaseRegionsDropdownItem } from "./BaseRegionsDropdownItem";

interface DropdownOption {
  label: string;
  chosen: boolean;
  channelSlug: string;
}

export function ChannelDropdown() {
  const router = useRouter();
  const { channels, currentChannel, setCurrentChannel, currentLocale } = useRegions();

  const channelOptions: DropdownOption[] = channels.map((ch) => ({
    label: ch.name,
    chosen: ch.slug === currentChannel.slug,
    channelSlug: ch.slug,
  }));

  const onChannelChange = (channelSlug: string) => {
    if (channelSlug === currentChannel.slug) {
      return;
    }
    setCurrentChannel(channelSlug);

    // Update current URL to use the chosen channel
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        channel: channelSlug,
        locale: currentLocale,
      },
    });
  };

  return (
    <BaseRegionsDropdown label={currentChannel.currencyCode}>
      {channelOptions.map((option) => (
        <BaseRegionsDropdownItem
          key={option.label}
          chosen={option.chosen}
          label={option.label}
          onClick={() => onChannelChange(option.channelSlug)}
        />
      ))}
    </BaseRegionsDropdown>
  );
}

export default ChannelDropdown;
