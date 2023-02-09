import { clearAuthState, clearRefreshToken } from "@/checkout-storefront/lib/auth/localStorage";

export const useAuthActions = () => {
  const logout = () => {
    clearAuthState();
    clearRefreshToken();
  };

  return { logout };
};
