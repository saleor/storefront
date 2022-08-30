import { isSsr } from "@/saleor-app-checkout/constants";
import { AppBridge } from "@saleor/app-sdk/app-bridge";

export const app = !isSsr ? new AppBridge() : undefined;
