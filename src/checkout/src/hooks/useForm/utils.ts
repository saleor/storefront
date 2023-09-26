import { type FormErrors } from "@/checkout/src/hooks/useForm/types";

export const hasErrors = (formErrors: FormErrors<any>) => !!Object.keys(formErrors).length;
