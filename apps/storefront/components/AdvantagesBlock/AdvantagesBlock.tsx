import { AdvantagesBlockItem } from "./AdvantagesBlockItem";

import ShippedIcon from "../../images/homepage/icons/shipped.png";
import CreditIcon from "../../images/homepage/icons/credit.png";
import ParcelIcon from "../../images/homepage/icons/parcel.png";

import messages from "@/components/translations";
import { useIntl } from "react-intl";

export const AdvantagesBlock = () => {
  const t = useIntl();

  return (
    <section className="pt-32 md:mt-24 lg:mx-16">
      <div className="flex flex-col items-center container">
        <h2 className="max-w-[893px] text-center mb-4 font-semibold text-5xl sm:text-5xl md:text-5xl lg:text-6xl leading-tight">
          {t.formatMessage(messages.advantages)}
        </h2>
        <p className="text-md sm:text-md md:text-md lg:text-md text-gray-700 text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed max-w-[568px]">
          {t.formatMessage(messages.advantagesText)}
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-20 md:gap-28 container">
        <AdvantagesBlockItem
          title={t.formatMessage(messages.advantagesShippingHeading)}
          text={t.formatMessage(messages.advantagesShippingText)}
          image={ShippedIcon}
        />
        <AdvantagesBlockItem
          title={t.formatMessage(messages.advantagesPaymentsHeading)}
          text={t.formatMessage(messages.advantagesPaymentsText)}
          image={CreditIcon}
        />
        <AdvantagesBlockItem
          title={t.formatMessage(messages.advantagesReturnsHeading)}
          text={t.formatMessage(messages.advantagesReturnsText)}
          image={ParcelIcon}
        />
      </div>
    </section>
  );
};
