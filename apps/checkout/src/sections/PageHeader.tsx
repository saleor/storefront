import React from "react";
import { SaleorLogo } from "@images";

interface PageHeaderProps {}

const PageHeader: React.FC<PageHeaderProps> = ({}) => {
  return (
    <div className="page-header">
      <img src={SaleorLogo} alt="saleor-logo" className="saleor-logo" />
    </div>
  );
};

export default PageHeader;
