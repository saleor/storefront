export type { AuthApiError } from "./auth-api-types";
export { loginWithBff, setPasswordWithBff } from "./bff-client";
export { LogoutButton } from "./logout-button";
export { useLogout, type LogoutOptions } from "./use-logout";
export {
	navigateToStorefrontHome,
	syncAuthSurfacesAfterSignIn,
	type SyncAuthSurfacesAfterSignInOptions,
} from "./sync-auth-surfaces-after-sign-in";
