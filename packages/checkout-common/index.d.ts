import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

declare type IconComponent = OverridableComponent<SvgIconTypeMap<{}, "svg">>;

declare type SettingType = "string" | "color" | "image";

declare type PaymentMethodID = "creditCard" | "applePay" | "paypal";
interface PaymentMethod {
  id: PaymentMethodID;
  name: string;
  logo?: IconComponent;
}
declare type PaymentProviderID = "mollie" | "adyen";
declare type MollieProviderSettingID = "profileId" | "apiKey";
declare const adyenProviderSettingIDs: readonly [
  "merchantAccount",
  "hmac",
  "username",
  "password",
  "apiKey",
  "clientKey"
];
declare type AdyenProviderSettingID = typeof adyenProviderSettingIDs[number];
declare type PaymentProviderSettingID<P extends PaymentProviderID> = P extends "mollie"
  ? MollieProviderSettingID
  : P extends "adyen"
  ? AdyenProviderSettingID
  : never;
interface PaymentProviderSettings<P extends PaymentProviderID> {
  id: PaymentProviderSettingID<P>;
  label: string;
  type: SettingType;
  value?: string;
  encrypt: boolean;
}
interface PaymentProvider<P extends PaymentProviderID> {
  id: P;
  label: string;
  logo?: IconComponent;
  settings: PaymentProviderSettings<P>[];
}

declare type BaseBody = {
  checkoutApiUrl: string;
  provider: PaymentProviderID;
  redirectUrl: string;
};
declare type OrderBody = {
  orderId: string;
} & BaseBody;
declare type CheckoutBody = {
  checkoutId: string;
  totalAmount: number;
} & BaseBody;
declare type PayRequestBody = OrderBody | CheckoutBody;
declare type PaymentStatusResponse = {
  status: "PAID" | "PENDING" | "UNPAID";
  sessionLink?: string;
};
declare type ChannelActivePaymentProvidersByChannel = {
  [P in PaymentMethodID]: PaymentProviderID | "";
};

export {
  AdyenProviderSettingID,
  ChannelActivePaymentProvidersByChannel,
  CheckoutBody,
  IconComponent,
  MollieProviderSettingID,
  OrderBody,
  PayRequestBody,
  PaymentMethod,
  PaymentMethodID,
  PaymentProvider,
  PaymentProviderID,
  PaymentProviderSettingID,
  PaymentProviderSettings,
  PaymentStatusResponse,
  SettingType,
  adyenProviderSettingIDs,
};
