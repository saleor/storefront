import { useRouter } from "next/router";

import { pagesPath } from "@/lib/$path";
import { DEFAULT_LOCALE, DEFAULT_CHANNEL } from "./regions";

export const usePaths = () => {
  const { query } = useRouter();
  const channel = query.channel?.toString() || DEFAULT_CHANNEL.slug;
  const locale = query.locale?.toString() || DEFAULT_LOCALE;
  return { paths: pagesPath._channel(channel)._locale(locale) };
};
