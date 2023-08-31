import React from "react";
import { useIntl } from "react-intl";
import { messages } from "../translations";

export const InfoBanner = () => {
  const t = useIntl();

  return (
    <section className="marketing-bar-global bg-primary text-white bg-brand py-5 text-center text-base">
      <div className="marketing-bar-content">
        <div className="marketing-bar-content-description">
          {t.formatMessage(messages.marketingFirstText)}
          <strong className="marketing-bar-content-description-bold"> DOSTAWA0 </strong>
          {t.formatMessage(messages.marketingSecondText)}
        </div>
      </div>
    </section>
  );
};
