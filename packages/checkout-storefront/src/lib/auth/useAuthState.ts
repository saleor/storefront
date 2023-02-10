import { useMemo, useState } from "react";
import {
  getRefreshAuthState,
  handleStorageChange,
  REFRESH_STATE_KEY,
  STORAGE_REFRESH_EVENT_KEY,
} from "./localStorage";

export const useAuthState = () => {
  const [authenticating, setAuthenticating] = useState(getRefreshAuthState());

  const handler = handleStorageChange(
    STORAGE_REFRESH_EVENT_KEY,
    REFRESH_STATE_KEY,
    setAuthenticating
  ) as EventListener;

  // for current window
  window.addEventListener(STORAGE_REFRESH_EVENT_KEY, handler);
  //  for other windows
  window.addEventListener("storage", handler);

  return useMemo(() => ({ authenticating }), [authenticating]);
};
