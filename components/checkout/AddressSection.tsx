import { AddressFragment } from "@/saleor/api";
import React, { useState } from "react";

import { Button } from "../Button";
import { AddressForm, AddressType } from "./AddressForm";

export const AddressSection = ({
  address,
  required,
  type
}: {
  address: AddressFragment | null | undefined;
  required: boolean;
  type: AddressType;
}) => {
  const [editing, setEditing] = useState(!address && required);

  return (
    <div>
      {!editing ? (
        <section>
          <p>{address?.firstName}</p>
          <p>{address?.lastName}</p>
          <p>{address?.phone}</p>
          <p>{address?.country.country}</p>
          <p>{address?.streetAddress1}</p>
          <p>{address?.city}</p>
          <p>{address?.postalCode}</p>

          <Button onClick={() => setEditing(true)}>
            Change
          </Button>
        </section>
      ) : (
        <AddressForm
          addressType={type}
          existingAddressData={address || undefined}
          toggle={() => setEditing(false)}
        />
      )}
    </div>
  );
};
