import { ReactNode } from "react";
import { TaxedMoney } from "@/checkout-storefront/graphql";
import { InpostEventData } from "../components/InpostMap/ShippingMethodInpostMap";

export interface Classes {
  className?: string;
}

export interface Children {
  children: ReactNode | ReactNode[];
}

export type GrossMoney = Pick<TaxedMoney, "gross">;
export type GrossMoneyWithTax = Pick<TaxedMoney, "gross" | "tax">;

export interface AriaLabel {
  ariaLabel: string;
}

export type GenericErrorCode = "invalid" | "required" | "unique";

export type ErrorCode =
  | GenericErrorCode
  | "quantityGreaterThanLimit"
  | "insufficientStock"
  | "invalidCredentials"
  | "emailInvalid"
  | PasswordErrorCode
  | CheckoutFinalizeErrorCode;

export type PasswordErrorCode =
  | "passwordTooShort"
  | "passwordTooSimilar"
  | "passwordTooCommon"
  | "passwordInvalid"
  | "passwordAtLeastCharacters";

export type CheckoutFinalizeErrorCode = "missingFields";

export interface ValidationError<TFormData> {
  type: ErrorCode;
  path: keyof TFormData;
  message: string;
}
export type OnInpostDataChangeType = (data: InpostEventData | null) => void;
export interface CommonSectionProps {
  collapsed: boolean;
  onInpostDataChange?: OnInpostDataChangeType;
}

export interface DeliverySectionProps {
  collapsed: boolean;
  onInpostDataChange?: OnInpostDataChangeType;
  onReceiveSelectedChange: (value: boolean) => void;
  onInpostSelectionChange: (value: boolean) => void;
  onLockerIdChange: (lockerId: string | null) => void;
}

export interface PaymentSectionProps {
  children: ReactNode | ReactNode[];
  isReceiveSelected: boolean;
  isInpostSelected: boolean;
  selectedLockerId: string | null;
}

export interface PaymentMethodProps {
  isReceiveSelected: boolean;
  selectedLockerId: string | null;
  isInpostSelected: boolean;
}

export type MightNotExist<TData> = TData | null | undefined;
