import { SaleorLogo } from "@/checkout-storefront/images";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { LanguageButton } from "./LanguageButton";

export const PageHeader = () => {
  return (
    <div className="page-header">
      <img src={getSvgSrc(SaleorLogo)} alt="logo" className="logo" />
      <LanguageButton />
    </div>
  );
};
