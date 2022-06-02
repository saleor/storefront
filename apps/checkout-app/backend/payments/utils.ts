export const formatRedirectUrl = (redirectUrl: string, orderId: string) => {
  const url = new URL(redirectUrl);
  url.searchParams.set("order", orderId);

  return url.toString();
};
