import { ReactNode, useEffect, useState } from "react";
import createSafeContext from "@/lib/useSafeContext";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";

export interface SaleorAppPublicData {
  checkoutUrl?: string;
}

export const [useSaleorAppSettings, Provider] = createSafeContext<SaleorAppPublicData>();

type FetchState =
  | {
      type: "initial";
    }
  | {
      type: "loading";
    }
  | {
      type: "success";
      data: {
        checkoutUrl: string;
      };
    }
  | {
      type: "error";
      error: Error;
    };

/**
 * TODO : should it fetch once on load or rather every time user tries to redirect to checkout?
 */
export function SaleorAppSettingsProvider({ children }: { children: ReactNode }) {
  const [fetchState, setFetchState] = useState<FetchState>({ type: "initial" });

  useEffect(() => {
    fetch("/api/settings", {
      headers: [
        [SALEOR_DOMAIN_HEADER, new URL(process.env.NEXT_PUBLIC_API_URI as string).hostname],
      ],
    })
      .then((r) => r.json())
      .then(({ data }) => {
        setFetchState({
          type: "success",
          data,
        });
      })
      .catch((e) => {
        setFetchState({
          type: "error",
          error: new Error((e?.message as string) ?? "Error fetching Storefront settings"),
        });
      });
  }, []);

  const providerValues: SaleorAppPublicData = {
    checkoutUrl: fetchState.type === "success" ? fetchState?.data?.checkoutUrl : undefined,
  };

  return <Provider value={providerValues}>{children}</Provider>;
}
