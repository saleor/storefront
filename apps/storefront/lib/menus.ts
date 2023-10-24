import { pagesPath } from "@/lib/$path";
import { MenuItemFragment } from "@/saleor/api";

export const getLinkPath = (item: MenuItemFragment, locale: string) => {
  const paths = pagesPath._locale(locale);

  if (item.category) {
    return paths.category._slug(item.category?.slug).$url();
  }
  // TODO: Expand MenuItemFragment for sales
  // if (item.sale) {
  //   return paths.sale._id(item.sale?.id).$url();
  // }
  if (item.collection) {
    return paths.collection._slug(item.collection?.slug).$url();
  }
  if (item.page) {
    return paths.page._slug(item.page?.slug).$url();
  }

  return paths.$url();
};

export default getLinkPath;
