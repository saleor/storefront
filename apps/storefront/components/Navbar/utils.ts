import { MenuItemWithChildrenFragment } from "@/saleor/api";

export const MAX_MENU_ITEMS = 5;
export const EXCLUDED_CATEGORIES = ["Mix", "Hurt", "Detal"];

export const isExcludedCategory = (item: MenuItemWithChildrenFragment) =>
  EXCLUDED_CATEGORIES.includes(item.name);
