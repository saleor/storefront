import { useApolloClient } from "@apollo/client";
import { useAuth } from "@saleor/sdk";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes } from "react";
import { useIntl } from "react-intl";

import { usePaths } from "@/lib/paths";
import { useCheckout } from "@/lib/providers/CheckoutProvider";

import { messages } from "../translations";
import styles from "./Navbar.module.css";
import NavIconButton from "./NavIconButton";

type UserMenuProps = Pick<HTMLAttributes<HTMLDivElement>, "className">;

function UserMenu({ className, ...rest }: UserMenuProps) {
  const paths = usePaths();
  const t = useIntl();
  const { logout } = useAuth();
  const { resetCheckoutToken } = useCheckout();
  const router = useRouter();
  const client = useApolloClient();

  const onLogout = async () => {
    // clear all the user data on logout
    await logout();
    await resetCheckoutToken();
    await client.resetStore();
    router.push(paths.$url());
  };

  return (
    <div className={clsx(styles["user-menu-container"], className)} {...rest}>
      <NavIconButton icon="user" aria-hidden="true" />
      <div className={styles["user-menu"]}>
        <Link href={paths.account.preferences.$url()} passHref>
          <a tabIndex={0} className={styles["user-menu-item"]} href="pass">
            {t.formatMessage(messages.menuAccountPreferences)}
          </a>
        </Link>
        <button type="button" onClick={onLogout} tabIndex={-1} className={styles["user-menu-item"]}>
          {t.formatMessage(messages.logOut)}
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
