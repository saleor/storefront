import { FC } from "react";

import Logo from "../Logo";
import { BackIcon } from "..";

export interface CheckoutHeaderBarProps {
  storefrontName: string;
  destinationLink: () => void;
  backMessage: string;
}

export const CheckoutHeaderBar: FC<CheckoutHeaderBarProps> = ({
  storefrontName,
  destinationLink,
  backMessage,
}) => {
  return (
    <div>
      <div>
        <button type="button" onClick={destinationLink} className="cursor-pointer">
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
        </button>
      </div>
    </div>
  );
};
