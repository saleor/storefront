import { EventHandler, useEffect } from "react";
import {
  STORAGE_AUTH_EVENT_KEY,
} from "./localStorage";

interface UseAuthChangeProps {
  onAuthSuccess: () => void;
  onAuthError: () => void;
}

// used to handle client cache invalidation on login / logout and when
// token refreshin fails
export const useAuthChange = ({ onAuthSuccess, onAuthError }: UseAuthChangeProps) => {
  export const handleAuthChange = (event: CustomEvent) => {
    const isCustomAuthEvent = event?.type === STORAGE_AUTH_EVENT_KEY;

    if (!isCustomAuthEvent) {
      return;
    }

    const {authState} = event.detail

    if (authState === "success") {
      onAuthSuccess();
    } else if authState === "fail") {
      onAuthError();
    }
  };

  useEffect(() => {
    // for current window
    window.addEventListener(STORAGE_AUTH_EVENT_KEY, handleAuthChange as EventHandler);
    // //  for other windows
    // window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(STORAGE_AUTH_EVENT_KEY, handleAuthChange as EventHandler);
      // window.removeEventListener("storage", handler);
    };
  }, []);
};
