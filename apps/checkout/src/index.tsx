import React from "react";
import ReactDOM from "react-dom";
import { createClient, Provider } from "urql";

import "./index.css";
import { Checkout } from "./Checkout";
import reportWebVitals from "./reportWebVitals";

const client = createClient({
  url: "https://vercel-saleor-cloud.graphcdn.app/",
  suspense: true,
});

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Provider value={client}>
      <Checkout />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
