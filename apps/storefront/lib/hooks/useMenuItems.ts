import { isExcludedCategory, MAX_MENU_ITEMS } from "@/components/Navbar/utils";
import { useRegions } from "@/components/RegionsProvider";
import { useMainMenuQuery } from "@/saleor/api";
import { STOREFRONT_NAME } from "../const";

export const useMenuItems = () => {
  const { query } = useRegions();
  const { error, data } = useMainMenuQuery({ variables: query });

  const items = data?.menu?.items;

  const menuItems =
    STOREFRONT_NAME === "FASHION4YOU"
      ? items?.filter((item) => !isExcludedCategory(item))
      : items?.slice(0, MAX_MENU_ITEMS);

  return { error, menuItems };
};
