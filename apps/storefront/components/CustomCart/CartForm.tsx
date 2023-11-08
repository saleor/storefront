import { useCheckoutLineUpdateMutation } from "@/saleor/api";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { z } from "zod";
import { useRegions } from "../RegionsProvider";
import { useIntl } from "react-intl";
import messages from "./messages";
import { useCheckout } from "@/lib/providers/CheckoutProvider";

const schema = z.object({
  quantity: z.string(),
});
type Schema = z.infer<typeof schema>;

interface CartFromProps {
  quantity?: string;
  variantId?: string;
}

export function CartForm({ quantity, variantId }: CartFromProps) {
  const t = useIntl();
  const {
    query: { locale },
  } = useRegions();
  const { checkout } = useCheckout();
  const [checkoutLineUpdateMutation, { loading: isLineUpdateLoading }] =
    useCheckoutLineUpdateMutation();

  const { handleSubmit, control, setError } = useForm<Schema>({
    defaultValues: { quantity: quantity },
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Schema> = async ({ quantity }) => {
    const { data } = await checkoutLineUpdateMutation({
      variables: {
        token: checkout?.token,
        lines: [
          {
            quantity: +quantity,
            variantId,
          },
        ],
        locale: locale,
      },
    });

    if (data?.checkoutLinesUpdate?.errors?.length) {
      setError("quantity", { message: t.formatMessage(messages.outOfStock) });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="relative w-min mx-auto">
      <Controller
        control={control}
        name="quantity"
        render={({ field: { onChange, onBlur: _onBlur, ...field }, fieldState: { error } }) => (
          <>
            <IMaskInput
              className={clsx(
                "h-10 w-32 border border-gray-300 text-center text-sm outline-none rounded-md",
                {
                  "border-red-500 text-red-500": error,
                  "focus:border-green-500": !error,
                }
              )}
              mask="#0000"
              definitions={{
                "#": /[1-9]/,
              }}
              onChange={({ currentTarget }) => currentTarget.value && onChange(currentTarget.value)}
              onBlur={handleSubmit(onSubmit)}
              required
              disabled={isLineUpdateLoading}
              {...field}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                {error.message}
              </p>
            )}
          </>
        )}
      />
    </form>
  );
}
