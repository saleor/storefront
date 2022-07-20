import { SaleorLogo } from "@/checkout-storefront/images";

const PageHeader = () => {
  return (
    <div className="page-header">
      <img src={SaleorLogo} alt="logo" className="logo" />
    </div>
  );
};

export default PageHeader;
