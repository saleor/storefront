export interface Classes {
  className?: string;
}

export type ValidationErrorCode = "invalid" | "required";

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
