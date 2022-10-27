import { SaleorApp } from "@saleor/app-sdk/saleor-app";
import { APL, FileAPL, VercelAPL } from "@saleor/app-sdk/APL";

let apl: APL;

switch (process.env.APL) {
  case "vercel":
    apl = new VercelAPL();
    break;
  default:
    apl = new FileAPL();
}

export const saleorApp = new SaleorApp({
  apl,
});
