import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const isInIframe = () => {
  try {
    return document.location !== window.parent.location;
  } catch (e) {
    return false;
  }
};

const useIsMounted = (): boolean => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return mounted;
};

const getStorefrontUrl = () => window.location.origin;

/**
 * TODO
 * basic page with
 * - docs
 * - link to storefront
 * - info if misconfigured
 * - connect AppBridge
 */
const DashboardPage: NextPage = () => {
  const mounted = useIsMounted();
  const { push } = useRouter();

  useEffect(() => {
    if (mounted && !isInIframe()) {
      void push("/");
    }
  }, [mounted, push]);

  if (!mounted || !isInIframe()) {
    return null;
  }

  return (
    <div>
      <h1>Saleor Storefront example</h1>
      <p>Storefront url: {getStorefrontUrl()}</p>

      <div>
        <code>
          <pre>CHECKOUT_STOREFRONT_URL={process.env.CHECKOUT_STOREFRONT_URL}</pre>
        </code>
      </div>
      <p>todo: links to docs</p>
    </div>
  );
};

export default DashboardPage;
