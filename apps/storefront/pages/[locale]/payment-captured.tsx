import { Layout } from "@/components";
import { ReactElement } from "react";

const PaymentCaptured = () => {
  return (
    <main className="container w-full px-8 mt-18 mb-18">
      <h1 className="mb-4 font-bold text-5xl md:text-6xl xl:text-7xl tracking-tight max-w-[647px] md:max-w-full">
        Dziękujemy transakcja <br /> zakończyła się pomyślnie
      </h1>
      <p className="text-md">Oczekuj przesyłki w najbliższych dniach roboczych.</p>
    </main>
  );
};

PaymentCaptured.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PaymentCaptured;
