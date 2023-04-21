import { ChangeHandler } from "@/checkout-storefront/hooks/useForm";
import { useField } from "@/checkout-storefront/hooks/useForm/useField";
import { TextInput as UiKitTextInput } from "@saleor/ui-kit";
import { TextInputProps as UiKitTextInputProps } from "@saleor/ui-kit";
import { AllHTMLAttributes } from "react";

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
