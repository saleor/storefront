export interface Classes {
  className?: string;
}

export type ValidationErrorType = "invalid" | "missing";

export interface ValidationError<TFormData> {
  type: ValidationErrorType;
  path: keyof TFormData;
  message: string;
}

export type AddressField =
  | "city"
  | "name"
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
