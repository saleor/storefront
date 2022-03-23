export interface Classes {
  className?: string;
}

export type ValidationErrorType = "invalid" | "missing";

export interface ValidationError<TFormData> {
  type: ValidationErrorType;
  path: keyof TFormData;
  message: string;
}
