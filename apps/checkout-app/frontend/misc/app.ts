import { isSsr } from "@/constants";
import createApp from "@saleor/app-bridge";

export const app = !isSsr ? createApp() : undefined;

export type AppBridge = ReturnType<typeof createApp>;
