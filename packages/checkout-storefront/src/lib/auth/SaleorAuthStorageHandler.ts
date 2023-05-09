/* auth state when user signs in / out */
export const STORAGE_AUTH_EVENT_KEY = "saleor_storage_auth_change";
export const STORAGE_AUTH_STATE_KEY = "saleor_auth_module_auth_state";

const REFRESH_TOKEN_KEY = "saleor_auth_module_refresh_token";

export type AuthState = "signedIn" | "signedOut";

export type SaleorAuthEvent = CustomEvent<{ authState: AuthState }>;

export class SaleorAuthStorageHandler {
  storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;

    window.addEventListener("storage", this.handleStorageChange);
  }

  private handleStorageChange = (event: StorageEvent) => {
    const { oldValue, newValue, type, key } = event;

    if (oldValue === newValue || type !== "storage" || key !== STORAGE_AUTH_STATE_KEY) {
      return;
    }

    this.sendAuthStateEvent(newValue as AuthState);
  };

  cleanup = () => {
    window.removeEventListener("storage", this.handleStorageChange);
  };

  /* auth state */
  sendAuthStateEvent = (authState: AuthState) => {
    const event = new CustomEvent(STORAGE_AUTH_EVENT_KEY, { detail: { authState } });
    window.dispatchEvent(event);
  };

  getAuthState = (): AuthState =>
    (this.storage.getItem(STORAGE_AUTH_STATE_KEY) as AuthState | undefined) || "signedOut";

  setAuthState = (authState: AuthState) => {
    if (this.storage.getItem(STORAGE_AUTH_STATE_KEY) !== authState) {
      this.storage.setItem(STORAGE_AUTH_STATE_KEY, authState);
      this.sendAuthStateEvent(authState);
    }
  };

  /* refresh token */
  getRefreshToken = () => this.storage.getItem(REFRESH_TOKEN_KEY) || null;

  setRefreshToken = (token: string) => {
    this.storage.setItem(REFRESH_TOKEN_KEY, token);
  };

  /* performed on logout */
  clearAuthStorage = () => {
    this.setAuthState("signedOut");
    this.storage.removeItem(REFRESH_TOKEN_KEY);
  };
}
