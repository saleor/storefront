import { isExcludedCategory, MAX_MENU_ITEMS } from "@/components/Navbar/utils";
import { useRegions } from "@/components/RegionsProvider";
import { useMainMenuQuery } from "@/saleor/api";
import { STOREFRONT_NAME } from "../const";
import { useEffect } from "react";

export const useVisibleMenuItems = () => {
  const { query } = useRegions();
  const { error, data, loading } = useMainMenuQuery({ variables: query });

  let visibleMenuItems = null;

  useEffect(() => {
    if (error) {
      console.error("Error fetching menu items: ", error);
    }
  }, [error]);

  if (!error && data) {
    const menuItems = data?.menu?.items;
    visibleMenuItems =
      STOREFRONT_NAME === "FASHION4YOU"
        ? menuItems?.filter((item) => !isExcludedCategory(item))
        : menuItems?.slice(0, MAX_MENU_ITEMS);
  }

  return { loading, error, visibleMenuItems };
};
