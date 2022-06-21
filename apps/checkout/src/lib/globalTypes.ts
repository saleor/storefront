export interface Classes {
  className?: string;
}

export interface AriaLabel {
  ariaLabel: string;
}

export type ValidationErrorCode =
  | "invalid"
  | "required"
  | PasswordValidationErrorCode;

export type PasswordValidationErrorCode =
  | "passwordTooShort"
  | "passwordTooSimilar"
  | "passwordTooCommon"
  | "passwordInvalid";

export interface ValidationError<TFormData> {
  type: ValidationErrorCode;
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
