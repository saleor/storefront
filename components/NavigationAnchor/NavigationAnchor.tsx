import Link from "next/link";

import { getLinkPath } from "@/lib/menus";
import { translate } from "@/lib/translations";
import { MenuItemWithChildrenFragment } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";

interface NavigationAnchorProps {
  menuItem: MenuItemWithChildrenFragment;
  className: string;
}

export function NavigationAnchor({ menuItem, className }: NavigationAnchorProps) {
  const {
    currentChannel: { slug },
    currentLocale,
  } = useRegions();

  if (menuItem.url) {
    return (
      <a
        href={menuItem.url}
        target="_blank"
        rel="noreferrer"
        className={className}
        data-testid={`categoriesList${menuItem.name}`}
      >
        {translate(menuItem, "name")}
      </a>
    );
  }

  return (
    <Link href={getLinkPath(menuItem, slug, currentLocale)} passHref>
      <a href="pass" className={className} data-testid={`categoriesList${menuItem.name}`}>
        {translate(menuItem, "name")}
      </a>
    </Link>
  );
}

export default NavigationAnchor;
