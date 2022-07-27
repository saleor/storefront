import {
  PrivateMetafieldsInferedQuery,
  PrivateMetafieldsInferedQueryVariables,
} from "@/saleor-app-checkout/graphql";
import { appPrivateMetafields } from "../fixtures/saleor";
import { prepareGraphqlMetafields, saleorApi } from "../utils";

export const saleorHandlers = [
  saleorApi.query<
    PrivateMetafieldsInferedQuery,
    PrivateMetafieldsInferedQueryVariables
  >("PrivateMetafieldsInfered", (req, res, ctx) => {
    const { keys } = req.variables;

    if (!keys || typeof keys === "string" || keys?.length === 0) {
      return res(
        ctx.errors([
          {
            message: "Missing keys",
            errorType: "TestError",
          },
        ])
      );
    }

    return res(
      ctx.data({
        app: {
          id: "123",
          privateMetafields: prepareGraphqlMetafields(
            keys,
            appPrivateMetafields
          ),
        },
      })
    );
  }),
];
