import { STOREFRONT_NAME } from "./const";

const facebookLinks: { [key: string]: string } = {
  FASHION4YOU: "https://www.facebook.com/profile.php?id=100083301792879",
  CLOTHES4U: "https://www.facebook.com/Clothes4YouPL/",
};

const instagramLinks: { [key: string]: string } = {
  FASHION4YOU: "https://www.instagram.com/fashion4youpl/",
  CLOTHES4U: "https://www.instagram.com/clothes4you.pl/",
};

export const socialMediaLinks = {
  facebook: facebookLinks[STOREFRONT_NAME] || "",
  instagram: instagramLinks[STOREFRONT_NAME] || "",
};
