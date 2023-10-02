import { defineMessages } from "react-intl";
import { type ErrorCode } from "@/checkout/lib/globalTypes";

export const fieldErrorMessages = defineMessages<ErrorCode>({
	invalid: {
		defaultMessage: "Invalid value",
		id: "useErrorMessages/messages/ebt/9V",
		description: "invalid value",
	},
	required: {
		defaultMessage: "Required field",
		id: "useErrorMessages/messages/GmjKcs",
		description: "required field",
	},
	unique: {
		defaultMessage: "Value must be unique",
		id: "useErrorMessages/messages/GrUSxl",
		description: "value must be unique",
	},
	emailInvalid: {
		defaultMessage: "Email must be a valid email",
		id: "useErrorMessages/messages/y5NEQs",
		description: "email must be a valid email",
	},
	passwordAtLeastCharacters: {
		defaultMessage: "Password must be at least 8 characters",
		id: "useErrorMessages/messages/Hz38OL",
		description: "password must be at least 8 characters",
	},
	passwordTooShort: {
		defaultMessage: "Provided password is too short. Minimum length is 8 characters.",
		id: "useErrorMessages/messages/W/xrYy",
		description: "password too short",
	},
	passwordTooSimilar: {
		defaultMessage: "Provided password is too similar to your previous password.",
		id: "useErrorMessages/messages/wVsmCj",
		description: "password too similar",
	},
	passwordTooCommon: {
		defaultMessage: "Provided password is too common. Use something more fancy.",
		id: "useErrorMessages/messages/v+nLdX",
		description: "password too common",
	},
	passwordInvalid: {
		defaultMessage: "Provided password is invalid.",
		id: "useErrorMessages/messages/ZnQ753",
		description: "password invalid",
	},
	quantityGreaterThanLimit: {
		defaultMessage: "Chosen quantity is more than limit allowed.",
		id: "useErrorMessages/messages/+WMTds",
		description: "quantity greater than limit",
	},
	insufficientStock: {
		defaultMessage: "Not enough of chosen item in stock.",
		id: "useErrorMessages/messages/OOj8Aa",
		description: "insufficient stock",
	},
	invalidCredentials: {
		defaultMessage: "Invalid credentials provided at login.",
		id: "useErrorMessages/messages/YaHFRg",
		description: "invalid credentials",
	},
	missingFields: {
		defaultMessage: "Missing fields in address form: ",
		id: "useErrorMessages/messages/RcmVPj",
		description: "missing fields in address form",
	},
});
