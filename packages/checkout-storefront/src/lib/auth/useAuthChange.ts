import {
  AuthState,
  AUTH_STATE_KEY,
  handleStorageChange,
  STORAGE_AUTH_EVENT_KEY,
} from "./localStorage";

interface UseAuthChangeProps {
  onAuthSuccess: () => void;
  onAuthError: () => void;
}

export const useAuthChange = ({ onAuthSuccess, onAuthError }: UseAuthChangeProps) => {
  const handleAuthChange = (state: AuthState) => {
    if (state === "success") {
      onAuthSuccess();
    } else if (state === "fail") {
      onAuthError();
    }
  };

  const handler = handleStorageChange(
    STORAGE_AUTH_EVENT_KEY,
    AUTH_STATE_KEY,
    handleAuthChange
  ) as EventListener;

  // for current window
  window.addEventListener(STORAGE_AUTH_EVENT_KEY, handler);
  //  for other windows
  window.addEventListener("storage", handler);
};
