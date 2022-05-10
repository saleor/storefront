export const formatRedirectUrl = (redirectUrl: string, orderToken: string) => {
  const url = new URL(redirectUrl);
  url.searchParams.set("order", orderToken);

  return url.toString();
};
