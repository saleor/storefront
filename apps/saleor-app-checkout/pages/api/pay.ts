import { createDebug } from './../../utils/debug';
import { withSentry } from "@sentry/nextjs";
import { NextApiHandler } from "next";

import { createAdyenPayment } from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { createMolliePayment } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { createOrder } from "@/saleor-app-checkout/backend/payments/createOrder";
import { OrderPaymentMetafield } from "@/saleor-app-checkout/types/common";
import {
  assertUnreachable,
  PaymentMethods,
  PaymentProviderID,
  PaymentProviders,
} from "checkout-common";
import { OrderFragment } from "@/saleor-app-checkout/graphql";
import { getOrderDetails } from "@/saleor-app-checkout/backend/payments/getOrderDetails";
import { PayRequestResponse, PayRequestErrorResponse } from "@/saleor-app-checkout/types/api/pay";
import { PayRequestBody } from "checkout-common";
import { allowCors, getBaseUrl } from "@/saleor-app-checkout/backend/utils";
import { updatePaymentMetafield } from "@/saleor-app-checkout/backend/payments/updatePaymentMetafield";
import { reuseExistingMollieSession } from "@/saleor-app-checkout/backend/payments/providers/mollie/verifySession";
import { reuseExistingAdyenSession } from "@/saleor-app-checkout/backend/payments/providers/adyen/verifySession";
import {
  CreatePaymentResult,
  Errors,
  ReuseExistingSessionParams,
  ReuseExistingSessionResult,
} from "@/saleor-app-checkout/backend/payments/types";
import { createStripePayment } from "@/saleor-app-checkout/backend/payments/providers/stripe/createPayment";
import { reuseExistingStripeSession } from "@/saleor-app-checkout/backend/payments/providers/stripe/verifySession";
import { safeJsonParse } from "@/saleor-app-checkout/utils";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";

const debug = createDebug("api/pay")

class MissingUrlError extends Error {
  constructor(public provider: PaymentProviderID, public order?: OrderFragment) {
    super(`Missing url! Provider: ${provider} | Order ID: ${order?.id ?? "(missing)"}`);
    Object.setPrototypeOf(this, MissingUrlError.prototype);
  }
}

class KnownPaymentError extends Error {
  constructor(public provider: PaymentProviderID, public errors: Errors) {
    super(`Error! Provider: ${provider} | Errors: ${errors.join(", ")}`);
    Object.setPrototypeOf(this, KnownPaymentError.prototype);
  }
}

class UnknownPaymentError extends Error {
  constructor(
    public provider: PaymentProviderID,
    public error: Error,
    public order?: OrderFragment
  ) {
    super(`Error! Provider: ${provider} | Error: ${error.message}`);
    Object.setPrototypeOf(this, UnknownPaymentError.prototype);
  }
}

const reuseExistingSession = ({
  orderId,
  provider,
  method,
  privateMetafield,
}: ReuseExistingSessionParams): ReuseExistingSessionResult => {
  const payment: OrderPaymentMetafield = JSON.parse(privateMetafield);

  if (payment.provider !== provider || payment.method !== method || !payment.session) {
    return;
  }

  const params = {
    payment,
    orderId,
    provider,
    method,
    privateMetafield,
  };

  switch (payment.provider) {
    case "mollie":
      return reuseExistingMollieSession(params);
    case "adyen":
      return reuseExistingAdyenSession(params);
    case "stripe":
      return reuseExistingStripeSession(params);
    default:
      assertUnreachable(payment.provider);
  }
};

const createOrderFromBodyOrId = async (body: PayRequestBody): Promise<OrderFragment> => {
  const provider = body.provider;
  debug(`createOrderFromBodyOrId for provider ${provider}`)

  if ("checkoutId" in body) {
    debug(`Create order for checkout ${body.checkoutId}`)
    const data = await createOrder(body.saleorApiDomain, body.checkoutId, body.totalAmount);

    if ("errors" in data) {
      debug(`Creating order with errors`)
      throw new KnownPaymentError(provider, data.errors);
    }
    debug(`Order created without errors`)
    return data.data;
  } else if ("orderId" in body) {
    debug(`Pulling order details for order ${body.orderId}`)
    const data = await getOrderDetails(body.orderId);

    if ("errors" in data) {
      debug(`Could not get order details`)
      throw new KnownPaymentError(provider, data.errors);
    }

    debug(`Returning order data`)
    return data.data;
  }

  throw new KnownPaymentError(provider, ["MISSING_CHECKOUT_OR_ORDER_ID"]);
};

