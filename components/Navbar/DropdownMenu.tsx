import Link from "next/link";

import { translate } from "@/lib/translations";
import { MenuItemWithChildrenFragment } from "@/saleor/api";

import styles from "./Navbar.module.css";

interface DropdwonProps {
  data: MenuItemWithChildrenFragment;
}

// need to be developed after design of this element will be delivered
function Dropdwon({ data }: DropdwonProps) {
  return (
    <div className={styles.dropdown}>
      <Link href="/" passHref>
        <a href="pass" className={styles["dropdown-trigger"]}>
          {translate(data, "name")}
        </a>
      </Link>
      <div className={styles["dropdown-menu"]}>
        <div className="container grid grid-cols-[auto_55%]">
          <div className="grid grid-cols-3 gap-[2rem]">
            {data.children?.map((item) => (
              <div key={item?.id}>
                {/* <Link href={"#"} passHref> */}
                <a
                  href="pass"
                  className="inline-block text-[1.8rem] leading-[2.16rem] font-bold cursor-pointer hover:underline"
                >
                  {item?.name}
                </a>
                {/* </Link> */}
                <ul className={styles["dropdown-ul"]}>
                  {item?.children?.map((sub) => (
                    <li key={sub?.id}>
                      {/* <Link href={"#"} passHref> */}
                      <a href="pass" className={styles["dropdown-link"]}>
                        {sub?.name}
                      </a>
                      {/* </Link> */}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}

export default Dropdwon;
