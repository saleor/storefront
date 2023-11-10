import { type FallbackProps } from "react-error-boundary";
import { SaleorLogo } from "@/checkout/assets/images/SaleorLogo";
import { Button } from "@/checkout/components/Button";

export const PageNotFound = ({ error }: Partial<FallbackProps>) => {
	console.error(error);

	// eslint-disable-next-line no-restricted-globals
	const goBack = () => history.back();

	return (
		<div className="mx-auto flex max-w-screen-sm flex-col items-center gap-y-4 bg-neutral-50 px-8 py-16 text-center">
			<div className="mb-4 flex w-28 flex-col">
				<SaleorLogo />
			</div>
			<p>We couldn&apos;t fetch information about your checkout. Go back to the store and try again.</p>
			<Button ariaLabel="Go back to store" onClick={goBack} variant="secondary" label="Go back to store" />
		</div>
	);
};
