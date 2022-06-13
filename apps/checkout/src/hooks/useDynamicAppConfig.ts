import { envVars } from "@/checkout/lib/utils";
import { useEffect, useState } from "react";

const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export const useDynamicAppConfig = <T>() => {
  const [previewSettings, setPreviewSettings] = useState<T>();

  useEffect(() => {
    if (!inIframe()) {
      return;
    }

    const eventListener = (event: MessageEvent<T | undefined>) => {
      if (event.origin === envVars.checkoutAppUrl) {
        setPreviewSettings(event.data);
      }
    };

    window.addEventListener("message", eventListener);

    window.parent.postMessage("mounted", envVars.checkoutAppUrl);

    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, []);

  return previewSettings;
};
