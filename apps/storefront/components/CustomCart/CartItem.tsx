import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import clsx from "clsx";
import {
  CheckoutLineDetailsFragment,
  useCheckoutLineUpdateMutation,
  useRemoveProductFromCheckoutMutation,
} from "@/saleor/api";
import { useIntl } from "react-intl";
import messages from "./messages";
import { IMaskInput } from "react-imask";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { useRegions } from "../RegionsProvider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, SubmitHandler } from "react-hook-form";

const schema = z.object({
  quantity: z.string(),
});
type Schema = z.infer<typeof schema>;

export interface CartItemProps {
  line: CheckoutLineDetailsFragment;
}

const CartItem = ({ line }: CartItemProps) => {
  const t = useIntl();
  const { checkout } = useCheckout();
  const {
    query: { locale },
    formatPrice,
  } = useRegions();
  const [removeProductFromCheckout, { loading: isRemoveProductLoading }] =
    useRemoveProductFromCheckoutMutation();
  const [checkoutLineUpdateMutation, { loading: isLineUpdateLoading }] =
    useCheckoutLineUpdateMutation();

  const { handleSubmit, control, setError } = useForm<Schema>({
    defaultValues: { quantity: line.quantity.toString() },
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
            variantId: line.variant.id,
          },
        ],
        locale: locale,
      },
    });

    if (data?.checkoutLinesUpdate?.errors?.length) {
      setError("quantity", { message: t.formatMessage(messages.outOfStock) });
    }
  };

  const handleProductRemove = async () => {
    if (!checkout?.token) {
      return;
    }

    await removeProductFromCheckout({
      variables: {
        checkoutToken: checkout?.token,
        lineId: line.id,
        locale: locale,
      },
    });
  };

  return (
    <TableRow
      sx={{
        display: { xs: "none", sm: "none", md: "table-row" },
      }}
    >
      <TableCell align="center">
        <div className="flex flex-row gap-6 items-center">
          {line.variant.product.thumbnail?.url && (
            <Image
              src={line.variant.product.thumbnail?.url}
              alt=""
              width="75"
              height="75"
              unoptimized={true}
            />
          )}
          <div className="flex flex-col items-start">
            <h4 className="mb-4 font-bold text-2xl tracking-tight max-w-[647px] md:max-w-full">
              {line.variant.product.name}
            </h4>
            <p className="text-base text-gray-500">SKU: {line.variant.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell align="center">
        <div className="flex flex-row gap-1 justify-center">
          <p className="text-base">{formatPrice(line.variant?.pricing?.price?.gross)}</p>
        </div>
      </TableCell>
      <TableCell align="center">
        <div className="flex flex-col items-center justify-center">
          <div>
            <div className="flex items-center border border-gray-200 relative">
              <form>
                <Controller
                  control={control}
                  name="quantity"
                  render={({
                    field: { onChange, onBlur: _onBlur, ...field },
                    fieldState: { error },
                  }) => (
                    <>
                      <IMaskInput
                        className={clsx("h-10 w-32 border rounded-md text-center text-sm", {
                          "border-red-500": error,
                          "border-gray-100": !error,
                        })}
                        mask="#0000"
                        definitions={{
                          "#": /[1-9]/,
                        }}
                        onChange={(e) => {
                          e.currentTarget.value && onChange(e.currentTarget.value);
                        }}
                        onBlur={handleSubmit(onSubmit)}
                        required
                        disabled={isLineUpdateLoading}
                        {...field}
                      />
                      {error && (
                        <p className="text-sm text-red-500 mt-1 absolute">{error.message}</p>
                      )}
                    </>
                  )}
                />
              </form>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell align="center">
        <div className="flex flex-row gap-1 justify-center">
          <p className="text-base">{formatPrice(line?.totalPrice.gross)}</p>
        </div>
      </TableCell>
      <TableCell align="center">
        <button disabled={isRemoveProductLoading} type="button" onClick={handleProductRemove}>
          <Tooltip
            title={<p className="text-xs">Usuń z koszyka</p>}
            arrow
            enterDelay={300}
            className="hover:fill-red-600"
          >
            <svg height="22" viewBox="0 0 32 32" width="22">
              <path d="M28.496 5.327h-6.236v-1.017c0-1.818-1.479-3.297-3.297-3.297h-5.928c-1.818 0-3.297 1.479-3.297 3.297v1.017h-6.236c-0.462 0-0.832 0.37-0.832 0.832s0.37 0.832 0.832 0.832h1.504v19.546c0 2.452 1.996 4.449 4.449 4.449h13.088c2.452 0 4.449-1.997 4.449-4.449v-19.546h1.504c0.462 0 0.832-0.37 0.832-0.832s-0.37-0.832-0.832-0.832zM11.403 4.311c0-0.9 0.733-1.633 1.633-1.633h5.928c0.9 0 1.633 0.733 1.633 1.633v1.017h-9.194v-1.017zM25.329 26.537c0 1.534-1.251 2.785-2.785 2.785h-13.088c-1.534 0-2.785-1.251-2.785-2.785v-19.546h18.665v19.546h-0.006z M16 26.341c0.462 0 0.832-0.37 0.832-0.832v-14.702c0-0.462-0.37-0.832-0.832-0.832s-0.832 0.37-0.832 0.832v14.696c0 0.462 0.37 0.838 0.832 0.838z M10.571 25.423c0.462 0 0.832-0.37 0.832-0.832v-12.872c0-0.462-0.37-0.832-0.832-0.832s-0.832 0.37-0.832 0.832v12.872c0 0.462 0.376 0.832 0.832 0.832z M21.428 25.423c0.462 0 0.832-0.37 0.832-0.832v-12.872c0-0.462-0.37-0.832-0.832-0.832s-0.832 0.37-0.832 0.832v12.872c0 0.462 0.37 0.832 0.832 0.832z" />
            </svg>
          </Tooltip>
        </button>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
