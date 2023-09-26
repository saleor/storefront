import { type ChangeHandler } from "@/checkout/src/hooks/useForm";
import { useField } from "@/checkout/src/hooks/useForm/useField";
import { TextInput as UiKitTextInput , type TextInputProps as UiKitTextInputProps } from "@/checkout/ui-kit";
import { type AllHTMLAttributes } from "react";

export interface TextInputProps<TName extends string>
  extends Omit<AllHTMLAttributes<HTMLInputElement>, "form">,
    Pick<UiKitTextInputProps, "classNames"> {
  name: TName;
  label: string;
  optional?: boolean;
  onChange?: ChangeHandler<HTMLInputElement>;
}

export const TextInput = <TName extends string>({
  optional,
  name,
  ...props
}: TextInputProps<TName>) => {
  const fieldProps = useField(name);

  return <UiKitTextInput required={!optional} {...fieldProps} {...props} />;
};
