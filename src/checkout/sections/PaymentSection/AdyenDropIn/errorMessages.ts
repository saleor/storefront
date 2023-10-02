import { defineMessages } from "react-intl";

export const adyenErrorMessages = defineMessages({
	refused: {
		defaultMessage: "The transaction was refused.",
		id: "AdyenDropIn/errorMessages/VFX2HQ",
		description: "The transaction was refused.",
	},
	acquirerError: {
		defaultMessage: "The transaction did not go through due to an error that occurred on the acquirer's end.",
		id: "AdyenDropIn/errorMessages/71wcNF",
		description: "The transaction did not go through due to an error that occurred on the acquirer's end.",
	},
	blockedCard: {
		defaultMessage: "The card used for the transaction is blocked, therefore unusable.",
		id: "AdyenDropIn/errorMessages/0NXVfz",
		description: "The card used for the transaction is blocked, therefore unusable.",
	},
	expiredCard: {
		defaultMessage: "The card used for the transaction has expired. Therefore it is unusable.",
		id: "AdyenDropIn/errorMessages/qeGblU",
		description: "The card used for the transaction has expired. Therefore it is unusable.",
	},
	invalidAmount: {
		defaultMessage: "An amount mismatch occurred during the transaction process.",
		id: "AdyenDropIn/errorMessages/OVcUz1",
		description: "An amount mismatch occurred during the transaction process.",
	},
	invalidCardNumber: {
		defaultMessage: "The specified card number is incorrect or invalid.",
		id: "AdyenDropIn/errorMessages/HmkjpZ",
		description: "The specified card number is incorrect or invalid.",
	},
	issuerUnavailable: {
		defaultMessage: "It is not possible to contact the shopper's bank to authorise the transaction.",
		id: "AdyenDropIn/errorMessages/H3UOYb",
		description: "It is not possible to contact the shopper's bank to authorise the transaction.",
	},
	notSupported: {
		defaultMessage: "The shopper's bank does not support or does not allow this type of transaction.",
		id: "AdyenDropIn/errorMessages/7L60IY",
		description: "The shopper's bank does not support or does not allow this type of transaction.",
	},
	"3DNotAuthenticated": {
		defaultMessage: "3D Secure authentication was not executed, or it did not execute successfully.",
		id: "AdyenDropIn/errorMessages/r/nPYl",
		description: "3D Secure authentication was not executed, or it did not execute successfully.",
	},
	notEnoughBalance: {
		defaultMessage: "The card does not have enough money to cover the payable amount.",
		id: "AdyenDropIn/errorMessages/dFVdlJ",
		description: "The card does not have enough money to cover the payable amount.",
	},
	acquirerFraud: {
		defaultMessage: "Possible fraud.",
		id: "AdyenDropIn/errorMessages/fQP7a3",
		description: "Possible fraud.",
	},
	cancelled: {
		defaultMessage: "The transaction was cancelled by the provider.",
		id: "AdyenDropIn/errorMessages/UTbebI",
		description: "The transaction was cancelled by the provider.",
	},
	shopperCancelled: {
		defaultMessage: "The transaction was canceled by the shopper.",
		id: "AdyenDropIn/errorMessages/33ekFH",
		description: "The transaction was canceled by the shopper.",
	},
	invalidPin: {
		defaultMessage: "The specified PIN is incorrect or invalid.",
		id: "AdyenDropIn/errorMessages/WISh4I",
		description: "The specified PIN is incorrect or invalid.",
	},
	pinTriesExceeded: {
		defaultMessage: "The shopper specified an incorrect PIN more that three times in a row.",
		id: "AdyenDropIn/errorMessages/gDaWeJ",
		description: "The shopper specified an incorrect PIN more that three times in a row.",
	},
	pinValidationNotPossible: {
		defaultMessage: "It is not possible to validate the specified PIN number.",
		id: "AdyenDropIn/errorMessages/Tzeq1v",
		description: "It is not possible to validate the specified PIN number.",
	},
	fraud: {
		defaultMessage:
			"The pre-authorisation risk checks resulted in a fraud score of 100 or more. Therefore, the transaction was flagged as fraudulent, and was refused.",
		id: "AdyenDropIn/errorMessages/lGTFe5",
		description:
			"The pre-authorisation risk checks resulted in a fraud score of 100 or more. Therefore, the transaction was flagged as fraudulent, and was refused.",
	},
	notSubmitted: {
		defaultMessage: "The transaction was not submitted correctly for processing.",
		id: "AdyenDropIn/errorMessages/b5X/WP",
		description: "The transaction was not submitted correctly for processing.",
	},
	fraudCancelled: {
		defaultMessage:
			"The sum of pre-authorisation and post-authorisation risk checks resulted in a fraud score of 100 or more. Therefore, the transaction was flagged as fraudulent, and was refused.",
		id: "AdyenDropIn/errorMessages/q0ee+A",
		description:
			"The sum of pre-authorisation and post-authorisation risk checks resulted in a fraud score of 100 or more. Therefore, the transaction was flagged as fraudulent, and was refused.",
	},
	transactionNotPermitted: {
		defaultMessage: "Transaction not permitted to issuer, cardholder or the merchant.",
		id: "AdyenDropIn/errorMessages/uMWIuO",
		description: "Transaction not permitted to issuer, cardholder or the merchant.",
	},
	cvcDeclined: {
		defaultMessage: "The specified CVC (card security code) is invalid.",
		id: "AdyenDropIn/errorMessages/S23GlJ",
		description: "The specified CVC (card security code) is invalid.",
	},
	restrictedCard: {
		defaultMessage:
			"The card you provided is either not viable to use in the country of the store or is restricted to use.",
		id: "AdyenDropIn/errorMessages/st595D",
		description:
			"The card you provided is either not viable to use in the country of the store or is restricted to use.",
	},
	revocationOfAuth: {
		defaultMessage: "Cancel of the transaction requested by the shopper",
		id: "AdyenDropIn/errorMessages/x6Bmw3",
		description: "Cancel of the transaction requested by the shopper",
	},
	declinedNotGeneric: {
		defaultMessage: "An error occured while trying to proceed with the payment. Try another payment method.",
		id: "AdyenDropIn/errorMessages/qFhxLR",
		description: "An error occured while trying to proceed with the payment. Try another payment method.",
	},
	withdrawalAmountExceeded: {
		defaultMessage: "The withdrawal amount permitted for the shopper's card has exceeded.",
		id: "AdyenDropIn/errorMessages/J2yHC9",
		description: "The withdrawal amount permitted for the shopper's card has exceeded.",
	},
	withDrawalCountExceeded: {
		defaultMessage: "The number of withdrawals permitted for the shopper's card has exceeded.",
		id: "AdyenDropIn/errorMessages/h+IiPj",
		description: "The number of withdrawals permitted for the shopper's card has exceeded.",
	},
	issuerSuspectedFrad: {
		defaultMessage: "Issuer reported the transaction as suspected fraud.",
		id: "AdyenDropIn/errorMessages/U5W4KS",
		description: "Issuer reported the transaction as suspected fraud.",
	},
	avsDeclined: {
		defaultMessage: "The address data the shopper entered is incorrect.",
		id: "AdyenDropIn/errorMessages/hZwB12",
		description: "The address data the shopper entered is incorrect.",
	},
	cardRequiresOnlinePin: {
		defaultMessage: "The shopper's bank requires the shopper to enter an online PIN.",
		id: "AdyenDropIn/errorMessages/5WO+oy",
		description: "The shopper's bank requires the shopper to enter an online PIN.",
	},
	noCheckingAmountAvailableOnCard: {
		defaultMessage: "The shopper's bank requires a checking account to complete the purchase.",
		id: "AdyenDropIn/errorMessages/xC2/8c",
		description: "The shopper's bank requires a checking account to complete the purchase.",
	},
	noSavingsAccountAvailableOnCard: {
		defaultMessage: "The shopper's bank requires a savings account to complete the purchase.",
		id: "AdyenDropIn/errorMessages/jnHZIN",
		description: "The shopper's bank requires a savings account to complete the purchase.",
	},
	mobilePinRequired: {
		defaultMessage: "The shopper's bank requires the shopper to enter a mobile PIN.",
		id: "AdyenDropIn/errorMessages/jSTNBf",
		description: "The shopper's bank requires the shopper to enter a mobile PIN.",
	},
	contactlessFallback: {
		defaultMessage:
			"The shopper abandoned the transaction after they attempted a contactless payment and were prompted to try a different card entry method (PIN or swipe).",
		id: "AdyenDropIn/errorMessages/tpU5ix",
		description:
			"The shopper abandoned the transaction after they attempted a contactless payment and were prompted to try a different card entry method (PIN or swipe).",
	},
	authenticationRequired: {
		defaultMessage:
			"The issuer declined the authentication exemption request and requires authentication for the transaction. Retry with 3D Secure.",
		id: "AdyenDropIn/errorMessages/3Nt7TE",
		description:
			"The issuer declined the authentication exemption request and requires authentication for the transaction. Retry with 3D Secure.",
	},
	rreqNotReceivedFromDS: {
		defaultMessage: "The issuer or the scheme wasn't able to communicate the outcome via RReq.",
		id: "AdyenDropIn/errorMessages/Jej9AD",
		description: "The issuer or the scheme wasn't able to communicate the outcome via RReq.",
	},
	currentAidIsInPenaltyBox: {
		defaultMessage:
			"the payment network can't be reached. retry the transaction with a different payment method.",
		id: "AdyenDropIn/errorMessages/6Kwq8L",
		description:
			"the payment network can't be reached. retry the transaction with a different payment method.",
	},
	cvmRequiredRestartPayment: {
		defaultMessage: "A PIN or signature is required. Retry the transaction.",
		id: "AdyenDropIn/errorMessages/XQ/LIQ",
		description: "A PIN or signature is required. Retry the transaction.",
	},
	"3DsAuthenticationError": {
		defaultMessage:
			"The 3D Secure authentication failed due to an issue at the card network or issuer. Retry the transaction, or retry the transaction with a different payment method.",
		id: "AdyenDropIn/errorMessages/UBOLt2",
		description:
			"The 3D Secure authentication failed due to an issue at the card network or issuer. Retry the transaction, or retry the transaction with a different payment method.",
	},
});
