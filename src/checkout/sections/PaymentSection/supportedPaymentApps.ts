import { AdyenDropIn } from "./AdyenDropIn/AdyenDropIn";
import { adyenGatewayId } from "./AdyenDropIn/types";
import { DummyComponent } from "./DummyDropIn/dummyComponent";
import { dummyGatewayId } from "./DummyDropIn/types";
import { StripeComponent } from "./StripeElements/stripeComponent";
import { stripeGatewayId } from "./StripeElements/types";
import { StripeComponent as StripeV2Component } from "./StripeV2DropIn/stripeComponent";
import { stripeV2GatewayId } from "./StripeV2DropIn/types";

export const paymentMethodToComponent = {
	[adyenGatewayId]: AdyenDropIn,
	[stripeGatewayId]: StripeComponent,
	[stripeV2GatewayId]: StripeV2Component,
	[dummyGatewayId]: DummyComponent,
};
