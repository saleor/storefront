export type { AuthApiError } from "./auth-api-types";
export { loginWithBff, confirmAccountWithBff, setPasswordWithBff } from "./bff-client";
export {
	ACCOUNT_CONFIRM_QUERY_PARAM,
	buildAccountConfirmationRedirectUrl,
	getEmailAndTokenFromSearchParams,
	isAccountConfirmationLink,
} from "./account-confirmation-url";
export { LogoutButton } from "./logout-button";
export { useLogout, type LogoutOptions } from "./use-logout";
export {
	navigateToStorefrontHome,
	syncAuthSurfacesAfterSignIn,
	type SyncAuthSurfacesAfterSignInOptions,
} from "./sync-auth-surfaces-after-sign-in";
