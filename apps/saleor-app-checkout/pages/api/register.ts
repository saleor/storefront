import { saleorApp } from "@/saleor-app-checkout/config/saleorApp";
import { createAppRegisterHandler } from "@saleor/app-sdk/handlers/next";

export default createAppRegisterHandler(saleorApp);
