import { FC, HTMLAttributes } from "react";

import clsx from "clsx";
import Logo from "../Logo";
import { BackIcon } from "..";

export interface CheckoutHeaderBarProps
  extends HTMLAttributes<{ storefrontName: string; destinationLink: string; backMessage: string }> {
  storefrontName: string;
  destinationLink: string;
  backMessage: string;
}

export const CheckoutHeaderBar: FC<CheckoutHeaderBarProps> = ({
  className,
  storefrontName,
  destinationLink,
  backMessage,
  ...rest
}) => {
  const classes = clsx(className);

  return (
    <div className={classes}>
      <div>
        <a href="javascript:history.back()">
          <div>
            <Logo height="120" width="150" STOREFRONT_NAME={storefrontName} />
          </div>
          <div
            style={{
              padding: "5px",
              border: "1px",
              borderStyle: "solid",
              borderRadius: "20px",
              textAlign: "center",
              borderColor: "rgb(185,193,207)",
              display: "flex",
              lineHeight: "2em",
            }}
          >
            <BackIcon /> {backMessage}
          </div>
        </a>
      </div>
    </div>
  );
};
