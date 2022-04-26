import Link from "next/link";

import { getLinkPath } from "@/lib/menus";
import { translate } from "@/lib/translations";
import { MenuItemWithChildrenFragment } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";
import styles from "./Navbar.module.css";

interface DropdwonProps {
  data: MenuItemWithChildrenFragment;
}

function Dropdwon({ data }: DropdwonProps) {
  const {
    currentChannel: { slug },
    currentLocale,
  } = useRegions();

  return (
    <div className={styles.dropdown}>
      <Link href="/" passHref>
        <a href="pass" className={styles["dropdown-trigger"]}>
          {translate(data, "name")}
        </a>
      </Link>
      {!!data.children?.length && (
        <div className={styles["dropdown-menu"]}>
          {/* <div className="container grid grid-cols-[auto_55%]"> */}
          <div className="container">
            <div className="grid grid-cols-7 gap-[2rem]">
              {data.children?.map((item) => (
                <div key={item?.id}>
                  <Link href={getLinkPath(item!, slug, currentLocale)} passHref>
                    <a
                      href="pass"
                      className="inline-block text-[1.8rem] leading-[2.16rem] font-bold cursor-pointer hover:underline"
                    >
                      {item?.name}
                    </a>
                  </Link>
                  {!!item?.children?.length && (
                    <ul className={styles["dropdown-ul"]}>
                      {item?.children?.map((sub) => (
                        <li key={sub?.id}>
                          <Link href={getLinkPath(sub!, slug, currentLocale)} passHref>
                            <a href="pass" className={styles["dropdown-link"]}>
                              {sub?.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            {/* <div /> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdwon;
