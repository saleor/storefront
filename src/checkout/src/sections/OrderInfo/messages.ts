import { defineMessages } from "react-intl";

export const orderInfoMessages = defineMessages({
	paymentSection: {
		defaultMessage: "Payment",
		id: "OrderInfo/messages/9VWqRC",
		description: "payment",
	},
	orderUnpaid: {
		defaultMessage: "The order has not been paid for. If you ordered a payment - check for the confirmation.",
		id: "OrderInfo/messages/4IPxGY",
		description: "order unpaid message",
	},
	orderPaid: {
		defaultMessage: "We've received your payment",
		id: "OrderInfo/messages/vcXZR6",
		description: "paid order message",
	},
	orderAuthorized: {
		defaultMessage: "We've received your payment authorization",
		id: "OrderInfo/messages/+SXlNJ",
		description: "We've received your payment authorization",
	},
	orderOvercharged: {
		defaultMessage:
			"Your order has been paid more than owed. This may be an error during payment. Contact your shop staff for help.",
		id: "OrderInfo/messages/1hMnDx",
	},
	orderConfirmTitle: {
		defaultMessage: "Order #{number} confirmed",
		id: "OrderInfo/messages/VjsJkY",
		description: "order confirmed",
	},
	orderConfirmSubtitle: {
		defaultMessage:
			"Thank you for placing your order. We’ve received it and we will contact you as soon as your package is shipped. A confirmation email has been sent to {email}.",
		id: "OrderInfo/messages/ty5n+J",
		description: "order confirmed subtitle",
	},
	paymentPending: {
		defaultMessage: "Your payment is being processed.",
		id: "OrderInfo/messages/MY0OAh",
		description: "payment pending",
	},
	orderPaymentStatusMissing: {
		defaultMessage:
			"We could not fetch information about your payment. If you ordered a payment - check for the confirmation and contact the store.",
		id: "OrderInfo/messages/nkRLWD",
		description: "order payment status missing",
	},
	orderPay: {
		defaultMessage: "Pay for the order",
		id: "OrderInfo/messages/H+et6P",
		description: "pay for the order",
	},
});

export const orderInfoLabels = defineMessages({
	orderPay: {
		defaultMessage: "order pay",
		id: "OrderInfo/messages/fdFTXC",
		description: "order pay accessibility label",
	},
});
