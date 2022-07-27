import type { Middleware } from "retes";
import { Response } from "retes/response";
import { withSaleorDomainPresent } from "@saleor/app-sdk/middleware";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { getSaleorDomain } from "./utils";
import { getErrorMessage } from "@/saleor-app-checkout/utils/errors";
import { unpackPromise } from "../utils/promises";

export const withSaleorDomainMatch: Middleware = (handler) =>
  withSaleorDomainPresent(async (request) => {
    const [error, saleorDomain] = await unpackPromise(getSaleorDomain());

    if (error) {
      return Response.InternalServerError({
        success: false,
        message: getErrorMessage(error),
      });
    }

    if (saleorDomain !== request.headers[SALEOR_DOMAIN_HEADER]) {
      return Response.BadRequest({
        success: false,
        message: `Invalid ${SALEOR_DOMAIN_HEADER} header.`,
      });
    }

    return handler(request);
  });
