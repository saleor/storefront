import { Root } from "@saleor/checkout-storefront";
import "@saleor/checkout-storefront/dist/esm/index.css";
import invariant from "ts-invariant";

const apiUrl = process.env["REACT_APP_SALEOR_API_URL"];
const checkoutApiUrl =
  typeof process.env["REACT_APP_CHECKOUT_APP_URL"] === "string"
    ? process.env["REACT_APP_CHECKOUT_APP_URL"] + `/api`
    : "";
const checkoutAppUrl = process.env["REACT_APP_CHECKOUT_APP_URL"];

export function App() {
  invariant(apiUrl, `Missing REACT_APP_SALEOR_API_URL!`);
  invariant(checkoutApiUrl, `Missing REACT_APP_CHECKOUT_APP_URL!`);
  invariant(checkoutAppUrl, `Missing REACT_APP_CHECKOUT_APP_URL!`);

  return (
    <div className="App">
      <Root env={{ apiUrl, checkoutApiUrl, checkoutAppUrl }} />
    </div>
  );
}
