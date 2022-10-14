import type { Middleware } from "retes";
import { Response } from "retes/response";
import { withSaleorDomainPresent } from "@saleor/app-sdk/middleware";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";

export const withSaleorDomainMatch: Middleware = (handler) =>
  withSaleorDomainPresent(async (request) => {
    const saleorApiHost = request.params.saleorApiHost;
    if (!saleorApiHost || typeof saleorApiHost !== "string") {
      return Response.BadRequest({
        success: false,
        message: `Missing saleorApiHost query param!`,
      });
    }

    // @todo verify if this is a domain or a host (domain + port)
    if (saleorApiHost !== request.headers[SALEOR_DOMAIN_HEADER]) {
      return Response.BadRequest({
        success: false,
        message: `Invalid ${SALEOR_DOMAIN_HEADER} header.`,
      });
    }

    return handler(request);
  });
