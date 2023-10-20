import { type FallbackProps } from "react-error-boundary";
import { SaleorLogo } from "@/checkout/assets/images/SaleorLogo";
import { Button } from "@/checkout/components/Button";

export const PageNotFound = ({ error }: Partial<FallbackProps>) => {
	console.error(error);

	// eslint-disable-next-line no-restricted-globals
	const goBack = () => history.back();

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center pt-12">
			<div className="flex w-full justify-center">
				<SaleorLogo />
			</div>
			<div className="mb-22 flex h-full flex-col items-center justify-center">
				<p className="max-w-85 mb-6 text-center">
					We couldn&apos;t fetch information about your checkout. Go back to the store and try again.
				</p>
				<Button ariaLabel="Go back to store" onClick={goBack} variant="secondary" label="Go back to store" />
			</div>
		</div>
	);
};
