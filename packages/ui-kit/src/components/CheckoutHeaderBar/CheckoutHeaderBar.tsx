import { FC } from "react";

import Logo from "../Logo";
import { BackIcon } from "..";

export interface CheckoutHeaderBarProps {
  storefrontChannel: string;
  destinationLink: () => void;
  backMessage: string;
}

export const CheckoutHeaderBar: FC<CheckoutHeaderBarProps> = ({
  storefrontChannel,
  destinationLink,
  backMessage,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "32px",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Logo height="60" width="120" storefrontChannel={storefrontChannel} />
      <button
        type="button"
        onClick={destinationLink}
        className="cursor-pointer"
        style={{
          border: "1px",
          borderStyle: "solid",
          borderRadius: "20px",
          borderColor: "rgb(185,193,207)",
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
          padding: "6px 14px",
          alignItems: "center",
        }}
      >
        <BackIcon /> {backMessage}
      </button>
    </div>
  );
};
