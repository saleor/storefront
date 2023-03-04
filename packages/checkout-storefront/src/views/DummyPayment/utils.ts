export const getOrderConfirmationUrl = () => {
  const url = new URL(window.location.href);

  url.searchParams.delete("dummyPayment");

  return url.href;
};
