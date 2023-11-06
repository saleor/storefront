import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { useLogout } from "@/lib/hooks/useLogout";
import { usePaths } from "@/lib/paths";

import NavIconButton from "../Navbar/NavIconButton";
import { ChannelDropdown } from "../regionDropdowns/ChannelDropdown";
import { LocaleDropdown } from "../regionDropdowns/LocaleDropdown";
import { messages } from "../translations";
import styles from "./BurgerMenu.module.css";
import { CollapseMenu } from "./CollapseMenu";
import { useUser } from "@/lib/useUser";
import { useVisibleMenuItems } from "@/lib/hooks/useVisibleMenuItems";

export interface BurgerMenuProps {
  open?: boolean;
  onCloseClick?: () => void;
}

export function BurgerMenu({ open, onCloseClick }: BurgerMenuProps) {
  const paths = usePaths();
  const { visibleMenuItems } = useVisibleMenuItems();
  const t = useIntl();

  const [authenticated, setAuthenticated] = useState(false);
  const { authenticated: actuallyAuthenticated } = useUser();
  const router = useRouter();

  // Avoid hydration warning by setting authenticated state in useEffect
  useEffect(() => {
    setAuthenticated(actuallyAuthenticated);
  }, [actuallyAuthenticated]);

  const onLogout = useLogout();

  return (
    <div
      className={clsx(styles.container, {
        [styles["container--open"]]: open,
      })}
    >
      <div className={styles.backdrop} aria-hidden="true" onClick={onCloseClick} />
      <div className={styles.body}>
        <div className="flex justify-end w-full mb-5">
          <NavIconButton icon="close" onClick={onCloseClick} />
        </div>
        {visibleMenuItems?.map((item) => (
          <CollapseMenu menuItem={item} key={item.id} />
        ))}
        <div className="mt-auto pt-4">
          <div className="flex flex-col">
            {authenticated ? (
              <>
                <Link href={paths.account.preferences.$url()} passHref legacyBehavior>
                  <a tabIndex={0} className={styles["burger-link"]} href="pass">
                    {t.formatMessage(messages.menuAccountPreferences)}
                  </a>
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  tabIndex={-1}
                  className={styles["burger-link"]}
                >
                  {t.formatMessage(messages.logOut)}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => router.push(paths.account.login.$url())}
                tabIndex={-1}
                className={styles["burger-link"]}
              >
                {t.formatMessage(messages.logIn)}
              </button>
            )}
          </div>
        </div>
        <div className="flex mt-4 gap-4">
          <ChannelDropdown />
          <LocaleDropdown />
        </div>
      </div>
    </div>
  );
}

export default BurgerMenu;
