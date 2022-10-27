import { createAppRegisterHandler } from "@saleor/app-sdk/handlers/next";
import { saleorApp } from "../../saleor-app/saleor-app";

export default createAppRegisterHandler(saleorApp);
