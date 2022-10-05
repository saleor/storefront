import {
  Control,
  RegisterOptions,
  UseFormReturn,
  FieldPath,
  UseFormRegisterReturn,
  FieldErrors,
} from "react-hook-form";

export type ControlFormData<FormControl> = FormControl extends Control<infer FormData>
  ? FormData
  : never;

export type FormInputProps<
  TControl extends Control<any, any>,
  TData extends ControlFormData<TControl>
> = UseFormRegisterReturn & {
  name: FieldPath<TData>;
  errors: FieldErrors<TData>;
  control: Control<TData>;
};

export type GetInputProps = <
  TControl extends Control<any, any>,
  TData extends ControlFormData<TControl>,
  TName extends FieldPath<TData> = FieldPath<TData>
>(
  name: TName,
  options?: RegisterOptions<TData, TName>
) => FormInputProps<TControl, TData>;

type UseGetInputProps<
  TControl extends Control<any, any>,
  TData extends ControlFormData<TControl>
> = Pick<UseFormReturn<TData>, "formState" | "register"> & {
  control: TControl;
};

export const useGetInputProps = <
  TControl extends Control<any, any>,
  TData extends ControlFormData<TControl>
>(
  { register, control, formState: { errors, touchedFields } }: UseGetInputProps<TControl, TData>,
  defaultOptions?: RegisterOptions<TData, any>
) => {
  const getInputProps = <TName extends FieldPath<TData> = FieldPath<TData>>(
    name: TName,
    options?: RegisterOptions<TData, TName>
  ) => ({
    ...register(name, { ...defaultOptions, ...options }),
    name,
    errors,
    control,
    touchedFields,
  });

  return getInputProps;
};
