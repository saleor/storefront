import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import clsx from "clsx";
import { ErrorDetailsFragment } from "@/saleor/api";
import { useIntl } from "react-intl";
import messages from "./messages";

interface CartItemProps {
  thumbnail: string;
  variantId: string;
  productName: string;
  variantName: string;
  priceCurrency: string | undefined;
  priceAmount: number | undefined;
  totalPriceAmount: number;
  totalPriceCurrency: string;
  onRemove: () => void;
  changeLineState: (value: number) => void;
  onQuantityUpdate: (event: React.SyntheticEvent<HTMLInputElement>) => void;
  loadingLineUpdate: any;
  setErrors: any;
  quantity: any;
  errors: Record<string, ErrorDetailsFragment[] | null>;
}

export const getAvailableQuantity = (
  items: any[],
  variantId: string,
  variantStock: number
): number => {
  const cartItem = items?.find((item) => item.variant.id === variantId);
  const quantityInCart = cartItem?.quantity || 0;
  return variantStock - quantityInCart;
};

const CartItem: React.FC<CartItemProps> = ({
  thumbnail,
  productName,
  variantName,
  priceAmount,
  priceCurrency,
  totalPriceAmount,
  totalPriceCurrency,
  variantId,
  onRemove,
  changeLineState,
  onQuantityUpdate,
  loadingLineUpdate,
  setErrors,
  quantity,
  errors,
}) => {
  const t = useIntl();
  const quantityLimitExceededError =
    errors && errors[variantId]?.find((error) => error.code === "INSUFFICIENT_STOCK");

  const renderErrorMessage = (message: string) => (
    <div>
      <p className="text-sm text-red-500 mt-2">{message}</p>
    </div>
  );

  console.log(quantityLimitExceededError);

  return (
    <TableRow>
      <TableCell align="center">
        <div className="flex flex-row gap-6 items-center">
          <Image src={thumbnail} alt="" width="75" height="75" />
          <div className="flex flex-col items-start">
            <h4 className="mb-4 font-bold text-2xl tracking-tight max-w-[647px] md:max-w-full">
              {productName}
            </h4>
            <p className="text-base">{variantName}</p>
          </div>
        </div>
      </TableCell>
      <TableCell align="center">
        <div className="flex flex-row gap-1 justify-center">
          <p className="text-base">{priceAmount}</p>
          <p className="text-base">{priceCurrency}</p>
        </div>
      </TableCell>
      <TableCell align="center">
        <div className="flex flex-col items-center justify-center">
          <input
            type="number"
            className={clsx(
              "h-8 w-10 md:w-16 block border-gray-300 rounded-md shadow-sm text-base",
              errors && errors[variantId] && "border-red-500"
            )}
            value={quantity}
            onFocus={() => {
              setErrors(null);
            }}
            onChange={(e) => {
              changeLineState(parseFloat(e.currentTarget.value));
            }}
            onBlur={onQuantityUpdate}
            onKeyPress={onQuantityUpdate}
            min={1}
            required
            disabled={loadingLineUpdate}
            pattern="[0-9]*"
          />
          {quantityLimitExceededError && renderErrorMessage(t.formatMessage(messages.outOfStock))}
        </div>
      </TableCell>
      <TableCell align="center">
        <div className="flex flex-row gap-1 justify-center">
          <p className="text-base">{totalPriceAmount}</p>
          <p className="text-base">{totalPriceCurrency}</p>
        </div>
      </TableCell>
      <TableCell align="center">
        <button
          type="button"
          onClick={onRemove}
          className="text-md font-medium text-black hover:text-brand"
        >
          <Tooltip title="Usuń z koszyka" arrow>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </Tooltip>
        </button>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
