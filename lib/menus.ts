import { pagesPath } from "@/lib/$path";
import { MenuItemFragment } from "@/saleor/api";

export const getLinkPath = (item: MenuItemFragment, channel: string, locale: string) => {
  const paths = pagesPath._channel(channel)._locale(locale);

  if (item.category) {
    return paths.category._slug(item.category?.slug).$url();
  }
  if (item.collection) {
    return paths.collection._slug(item.collection?.slug).$url();
  }
  if (item.page) {
    return paths.page._slug(item.page?.slug).$url();
  }
  return paths.$url();
};

export default getLinkPath;
