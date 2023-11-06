export type ConsentStatus = boolean | null;

export interface PathsFunction {
  $url: (url?: { hash?: string }) => {
    pathname: string;
    query: { locale: string | number; sitemap?: string | number };
    hash: string | undefined;
    toString: () => string;
  };
}

export interface Paths {
  _sitemap: (sitemap: string | number) => PathsFunction;
  account: {
    addressBook: PathsFunction;
    login: PathsFunction;
  };
  terms_and_conditions?: PathsFunction;
  terms_and_conditions_f4u?: PathsFunction;
  terms_and_conditions_c4u?: PathsFunction;
}
