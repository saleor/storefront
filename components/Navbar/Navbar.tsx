import clsx from "clsx";
import Link from "next/link";
import React, { useState } from "react";

import { usePaths } from "@/lib/paths";

import { RegionDialog } from "../RegionDialog";
import { Menu } from "./Menu";
import styles from "./Navbar.module.css";
import Stamp from "./Stamp";

export function Navbar() {
  const paths = usePaths();
  const [isRegionDialogOpen, setRegionDialogOpen] = useState(false);

  return (
    <>
      <div className={clsx(styles.navbar)}>
        <div className={clsx(styles.inner)}>
          <div className="flex-1">
            <Menu />
          </div>
          <div className="flex-1 flex justify-center">
            <Link href={paths.$url()} passHref>
              <a href="pass" className={styles.logo}>
                <Stamp />
              </a>
            </Link>
          </div>
          <div className="flex-1" />
        </div>
      </div>
      <RegionDialog isOpen={isRegionDialogOpen} onClose={() => setRegionDialogOpen(false)} />
    </>
  );
}

export default Navbar;
