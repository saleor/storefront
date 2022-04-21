import Link, { LinkProps } from "next/link";

import ChevronDownIcon from "./chevronDownIcon.svg";
import styles from "./Navbar.module.css";

interface DropdownMenuProps {
  main: {
    label: string;
    url: LinkProps["href"];
  };
}

// need to be developed after design of this element will be delivered
function DropdownMenu({ main }: DropdownMenuProps) {
  return (
    <div className={styles["dropdown-menu"]}>
      <Link href={main.url} passHref>
        <a href="pass" className={styles["dropdown-menu-trigger"]}>
          {main.label}
          <ChevronDownIcon />
        </a>
      </Link>
    </div>
  );
}

export default DropdownMenu;
