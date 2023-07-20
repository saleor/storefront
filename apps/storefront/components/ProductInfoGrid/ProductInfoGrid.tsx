import Image from "next/image";

import Bio from "../../images/product/bio.png";
import CreditCard from "../../images/product/credit-card.png";
import DeliveryStatus from "../../images/product/delivery-status.png";
import Shipped from "../../images/product/shipped.png";

export const ProductInfoGrid = () => {
  return (
    <div className="mt-6 grid grid-cols-2">
      <div className="text-base py-6 flex flex-row gap-3 items-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full text-center flex justify-center items-center">
          <Image src={Bio} alt="" width="28" height="28" />
        </div>
        <p>Eco-Friendly</p>
      </div>
      <div className="text-base py-6 flex flex-row gap-3 items-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full text-center flex justify-center items-center">
          <Image src={DeliveryStatus} alt="" width="28" height="28" />
        </div>
        <p>Fast delivery</p>
      </div>
      <div className="text-base py-6 flex flex-row gap-3 items-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full text-center flex justify-center items-center">
          <Image src={Shipped} alt="" width="28" height="28" />
        </div>
        <p>14 days for returns</p>
      </div>
      <div className="text-base py-6 flex flex-row gap-3 items-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full text-center flex justify-center items-center">
          <Image src={CreditCard} alt="" width="28" height="28" />
        </div>
        <p>Secure payment</p>
      </div>
    </div>
  );
};
