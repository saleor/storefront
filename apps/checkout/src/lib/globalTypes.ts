export interface Classes {
  className?: string;
}

export interface AriaLabel {
  ariaLabel: string;
}

export type ErrorCode =
  | "invalid"
  | "required"
  | "unique"
  | "quantityGreaterThanLimit"
  | "insufficientStock"
  | "invalidCredentials"
  | PasswordErrorCode;

export type PasswordErrorCode =
  | "passwordTooShort"
  | "passwordTooSimilar"
  | "passwordTooCommon"
  | "passwordInvalid";

export interface ValidationError<TFormData> {
  type: ErrorCode;
  path: keyof TFormData;
  message: string;
}

export type AddressField =
  | "city"
  | "firstName"
  | "lastName"
  | "country"
  | "countryArea"
  | "cityArea"
  | "postalCode"
  | "countryCode"
  | "companyName"
  | "streetAddress1"
  | "streetAddress2"
  | "phone";

export type ApiAddressField = AddressField | "name";
