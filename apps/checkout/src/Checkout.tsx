import { Suspense } from "react";

import { Text } from "@components/Text";
import { useCheckoutQuery } from "@graphql";

const SuspenseTest = () => {
  const [{ data }] = useCheckoutQuery({
    variables: { token: "fc03e431-ff48-4e7f-b953-7ad6987bbcbc" },
  });

  return <span>{data?.checkout?.email}</span>;
};

export const Checkout = () => {
  return (
    <div>
      <Text size="xl" bold>
        Saleor Checkout
      </Text>
      <Text size="sm" color="secondary">
        <Suspense fallback={"Loading..."}>
          <SuspenseTest />
        </Suspense>
      </Text>
    </div>
  );
};
