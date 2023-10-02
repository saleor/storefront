import { type FallbackProps } from "react-error-boundary";
import { pageNotFoundMessages } from "./messages";
import { SaleorLogo } from "@/checkout/assets/images/SaleorLogo";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { Button } from "@/checkout/components/Button";
import { emptyCartMessages, emptyCartLabels } from "@/checkout/views/EmptyCartPage/messages";

export const PageNotFound = ({ error }: Partial<FallbackProps>) => {
	console.error(error);
	const formatMessage = useFormattedMessages();

	// eslint-disable-next-line no-restricted-globals
	const goBack = () => history.back();

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center pt-12">
			<div className="flex w-full justify-center">
				<SaleorLogo />
			</div>
			<div className="mb-22 flex h-full flex-col items-center justify-center">
				<p className="max-w-85 mb-6 text-center">{formatMessage(pageNotFoundMessages.subtitle)}</p>
				<Button
					ariaLabel={formatMessage(emptyCartLabels.goBackToStore)}
					onClick={goBack}
					variant="secondary"
					label={formatMessage(emptyCartMessages.goBackToStore)}
				/>
			</div>
		</div>
	);
};
