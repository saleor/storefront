import { clearAuthState, clearRefreshToken } from "./localStorage";

export const useAuthActions = () => {
  const logout = () => {
    clearAuthState();
    clearRefreshToken();
  };

  return { logout };
};
