import { Dispatch, ReactNode, SetStateAction } from "react";
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
  onIsOnReceiveSelectedChange: (value: boolean) => void;
  setSelectedLockerId: Dispatch<SetStateAction<string | null>>;
  setIsInpostSelected: Dispatch<SetStateAction<boolean>>;
  setSelectedShippingMethod: Dispatch<SetStateAction<string | null>>;
}

export interface PaymentSectionProps {
  children: ReactNode | ReactNode[];
  isOnReceiveSelected: boolean;
  isInpostSelected: boolean;
  selectedLockerId: string | null;
}

export interface PaymentMethodProps {
  isOnReceiveSelected: boolean;
  isLockerIdSelected: boolean;
  isInpostSelected: boolean;
}

export type MightNotExist<TData> = TData | null | undefined;
