import IconButton from "@components/IconButton";
import React from "react";
import { CloseIcon as DeleteIcon } from "@icons";
import { CheckoutLine, useCheckoutLineDeleteMutation } from "@graphql";

interface LineItemDeleteProps {
  line: CheckoutLine;
}

export const SummaryItemDelete: React.FC<LineItemDeleteProps> = ({
  line: { id: lineId },
}) => {
  const [{ fetching }, deleteLine] = useCheckoutLineDeleteMutation();

  const handleLineDelete = () => {};
  // TMP for development
  // deleteLine({
  //   token: "f683e21b-7171-460d-96bf-50557b2fb5de",
  //   lineId,
  // });

  return (
    <div className="delete-row-button">
      <IconButton onPress={handleLineDelete} aria-label="delete item">
        <img src={DeleteIcon} alt="delete icon" />
      </IconButton>
    </div>
  );
};
