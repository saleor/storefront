import Link from "next/link";
import React from "react";
import { useIntl } from "react-intl";

import { usePaths } from "../../lib/paths";
import { messages } from "../translations";

export const NavigationPanel = () => {
  const paths = usePaths();
  const t = useIntl();

  const linkClassname =
    "flex p-4 items-center w-full rounded-md shadow-sm h-10 hover:text-blue-500";
  return (
    <div className="group w-full md:w-4/5 cursor-default rounded-md bg-white">
      <Link href={paths.account.preferences.$url()}>
        <a className="text-black">
          <span className={linkClassname}>
            {t.formatMessage(messages.menuAccountPreferences)}
          </span>
        </a>
      </Link>
      <Link href={paths.account.addressBook.$url()}>
        <a className="text-black">
          <span className={linkClassname}>
            {t.formatMessage(messages.menuAccountAddressBook)}
          </span>
        </a>
      </Link>
      <Link href={paths.account.orders.$url()}>
        <a className="text-black">
          <span className={linkClassname}>
            {t.formatMessage(messages.menuAccountOrders)}
          </span>
        </a>
      </Link>
    </div>
  );
};
