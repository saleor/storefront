import { useEffect } from "react";
import { SaleorAuthEvent, STORAGE_AUTH_EVENT_KEY } from "./SaleorAuthStorageHandler";

interface UseAuthChangeProps {
  onSignedIn?: () => void;
  onSignedOut?: () => void;
}

// used to handle client cache invalidation on login / logout and when
// token refreshin fails
export const useAuthChange = ({ onSignedOut, onSignedIn }: UseAuthChangeProps) => {
  const handleAuthChange = (event: SaleorAuthEvent) => {
    const isCustomAuthEvent = event?.type === STORAGE_AUTH_EVENT_KEY;

    if (!isCustomAuthEvent) {
      return;
    }

    const { authState } = event.detail;

    if (authState === "signedIn") {
      onSignedIn?.();
    } else if (authState === "signedOut") {
      onSignedOut?.();
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // for current window
    window.addEventListener(STORAGE_AUTH_EVENT_KEY, handleAuthChange as EventListener);

    return () => {
      window.removeEventListener(STORAGE_AUTH_EVENT_KEY, handleAuthChange as EventListener);
    };
  }, []);
};
