import { CHECKOUT_TOKEN } from "./const";

export const clearCheckout = () => {
  localStorage.removeItem(CHECKOUT_TOKEN);
};
