import { AlertIcon, SuccessIcon } from "../../assets/icons";
import { Section } from "./Section";

import { useOrder } from "@/checkout/hooks/useOrder";
import { usePaymentStatus } from "@/checkout/sections/PaymentSection/utils";

const ErrorMessage = ({ message }: { message: string }) => {
	return (
		<>
			<p className="mr-1 text-red-500">{message}</p>
			<AlertIcon />
		</>
	);
};

const SuccessMessage = ({ message }: { message: string }) => {
	return (
		<>
			<p color="success" className="mr-1">
				{message}
			</p>
			<SuccessIcon />
		</>
	);
};

export const PaymentSection = () => {
	const { order } = useOrder();
	const paymentStatus = usePaymentStatus(order);

	return (
		<Section title="Payment">
			<div data-testid="paymentStatus">
				<div className="flex flex-row items-center">
					{paymentStatus === "authorized" && (
						<SuccessMessage message="We've received your payment authorization" />
					)}

					{paymentStatus === "paidInFull" && <SuccessMessage message="We've received your payment" />}

					{paymentStatus === "overpaid" && (
						<ErrorMessage message="Your order has been paid more than owed. This may be an error during payment. Contact your shop staff for help." />
					)}
				</div>
			</div>
		</Section>
	);
};
