import { useRouter } from "next/router";

import { pagesPath } from "@/lib/$path";

export const usePaths = () => {
  const { query } = useRouter();
  const channel = query.channel?.toString() || "default-channel";
  const locale = query.locale?.toString() || "en-US";
  return pagesPath._channel(channel)._locale(locale);
};
