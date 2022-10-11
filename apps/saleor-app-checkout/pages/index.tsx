import { useRouter } from "next/router";
import { useEffect } from "react";

// @todo figure out why the apps/saleor-app-checkout/next.config.js
// redirect doesn't work in demo

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/channels/");
  }, [router]);

  return null;
}
