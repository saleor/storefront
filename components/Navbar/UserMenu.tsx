import clsx from "clsx";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { useIntl } from "react-intl";

import { useLogout } from "@/lib/auth";
import { usePaths } from "@/lib/paths";

import { messages } from "../translations";
import styles from "./Navbar.module.css";
import NavIconButton from "./NavIconButton";

type UserMenuProps = Pick<HTMLAttributes<HTMLDivElement>, "className">;

function UserMenu({ className, ...rest }: UserMenuProps) {
  const paths = usePaths();
  const t = useIntl();

  const onLogout = useLogout();

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
