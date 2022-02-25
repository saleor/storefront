import React from "react";
import { SaleorLogo } from "@images";

interface PageHeaderProps {}

const PageHeader: React.FC<PageHeaderProps> = ({}) => {
  return (
    <div className="page-header">
      <img src={SaleorLogo} alt="logo" className="logo" />
    </div>
  );
};

export default PageHeader;
