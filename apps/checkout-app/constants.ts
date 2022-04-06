export const APP_DOMAIN = process.env.NEXT_PUBLIC_VERCEL_URL;
export const APP_URL = `http://${APP_DOMAIN}`;
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const APP_NAME = "Checkout";
export const SALEOR_DOMAIN_HEADER = "x-saleor-domain";
export const SALEOR_TOKEN_HEADER = "x-saleor-token";

export const isSsr = typeof window === "undefined";
