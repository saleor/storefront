import React, { useState } from "react";

interface ChildrenProps {
  displayAddressList: boolean;
  displayAddressEdit: boolean;
  displayAddressCreate: boolean;
  setDisplayAddressCreate: (display: boolean) => void;
  setDisplayAddressEdit: (id?: string) => void;
  editedAddressId: string | undefined;
}

interface UserAddressSectionProps {
  children: (props: ChildrenProps) => React.ReactElement;
}

export const UserAddressSectionContainer = ({ children }: UserAddressSectionProps) => {
  const [displayAddressCreate, setDisplayAddressCreate] = useState(false);

  const [editedAddressId, setDisplayAddressEdit] = useState<string | undefined>();

  const displayAddressEdit = !!editedAddressId;

  const displayAddressList = !displayAddressEdit && !displayAddressCreate;

  const childrenProps = {
    displayAddressList,
    displayAddressEdit,
    displayAddressCreate,
    setDisplayAddressCreate,
    setDisplayAddressEdit,
    editedAddressId,
  };

  return children(childrenProps);
};
