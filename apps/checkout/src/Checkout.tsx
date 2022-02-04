// import { Suspense } from "react";

// import { Text } from "@components/Text";
import { useCheckoutQuery } from "@graphql";
import PageHeader from "@sections/PageHeader";
import Summary from "@sections/Summary";
import CheckoutForm from "@sections/CheckoutForm";

const SuspenseTest = () => {
  const [{ data }] = useCheckoutQuery({
    variables: { token: "fc03e431-ff48-4e7f-b953-7ad6987bbcbc" },
  });

  return <span>{data?.checkout?.email}</span>;
};

export const Checkout = () => {
  return (
    <div className="page">
      <PageHeader />
      {/* <Text size="sm" color="secondary">
        <Suspense fallback={"Loading..."}>
          <SuspenseTest />
        </Suspense>
      </Text> */}
      <div className="page-content">
        <CheckoutForm />
        <div className="page-divider" />
        <Summary />
      </div>
    </div>
  );
};