const getPaymentResponse = async (
  body: PayRequestBody,
  appUrl: string
): Promise<PayRequestResponse> => {
  if (!PaymentProviders.includes(body.provider)) {
    throw new KnownPaymentError(body.provider, ["UNKNOWN_PROVIDER"]);
  }
  if (!PaymentMethods.includes(body.method)) {
    throw new KnownPaymentError(body.provider, ["UNKNOWN_METHOD"]);
  }

  const order = await createOrderFromBodyOrId(body);

  if (order.privateMetafield) {
    const existingSessionResponse = await reuseExistingSession({
      orderId: order.id,
      privateMetafield: order.privateMetafield,
      provider: body.provider,
      method: body.method,
    });

    if (existingSessionResponse) {
      return existingSessionResponse;
    }
  }

  const [paymentUrlError, data] = await unpackPromise(
    getPaymentUrlIdForProvider(body, order, appUrl)
  );

  if (paymentUrlError) {
    console.error(paymentUrlError);
    throw new UnknownPaymentError(body.provider, paymentUrlError, order);
  }

  const { id, url } = data;

  if (!url) {
    throw new MissingUrlError(body.provider, order);
  }

  const response: PayRequestResponse = {
    ok: true,
    provider: body.provider,
    orderId: order.id,
    data: {
      paymentUrl: url,
    },
  };
  const payment: OrderPaymentMetafield = {
    provider: body.provider,
    method: body.method,
    session: id,
  };

  await updatePaymentMetafield(body.saleorApiDomain, order.id, payment);

  return response;
};

const handler: NextApiHandler = async (req, res) => {
  debug("Request received")

  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const [error, body] =
    typeof req.body === "string"
      ? safeJsonParse<PayRequestBody>(req.body)
      : [null, req.body as PayRequestBody];
  
  debug("Parsed body: %O", body)
  
  if (error) {
    debug("Error while parsing request body")
    console.error(error, req.body);
    res.status(400).send({ message: "Invalid JSON" });
    return;
  }
  debug("Request body parsed")
  try {
    const appUrl = getBaseUrl(req);
    const response = await getPaymentResponse(body, appUrl);
    debug("Payment response processed, return success")
    return res.status(200).json(response);
  } catch (err) {
    if (err instanceof KnownPaymentError) {
      return res.status(400).json({
        ok: false,
        provider: err.provider,
        errors: err.errors,
      } as PayRequestErrorResponse);
    }

    if (err instanceof UnknownPaymentError) {
      return res.status(500).json({
        ok: false,
        provider: err.provider,
        orderId: err.order?.id,
      });
    }

    if (err instanceof MissingUrlError) {
      return res.status(503).json({ ok: false, provider: err.provider, orderId: err.order?.id });
    }

    console.error(err);

    return res.status(500).json({ ok: false, provider: body.provider });
  }
};

const getPaymentUrlIdForProvider = (
  body: PayRequestBody,
  order: OrderFragment,
  appUrl: string
): Promise<CreatePaymentResult> => {
  switch (body.provider) {
    case "mollie":
      return createMolliePayment({
        order,
        redirectUrl: body.redirectUrl,
        method: body.method,
        appUrl,
        saleorDomain: body.saleorApiDomain
      });
    case "adyen":
      return createAdyenPayment({
        order,
        redirectUrl: body.redirectUrl,
        method: body.method,
        appUrl,
        saleorDomain: body.saleorApiDomain
      });
    case "stripe":
      return createStripePayment({
        order,
        redirectUrl: body.redirectUrl,
        method: body.method,
        appUrl,
        saleorDomain: body.saleorApiDomain
      });
    default:
      assertUnreachable(body.provider);
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default withSentry(allowCors(handler));
