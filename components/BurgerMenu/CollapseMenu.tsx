import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

import { getLinkPath } from "@/lib/menus";
import { translate } from "@/lib/translations";
import { MenuItemWithChildrenFragment } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";
import styles from "./BurgerMenu.module.css";
import ChebronDown from "./chevronDownIcon.svg"; // in the final version it should be imported from ui-kit package

interface CollapseMenuProps {
  data: MenuItemWithChildrenFragment;
}

function SubCollapseMenu({ data }: CollapseMenuProps) {
  const [open, setOpen] = useState(false);
  const { currentChannel, currentLocale } = useRegions();

  const anchor = data.url ? (
    <a href={data.url} target="_blank" rel="noreferrer" className={styles["collapse-sub"]}>
      {translate(data, "name")}
    </a>
  ) : (
    <Link href={getLinkPath(data!, currentChannel.slug, currentLocale)} passHref>
      <a href="pass" className={styles["collapse-sub"]}>
        {translate(data, "name")}
      </a>
    </Link>
  );

  return (
    <div className="mt-4">
      {!data?.children?.length ? (
        anchor
      ) : (
        <>
          <button
            type="button"
            className={clsx(styles["collapse-sub"], {
              [styles["collapse-sub--active"]]: open,
            })}
            onClick={() => setOpen(!open)}
          >
            {translate(data, "name")}
            <ChebronDown />
          </button>
          {open && (
            <div>
              {data?.children?.map((sub) => (
                <li key={sub?.id}>
                  {sub?.url ? (
                    <a
                      href={sub.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles["menu-link"]}
                    >
                      {sub?.name}
                    </a>
                  ) : (
                    <Link href={getLinkPath(sub!, currentChannel.slug, currentLocale)} passHref>
                      <a href="pass" className={styles["menu-link"]}>
                        {sub?.name}
                      </a>
                    </Link>
                  )}
                </li>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CollapseMenu({ data }: CollapseMenuProps) {
  const [open, setOpen] = useState(false);

  const {
    currentChannel: { slug },
    currentLocale,
  } = useRegions();

  const anchor = data.url ? (
    <a href={data.url} target="_blank" rel="noreferrer" className={styles["collapse-main"]}>
      {translate(data, "name")}
    </a>
  ) : (
    <Link href={getLinkPath(data!, slug, currentLocale)} passHref>
      <a href="pass" className={styles["collapse-main"]}>
        {translate(data, "name")}
      </a>
    </Link>
  );

  return (
    <div className={styles.collpase}>
      {!data?.children?.length ? (
        anchor
      ) : (
        <>
          <button
            type="button"
            className={clsx(styles["collapse-main"], {
              [styles["collapse-main--active"]]: open,
            })}
            onClick={() => setOpen(!open)}
          >
            {translate(data, "name")}
          </button>
          {open && (
            <div>
              {data.children.map((item) => {
                if (!item) return null;
                return <SubCollapseMenu data={item} />;
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CollapseMenu;
