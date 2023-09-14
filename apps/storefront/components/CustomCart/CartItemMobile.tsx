import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import clsx from "clsx";
import { useIntl } from "react-intl";
import messages from "./messages";
import { CartItemProps } from "./CartItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

const CartItemMobile: React.FC<CartItemProps> = ({
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
      <p className="text-sm text-red-500">{message}</p>
    </div>
  );

  return (
    <>
      <TableRow sx={{ "& td": { border: 0 } }}>
        <TableCell
          align="center"
          colSpan={5}
          sx={{
            padding: "16px 0",
          }}
        >
          <div className="flex flex-row gap-3 items-center">
            <Image src={thumbnail} alt="" width="75" height="75" />
            <div className="flex flex-col items-start gap-2">
              <h4 className="text-left font-bold text-2xl tracking-tight max-w-[647px] md:max-w-full">
                {productName}
              </h4>
              <p className="text-base text-gray-400 mt-0">SKU: {variantName}</p>
            </div>
          </div>
        </TableCell>
      </TableRow>
      <TableRow sx={{ "& td": { border: 0, alignItems: "center" } }}>
        <TableCell
          align="center"
          sx={{
            padding: "16px 0",
          }}
        >
          <button
            type="button"
            onClick={onRemove}
            className="text-black hover:text-white group text-md font-medium hover:bg-black hover:rounded-full p-2 transition-all duration-300"
          >
            <Tooltip title="Usuń z koszyka" arrow>
              <svg height="22" viewBox="0 0 32 32" width="22" className="fill-current">
                <path
                  d="M28.496 5.327h-6.236v-1.017c0-1.818-1.479-3.297-3.297-3.297h-5.928c-1.818 0-3.297 1.479-3.297 3.297v1.017h-6.236c-0.462 0-0.832 0.37-0.832 0.832s0.37 0.832 0.832 0.832h1.504v19.546c0 2.452 1.996 4.449 4.449 4.449h13.088c2.452 0 4.449-1.997 4.449-4.449v-19.546h1.504c0.462 0 0.832-0.37 0.832-0.832s-0.37-0.832-0.832-0.832zM11.403 4.311c0-0.9 0.733-1.633 1.633-1.633h5.928c0.9 0 1.633 0.733 1.633 1.633v1.017h-9.194v-1.017zM25.329 26.537c0 1.534-1.251 2.785-2.785 2.785h-13.088c-1.534 0-2.785-1.251-2.785-2.785v-19.546h18.665v19.546h-0.006z M16 26.341c0.462 0 0.832-0.37 0.832-0.832v-14.702c0-0.462-0.37-0.832-0.832-0.832s-0.832 0.37-0.832 0.832v14.696c0 0.462 0.37 0.838 0.832 0.838z M10.571 25.423c0.462 0 0.832-0.37 0.832-0.832v-12.872c0-0.462-0.37-0.832-0.832-0.832s-0.832 0.37-0.832 0.832v12.872c0 0.462 0.376 0.832 0.832 0.832z M21.428 25.423c0.462 0 0.832-0.37 0.832-0.832v-12.872c0-0.462-0.37-0.832-0.832-0.832s-0.832 0.37-0.832 0.832v12.872c0 0.462 0.37 0.832 0.832 0.832z"
                  fill="currentColor"
                ></path>
              </svg>
            </Tooltip>
          </button>
        </TableCell>
        <TableCell
          align="center"
          sx={{
            padding: "16px 0",
          }}
        >
          <div className="flex flex-col gap-1 justify-center">
            <p className="text-base text-gray-500">Cena:</p>
            <div className="flex flex-row gap-1 justify-center">
              <p className="text-md">{priceAmount}</p>
              <p className="text-md">{priceCurrency}</p>
            </div>
          </div>
        </TableCell>
        <TableCell
          align="center"
          sx={{
            padding: "16px 0",
          }}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-base text-gray-500 text-right">Ilość:</p>
            <div>
              <div className="flex items-center border border-gray-200">
                <input
                  type="number"
                  className={clsx(
                    "h-8 w-32 border text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none",
                    quantityLimitExceededError ? "border-red-500" : "border-gray-100"
                  )}
                  value={quantity}
                  onFocus={() => {
                    setErrors({});
                  }}
                  onChange={(e) => {
                    changeLineState(parseFloat(e.currentTarget.value));
                  }}
                  onBlur={onQuantityUpdate}
                  min={1}
                  required
                  disabled={loadingLineUpdate}
                  pattern="[0-9]*"
                />
              </div>
            </div>
            {quantityLimitExceededError && renderErrorMessage(t.formatMessage(messages.outOfStock))}
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={5}
          align="right"
          sx={{
            padding: "16px 0",
            width: "100%",
          }}
        >
          <div className="flex flex-col gap-1 justify-center">
            <p className="text-base text-gray-500 text-right">Kwota całkowita:</p>
            <div className="flex flex-row gap-1 justify-end">
              <p className="text-md">{totalPriceAmount}</p>
              <p className="text-md">{totalPriceCurrency}</p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CartItemMobile;
