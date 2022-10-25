import { adyenProviderSettingIDs } from "checkout-common";
import { getPrivateSettings } from "@/saleor-app-checkout/backend/configuration/settings";
import { envVars } from "@/saleor-app-checkout/constants";
import { PrivateSettingsValues } from "@/saleor-app-checkout/types";
import { unpackPromise } from "@/saleor-app-checkout/utils/promises";
import { Types } from "@adyen/api-library";
import type { Middleware } from "retes";
import { Response } from "retes/response";
import { verifyBasicAuth } from "./utils";
import { validateHmac } from "./validator";

export type AdyenRequestContext = Required<
  PrivateSettingsValues<"unencrypted">[keyof PrivateSettingsValues<"unencrypted">]["adyen"]
>;

export type AdyenRequestParams = Types.notification.Notification;

export const withAdyenWebhookCredentials: Middleware = (handler) => async (request) => {
  const [error, settings] = await unpackPromise(getPrivateSettings(envVars.apiUrl, false));

  if (error) {
    console.error("Cannot fetch Adyen API configuration", error);
    return Response.InternalServerError("Cannot fetch Adyen API configuration");
  }

  const {
    paymentProviders: { adyen },
  } = settings;

  const keys = new Set(Object.keys(adyen));

  for (const key of adyenProviderSettingIDs) {
    if (!keys.has(key)) {
      console.error(`Missing Adyen configuration - no value for ${key}`);
      return Response.InternalServerError("Missing Adyen API configuration");
    }
  }

  return handler({
    ...request,
    context: {
      ...request.context,
      ...adyen,
    } as AdyenRequestContext,
  });
};

const isAdyenNotificationShape = (params: { [key: string]: any }): params is AdyenRequestParams => {
  return typeof params?.live === "string" && Array.isArray(params?.notificationItems);
};

export const isAdyenNotification: Middleware = (handler) => (request) => {
  if (isAdyenNotificationShape(request.params)) {
    return handler(request);
  }

  console.warn("Invalid notification made to Adyen webhook handler", request);
  return Response.BadRequest();
};

export const isAdyenWebhookAuthenticated: Middleware = (handler) => (request) => {
  const { username, password } = request.context as AdyenRequestContext;

  if (typeof request.headers.authorization !== "string") {
    return Response.Unauthorized();
  }

  if (!verifyBasicAuth(username, password, request.headers.authorization)) {
    console.warn("Unauthenticated request to Adyen webhook handler", request);
    return Response.Unauthorized();
  }

  return handler(request);
};

export const isAdyenWebhookHmacValid: Middleware = (handler) => async (request) => {
  const { hmac } = request.context as AdyenRequestContext;
  const params = request.params as AdyenRequestParams;

  // https://docs.adyen.com/development-resources/webhooks/understand-notifications#notification-structure
  // notificationItem will always contain a single item for HTTP POST
  const notificationRequestItem = params?.notificationItems?.[0]?.NotificationRequestItem;

  if (!notificationRequestItem) {
    console.error("Invalid call from adyen - no NotificationRequestItem");
    return Response.BadRequest("NotificationRequestItem is not present in the request");
  }

  // first validate the origin
  const [validationError, isValid] = await unpackPromise(
    validateHmac(notificationRequestItem, hmac)
  );

  if (!isValid || validationError) {
    console.error("Invalid hmac in Adyen webhook request", validationError || request);
    return Response.Unauthorized();
  }

  return handler(request);
};
