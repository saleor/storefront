import { useEffect, useState } from "react";

const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export const useDynamicAppConfig = <T>({ checkoutAppUrl }: { checkoutAppUrl: string }) => {
  const [previewSettings, setPreviewSettings] = useState<T>();

  useEffect(() => {
    if (!inIframe()) {
      return;
    }

    const eventListener = (event: MessageEvent<T | undefined>) => {
      if (event.origin === checkoutAppUrl) {
        setPreviewSettings(event.data);
      }
    };

    window.addEventListener("message", eventListener);

    window.parent.postMessage("mounted", checkoutAppUrl);

    return () => {
      window.removeEventListener("message", eventListener);
    };

    // because this needs to only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return previewSettings;
};
