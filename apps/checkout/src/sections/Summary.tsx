import React from "react";
import { Text } from "@components/Text";

interface SummaryProps {}

const Summary: React.FC<SummaryProps> = ({}) => {
  return (
    <div className="summary" style={{ border: "1px solid blue" }}>
      <Text>Summary here</Text>
    </div>
  );
};

export default Summary;
