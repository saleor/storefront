import { STOREFRONT_NAME } from "@/lib/const";
import usePaths from "@/lib/paths";
import { MenuItem } from "@/saleor/api";
import Link from "next/link";
import * as React from "react";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  item: MenuItem;
}
export const NavLink: React.FC<NavLinkProps> = ({ item, ...props }) => {
  const paths = usePaths();

  const { name, url, category, collection, page } = item;
  const link = (url: string) => (
    <Link passHref href={url} {...props}>
      {name}
    </Link>
  );

  if (url) {
    return (
      <a href={url} {...props}>
        {name}
      </a>
    );
  }
  if (category) {
    const categoryUrl = paths.category._slug(category?.slug).$url();
    return link(categoryUrl);
  }

  if (collection) {
    const collectionUrl = paths.collection._slug(collection?.slug).$url();
    if (STOREFRONT_NAME === "CLOTHES4U") {
      if (collection.slug.includes("c4u")) {
        return link(collectionUrl);
      }
      return null;
    }
    if (STOREFRONT_NAME === "FASHION4YOU") {
      if (collection.slug.includes("c4u")) {
        return null;
      }
      return link(collectionUrl);
    }
  }
  if (page) {
    const pageUrl = paths.page._slug(page?.slug).$url();

    if (STOREFRONT_NAME === "CLOTHES4U") {
      if (page.slug.includes("-c4u")) {
        return link(pageUrl);
      }
      return null;
    }
    if (STOREFRONT_NAME === "FASHION4YOU") {
      if (page.slug.includes("-c4u")) {
        return null;
      }
      return link(pageUrl);
    }
  }

  return <span {...props}>{name}</span>;
};
