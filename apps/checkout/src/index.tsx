import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import { Root } from "@/checkout/Root";

import reportWebVitals from "./reportWebVitals";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Root />
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
