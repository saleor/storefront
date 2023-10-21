import { useFormik, useFormikContext } from "formik";
import { type FormDataBase, type FormProps, type UseFormReturn } from "@/checkout/hooks/useForm/types";

export const useForm = <TData extends FormDataBase>(formProps: FormProps<TData>): UseFormReturn<TData> => {
	// @ts-expect-error because the props we pass and overwrite here don't
	// always match what formik wants like e.g validateForm
	return useFormik<TData>(formProps);
};

export const useFormContext = useFormikContext;
