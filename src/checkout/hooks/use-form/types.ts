/**
 * Base type for form data.
 * Used by useSubmit and other hooks.
 */
export type FormDataBase = Record<string, any>;

/**
 * Form errors mapping field names to error messages.
 */
export type FormErrors<TData extends FormDataBase> = Partial<Record<keyof TData, string>>;

/**
 * Helper to check if form has errors.
 */
export const hasErrors = <TData extends FormDataBase>(errors: FormErrors<TData>): boolean => {
	return Object.keys(errors).length > 0;
};
