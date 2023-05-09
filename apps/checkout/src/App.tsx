import { Root } from "@saleor/checkout-storefront";
import "@saleor/checkout-storefront/dist/index.css";
import invariant from "ts-invariant";

const checkoutApiUrl =
  typeof process.env["REACT_APP_CHECKOUT_APP_URL"] === "string"
    ? process.env["REACT_APP_CHECKOUT_APP_URL"] + `/api`
    : "";
const checkoutAppUrl = process.env["REACT_APP_CHECKOUT_APP_URL"];

const allowedSaleorApiRegex = process.env.REACT_APP_ALLOWED_SALEOR_API_REGEX;

export function App() {
  invariant(checkoutApiUrl, `Missing REACT_APP_CHECKOUT_APP_URL!`);
  invariant(checkoutAppUrl, `Missing REACT_APP_CHECKOUT_APP_URL!`);
  invariant(allowedSaleorApiRegex, `Missing REACT_APP_ALLOWED_SALEOR_API_REGEX!`);

  return (
    <div className="App">
      <Root
        env={{ checkoutApiUrl, checkoutAppUrl }}
        saleorApiUrlRegex={new RegExp(allowedSaleorApiRegex)}
      />
    </div>
  );
}
