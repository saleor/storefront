import type { Middleware } from "retes";
import { Response } from "retes/response";
import { withSaleorDomainPresent } from "@saleor/app-sdk/middleware";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";

export const withSaleorDomainMatch: Middleware = (handler) =>
  withSaleorDomainPresent(async (request) => {
    const saleorApiUrl = request.params.saleorApiUrl;
    if (!saleorApiUrl || typeof saleorApiUrl !== "string") {
      return Response.BadRequest({
        success: false,
        message: `Missing saleorApiUrl query param!`,
      });
    }

    const domain = new URL(saleorApiUrl).host;
    if (domain !== request.headers[SALEOR_DOMAIN_HEADER]) {
      return Response.BadRequest({
        success: false,
        message: `Invalid ${SALEOR_DOMAIN_HEADER} header: ${domain} != ${
          request.headers[SALEOR_DOMAIN_HEADER]?.toString() || "(no value)"
        }`,
      });
    }

    return handler(request);
  });
