import React from "react";
import ReactDOM from "react-dom";
import { createClient, Provider as UrqlProvider } from "urql";

import "./index.css";
import { Checkout } from "./Checkout";
import reportWebVitals from "./reportWebVitals";
import { getCurrentRegion } from "./lib/regions";
import { I18nProvider } from "@react-aria/i18n";

const client = createClient({
  url: "https://latest.staging.saleor.cloud/graphql/",
  suspense: true,
  requestPolicy: "cache-first",
});

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  // disabled temporarily because of headless-ui transition not working
  // yet with React 18 https://github.com/tailwindlabs/headlessui/issues/681
  // <React.StrictMode>
  <I18nProvider locale={getCurrentRegion()}>
    <UrqlProvider value={client}>
      <Checkout />
    </UrqlProvider>
  </I18nProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
