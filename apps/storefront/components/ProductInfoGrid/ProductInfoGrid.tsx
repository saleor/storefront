import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { CreditCardIcon, TruckIcon } from "@heroicons/react/outline";
import { useIntl } from "react-intl";
import messages from "../translations";

export const ProductInfoGrid = () => {
  const t = useIntl();
  return (
    <div>
      <div className="w-3/4">
        <Accordion>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <div className="flex flex-row gap-3 items-center">
              <CreditCardIcon style={{ height: "40px" }} />
              <span className="text-base leading-[5rem]">
                {t.formatMessage(messages.paymentOptions)}
              </span>
            </div>
          </AccordionSummary>
          <AccordionDetails
            className="text-base flex flex-col gap-3"
            style={{ paddingLeft: "30px", paddingTop: "0" }}
          >
            <div className="pb-2">PayU</div>
            <div>{t.formatMessage(messages.cashOnDelivery)}</div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
            <div className="flex flex-row gap-3 items-center">
              <TruckIcon style={{ height: "40px" }} />
              <span className="text-base leading-[5rem]">
                {t.formatMessage(messages.shippingOptions)}
              </span>
            </div>
          </AccordionSummary>
          <AccordionDetails
            className="text-base flex flex-col gap-3"
            style={{ paddingLeft: "30px", paddingTop: "0" }}
          >
            <div className="pb-2">{t.formatMessage(messages.inpostParcelLocker)}</div>
            <div className="pb-2">{t.formatMessage(messages.courier)} DPD</div>
            <div>
              {t.formatMessage(messages.courier)} GLS, {t.formatMessage(messages.cashOnDelivery)}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      {/* <div className="mt-6 grid grid-cols-2">
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
      </div> */}
    </div>
  );
};
