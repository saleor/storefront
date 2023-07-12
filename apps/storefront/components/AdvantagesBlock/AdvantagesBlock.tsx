import { AdvantagesBlockItem } from "./AdvantagesBlockItem";

import ShippedIcon from "../../images/homepage/icons/shipped.png";
import CreditIcon from "../../images/homepage/icons/credit.png";
import ParcelIcon from "../../images/homepage/icons/parcel.png";

export const AdvantagesBlock = () => {
  return (
    <section className="mt-16 md:mt-24">
      <div className="flex flex-col items-center py-12 container">
        <h2 className="max-w-[893px] text-center mb-2 font-semibold text-[38px] leading-[55px] text-black">
          Zapewniamy najlepszą obsługę <span className="text-primary">klienta</span>
        </h2>
        <p className="text-md sm:text-md md:text-md lg:text-md text-gray-700 text-left lg:text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed max-w-[568px]">
          Nasi doświadczeni specjaliści są zawsze gotowi, by odpowiedzieć na Twoje pytanie,
          rozwiązać problemy i pomóc Ci w zakupach.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-20 md:gap-28 container">
        <AdvantagesBlockItem
          title="Szybka wysyłka"
          text="Oferujemy szybką i sprawną wysyłkę"
          image={ShippedIcon}
        />
        <AdvantagesBlockItem
          title="Bezpieczne płatności"
          text="Akceptujemy płatności popularnym PayU"
          image={CreditIcon}
        />
        <AdvantagesBlockItem
          title="Zwroty"
          text="Masz 14 dni na zmianę zdania"
          image={ParcelIcon}
        />
      </div>
    </section>
  );
};
