import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { AriaTextFieldOptions, useTextField } from "@react-aria/textfield";

interface TextInputProps extends AriaTextFieldOptions<"input"> {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  label: string;
  optional?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export const TextInput: React.FC<TextInputProps> = (props) => {
  const {
    label,
    optional = false,
    error,
    errorMessage,
    value,
    onChange,
    ...rest
  } = props;

  const [labelFixed, setLabelFixed] = useState(false);

  useEffect(() => {
    if (!labelFixed && value) {
      setLabelFixed(true);
    }
  }, [value]);

  const ref = React.useRef<HTMLInputElement | null>(null);

  const { labelProps, inputProps, errorMessageProps } = useTextField(rest, ref);

  const inputClasses = clsx("text-input", {
    "text-input-error": error,
  });

  const labelClasses = clsx("text-input-label", {
    "text-input-filled-label": labelFixed,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelFixed(!!event.target.value);
    onChange(event);
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        {...inputProps}
        className={inputClasses}
        value={value}
        onChange={handleChange}
      />
      <label {...labelProps} className={labelClasses}>
        {optional ? label : `${label}*`}
      </label>
      {error && (
        <span className="text-xs text-text-error" {...errorMessageProps}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};
