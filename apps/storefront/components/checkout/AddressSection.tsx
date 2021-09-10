import { AddressFragment } from "@/saleor/api";
import React, { useState } from "react";

import { Button } from "../Button";
import { AddressForm, AddressType } from "./AddressForm";

export const AddressSection = ({
  address,
  type,
  required = false,
}: {
  address: AddressFragment | null | undefined;
  type: AddressType;
  required?: boolean;
}) => {
  const [editing, setEditing] = useState(!address && required);

  return (
    <div>
      {!editing ? (
        <section className="flex justify-between items-center mb-4">
          <div>
            <address className="not-italic mb-2">
              <p>{address?.firstName} {address?.lastName}</p>
              <p>{address?.streetAddress1}</p>
              <p>{address?.postalCode} {address?.city}, {address?.country.country}</p>
            </address>
            <div>{address?.phone}</div>
          </div>

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
