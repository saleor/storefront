/* eslint-disable @next/next/link-passhref */
import React from "react";
import classNames from "classnames";
import Link from "next/link";
interface NavigationPanelProps {
  active: string;
}
export const NavigationPanel: React.VFC<NavigationPanelProps> = ({
  active,
}) => {
  return (
    <div className="group w-4/5 cursor-default rounded-md bg-white">
      <Link href="/account/accountPreferences">
        <span
          className={classNames(
            "flex p-4 items-center w-full rounded-md shadow-sm h-10 hover:text-blue-500",
            active === "AccountPreferences" && "font-semibold text-blue-600"
          )}
        >
          Account Preferences
        </span>
      </Link>
      <Link href="/account/addressBook">
        <span
          className={classNames(
            "flex p-4 items-center w-full rounded-md shadow-sm h-10 hover:text-blue-500",
            active === "AddressBook" && "font-semibold text-blue-600 "
          )}
        >
          {" "}
          Address Book
        </span>
      </Link>
      <Link href="/account/orders">
        <span
          className={classNames(
            "flex p-4 items-center w-full rounded-md shadow-sm h-10 hover:text-blue-500",
            active === "Orders" && "font-semibold text-blue-600"
          )}
        >
          {" "}
          Orders
        </span>
      </Link>
    </div>
  );
};
