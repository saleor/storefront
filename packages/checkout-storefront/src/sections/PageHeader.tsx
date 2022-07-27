import { SaleorLogo } from "@/checkout-storefront/images";
import { getSvgSrc } from "../lib/svgSrc";

const PageHeader = () => {
  return (
    <div className="page-header">
      <img src={getSvgSrc(SaleorLogo)} alt="logo" className="logo" />
    </div>
  );
};

export default PageHeader;
