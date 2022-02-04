import React from "react";
import { Text } from "@components/Text";

interface PageHeaderProps {}

const PageHeader: React.FC<PageHeaderProps> = ({}) => {
  return (
    <div className="page-header">
      <Text size="xl" bold>
        Saleor Checkout
      </Text>
    </div>
  );
};

export default PageHeader;
