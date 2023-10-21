import { type FormikConfig, type FormikErrors, type FormikHelpers, type useFormik } from "formik";
import { type DebouncedFunc } from "lodash-es";
import { type FocusEventHandler } from "react";
import { type FormSubmitFn } from "@/checkout/hooks/useFormSubmit";

export type FormDataBase = Record<string, any>;

export type FormErrors<TData extends FormDataBase> = FormikErrors<TData>;

export type FormDataField<TData extends FormDataBase> = Extract<keyof TData, string>;

// we make these types more strict than default formik ones
export type UseFormReturn<TData extends FormDataBase> = Omit<
	ReturnType<typeof useFormik<TData>>,
	"setFieldValue" | "validateForm" | "setValues"
> & {
	// we use keyof FormData instead of plain string
	setFieldValue: <TFieldName extends FormDataField<TData>>(
		field: TFieldName,
		value: TData[TFieldName],
	) => void;
	validateForm: (values: TData) => FormErrors<TData> | Promise<FormErrors<TData>>;
	setValues: (values: Partial<TData>) => void;
};

export type FormProps<TData extends FormDataBase> = Omit<
	FormikConfig<TData>,
	"validationSchema" | "onSubmit"
> & {
	onSubmit:
		| FormSubmitFn<TData>
		| ((data: TData, helpers: FormHelpers<TData>) => Promise<void>)
		| DebouncedFunc<(data: TData, helpers: FormHelpers<TData>) => Promise<void>>;
	initialDirty?: boolean;
	// FIXME: because there seems to be something weird going on with the type
	// yup returns when schema has some uncommon typings
	validationSchema?: any; // Schema<TData> | ObjectSchema<TData>;
};

export type FormHelpers<TData extends FormDataBase> = Omit<
	FormikHelpers<TData>,
	"validateForm" | "setTouched"
> &
	Pick<UseFormReturn<TData>, "validateForm" | "setTouched">;

export type ChangeHandler<TElement = any> = (e: React.ChangeEvent<TElement>) => void;
export type BlurHandler = FocusEventHandler<HTMLSelectElement | HTMLInputElement>;
