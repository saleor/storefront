import { AppDocument, AppQuery, AppQueryVariables } from "../graphql";
import { getClientForAuthData } from "./saleorGraphqlClient";
import * as Apl from "@/saleor-app-checkout/config/apl";

export const getAppId = async (saleorApiUrl: string) => {
  const authData = await Apl.get(saleorApiUrl);
  const client = getClientForAuthData(authData);

  const { data, error } = await client
    .query<AppQuery, AppQueryVariables>(AppDocument, {})
    .toPromise();
  if (error) {
    throw new Error("Couldn't fetch app id", { cause: error });
  }
  const id = data?.app?.id;

  if (!id) {
    throw new Error("App id is empty");
  }

  return id;
};
