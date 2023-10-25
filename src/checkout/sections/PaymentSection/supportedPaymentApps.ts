import { AdyenDropIn } from "./AdyenDropIn/AdyenDropIn";
import { adyenGatewayId } from "./AdyenDropIn/types";
import { stripeGatewayId } from "./StripeElements/types";
import { type ParsedStripeGateway } from "./types";

export const paymentMethodToComponent = {
	[adyenGatewayId]: AdyenDropIn,
	[stripeGatewayId]: ({}: { config: ParsedStripeGateway }) => null,
};
