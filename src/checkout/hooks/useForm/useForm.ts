/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useFormik, useFormikContext } from "formik";
import { type ValidationError } from "yup";
import { type FormDataBase, type FormProps, type UseFormReturn } from "@/checkout/hooks/useForm/types";

export const useForm = <TData extends FormDataBase>(formProps: FormProps<TData>) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { validationSchema } = formProps;
	// @ts-expect-error because the props we pass and overwrite here don't
	// always match what formik wants like e.g validateForm
	const form = useFormik<TData>(formProps);

	const { setErrors: setFormikErrors } = form;

	const validateForm = (values: TData) => {
		if (!validationSchema) {
			return {};
		}

		try {
			//  formik also has this types to "any"
			// will be fixed along with adding proper type to schema
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			validationSchema.validateSync(values, { abortEarly: false });
			return {};
		} catch (e) {
			const errors: ValidationError = { ...(e as ValidationError) };

			if (!errors?.inner) {
				return {};
			}

			const parsedErrors = errors.inner.reduce(
				(result, { path, message }) => (path ? { ...result, [path]: message } : result),
				{},
			);
			setFormikErrors(parsedErrors);
			return parsedErrors;
		}
	};

	return {
		...form,
		validateForm,
	} as unknown as UseFormReturn<TData>;
};

export const useFormContext = useFormikContext;
