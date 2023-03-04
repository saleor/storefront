import { FormErrors } from "@/checkout-storefront/hooks/useForm/types";

export const hasErrors = (formErrors: FormErrors<any>) => !!Object.keys(formErrors).length;
