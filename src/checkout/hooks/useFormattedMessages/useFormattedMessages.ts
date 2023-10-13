import { useCallback } from "react";
import { type MessageDescriptor } from "react-intl";

export const useFormattedMessages = () => {
	return useCallback((message: MessageDescriptor, values?: Record<string, number | string>) => {
		if (values) {
			console.log("values", values);
		}
		return (
			(Array.isArray(message.defaultMessage) ? message.defaultMessage.join(" ") : message.defaultMessage) ??
			message.id ??
			""
		);
	}, []);
};
