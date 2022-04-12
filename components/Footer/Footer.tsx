import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes } from "react";

import { usePaths } from "@/lib/paths";

import { Box } from "../Box";
import styles from "./Footer.module.css";

export type FooterProps = HTMLAttributes<HTMLElement>

export function Footer({ className, ...rest }: FooterProps) {
  const paths = usePaths();

  return (
    <footer className={clsx(styles.footer, className)} {...rest}>
      <Box>
        <div className="flex mb-18">
          <Link href={paths.$url()} passHref>
            <a href="pass">
              <div className="mt-px group block h-16 w-28 relative grayscale">
                <Image src="/saleor.svg" alt="Saleor logo" layout="fill" />
              </div>
            </a>
          </Link>
          <div className="flex ml-auto">
            <div>
              <strong className="block text-md font-bold mb-4">News and updates</strong>
              {/* <ul className="list-none">
                <li>
                  <a href="#">Test</a>
                </li>
                <li>
                  <a href="#">Test</a>
                </li>
                <li>
                  <a href="#">Test</a>
                </li>
              </ul> */}
            </div>
          </div>
        </div>
        <p className="text-sm text-main-3">© Copyright 2018 - 2022 Saleor Commerce</p>
      </Box>
    </footer>
  );
}

export default Footer;
