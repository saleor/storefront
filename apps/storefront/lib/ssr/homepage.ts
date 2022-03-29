import { ParsedUrlQuery } from "querystring";

import { Path, regionCombinations } from "../regions";

export interface ProductPathArguments extends ParsedUrlQuery {
  channel: string;
  locale: string;
}

export const homepagePaths = () => {
  const paths: Path<ProductPathArguments>[] = regionCombinations().map((combination) => ({
    params: {
      locale: combination.localeSlug,
      channel: combination.channelSlug,
    },
  }));
  return paths;
};
