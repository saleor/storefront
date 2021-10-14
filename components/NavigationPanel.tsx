import React from "react";
import Link from "next/link";

export const NavigationPanel: React.VFC = () => {
  const linkClassname =
    "flex p-4 items-center w-full rounded-md shadow-sm h-10 hover:text-blue-500";
  return (
    <div className="group w-4/5 cursor-default rounded-md bg-white">
      <Link href="/account/preferences">
        <a className="text-black">
          <span className={linkClassname}> Account Preferences</span>
        </a>
      </Link>
      <Link href="/account/addressBook">
        <a className="text-black">
          <span className={linkClassname}> Address Book</span>
        </a>
      </Link>
      <Link href="/account/orders">
        <a className="text-black">
          <span className={linkClassname}> Orders</span>
        </a>
      </Link>
    </div>
  );
};
