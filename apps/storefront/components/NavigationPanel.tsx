import Link from "next/link";
import React from "react";

import { usePaths } from "../lib/paths";

export const NavigationPanel = () => {
  const paths = usePaths();

  const linkClassname =
    "flex p-4 items-center w-full rounded-md shadow-sm h-10 hover:text-blue-500";
  return (
    <div className="group w-full md:w-4/5 cursor-default rounded-md bg-white">
      <Link href={paths.account.preferences.$url()}>
        <a className="text-black">
          <span className={linkClassname}> Account Preferences</span>
        </a>
      </Link>
      <Link href={paths.account.addressBook.$url()}>
        <a className="text-black">
          <span className={linkClassname}> Address Book</span>
        </a>
      </Link>
      <Link href={paths.account.orders.$url()}>
        <a className="text-black">
          <span className={linkClassname}> Orders</span>
        </a>
      </Link>
    </div>
  );
};
