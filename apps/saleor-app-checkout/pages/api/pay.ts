import { withSentry } from "@sentry/nextjs";
import { NextApiHandler } from "next";

import { createAdyenCheckoutPaymentLinks } from "@/saleor-app-checkout/backend/payments/providers/adyen";
import { createMolliePayment } from "@/saleor-app-checkout/backend/payments/providers/mollie";
import { OrderPaymentMetafield } from "@/saleor-app-checkout/types/common";
import { assertUnreachable, PaymentMethods, PaymentProviders } from "checkout-common";
import { OrderFragment } from "@/saleor-app-checkout/graphql";
import { PayRequestResponse, PayRequestErrorResponse } from "@/saleor-app-checkout/types/api/pay";
import { PayRequestBody } from "checkout-common";
import { allowCors, getBaseUrl } from "@/saleor-app-checkout/backend/utils";
import { updatePaymentMetafield } from "@/saleor-app-checkout/backend/payments/updatePaymentMetafield";
import { reuseExistingMollieSession } from "@/saleor-app-checkout/backend/payments/providers/mollie/verifySession";
import { reuseExistingAdyenSession } from "@/saleor-app-checkout/backend/payments/providers/adyen/verifySession";
import {
  CreatePaymentResult,
  ReuseExistingSessionParams,
  ReuseExistingSessionResult,
} from "@/saleor-app-checkout/backend/payments/types";
import { createStripePayment } from "@/saleor-app-checkout/backend/payments/providers/stripe/createPayment";
import { reuseExistingStripeSession } from "@/saleor-app-checkout/backend/payments/providers/stripe/verifySession";
import { safeJsonParse } from "@/saleor-app-checkout/utils";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import { createOrderFromBodyOrId } from "@/saleor-app-checkout/backend/payments/createOrderFromBody";
import {
  KnownPaymentError,
  UnknownPaymentError,
  MissingUrlError,
} from "@/saleor-app-checkout/backend/payments/errors";

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

  await updatePaymentMetafield(order.id, payment);

  return response;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const [error, body] =
    typeof req.body === "string"
      ? safeJsonParse<PayRequestBody>(req.body)
      : [null, req.body as PayRequestBody];

  if (error) {
    console.error(error, req.body);
    res.status(400).send({ message: "Invalid JSON" });
    return;
  }

  try {
    const appUrl = getBaseUrl(req);
    const response = await getPaymentResponse(body, appUrl);
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
  const createPaymentData = {
    order,
    redirectUrl: body.redirectUrl,
    method: body.method,
    appUrl,
  };

  switch (body.provider) {
    case "mollie":
      return createMolliePayment(createPaymentData);
    case "adyen":
      return createAdyenCheckoutPaymentLinks(createPaymentData);
    case "stripe":
      return createStripePayment(createPaymentData);
    default:
      assertUnreachable(body.provider);
  }
};

export default withSentry(allowCors(handler));
