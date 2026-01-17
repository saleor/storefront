// Re-export client-safe items only
// Server code should import directly from "./server"
export { AuthProvider, saleorAuthClient } from "./auth-provider";
export { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE, encodeCookieName } from "./constants";
