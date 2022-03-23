import clsx from "clsx";
import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useEffect,
  useState,
} from "react";
import { AriaTextFieldOptions, useTextField } from "@react-aria/textfield";
import { Classes } from "@lib/globalTypes";
import {
  Control,
  FieldPath,
  FormState,
  UseFormRegisterReturn,
  useWatch,
} from "react-hook-form";
import { ControlFormData } from "@hooks/useGetInputProps";

export interface TextInputProps<
  TControl extends Control<any, any>,
  TFormData extends ControlFormData<TControl>
> extends Omit<
      AriaTextFieldOptions<"input">,
      "onBlur" | "onChange" | "name" | "ref"
    >,
    Pick<FormState<TFormData>, "errors">,
    Omit<UseFormRegisterReturn, "ref">,
    Classes {
  control: TControl;
  name: FieldPath<TFormData>;
  label: string;
  optional?: boolean;
  icon?: React.ReactNode;
}

const TextInputComponent = <
  TControl extends Control<any, any>,
  TFormData extends ControlFormData<TControl>
>(
  props: TextInputProps<TControl, TFormData>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const {
    label,
    optional = false,
    errors,
    className,
    onChange,
    onBlur,
    name,
    control,
    icon,
    ...rest
  } = props;

  const [labelFixed, setLabelFixed] = useState(false);

  const error = errors[name as keyof typeof errors];

  const value = useWatch({
    control,
    name,
  });

  useEffect(() => {
    if (!labelFixed && value) {
      setLabelFixed(true);
    }
  }, [value, labelFixed]);

  const { labelProps, inputProps, errorMessageProps } = useTextField(
    rest,
    ref as RefObject<HTMLInputElement>
  );

  const inputClasses = clsx("text-input", {
    "text-input-error": !!error,
  });

  const labelClasses = clsx("text-input-label", {
    "text-input-filled-label": labelFixed,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelFixed(!!event.target.value);
    onChange(event);
  };

  return (
    <div className={clsx("text-input-container", className)}>
      <input
        {...inputProps}
        name={name}
        ref={ref}
        className={inputClasses}
        onBlur={onBlur}
        onChange={handleChange}
        aria-label={name}
      />
      <label {...labelProps} htmlFor={inputProps.id} className={labelClasses}>
        {optional ? label : `${label}*`}
      </label>
      {error && (
        <span className="text-xs text-text-error" {...errorMessageProps}>
          {/* react-hook-form has this typed badly */}
          {(error as any).message}
        </span>
      )}
      {icon && <div className="icon">{icon}</div>}
    </div>
  );
};

export const TextInput = forwardRef(TextInputComponent) as <
  TControl extends Control<any, any>,
  TFormData extends ControlFormData<TControl>
>(
  props: TextInputProps<TControl, TFormData> & {
    ref?: ForwardedRef<HTMLInputElement>;
  }
) => ReturnType<typeof TextInputComponent>;
