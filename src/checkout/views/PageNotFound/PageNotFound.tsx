import { type FallbackProps } from "react-error-boundary";
import { SaleorLogo } from "@/checkout/assets/images/SaleorLogo";
import { Button } from "@/checkout/components/Button";
import { ErrorContentWrapper } from "@/checkout/components/ErrorContentWrapper";

export const PageNotFound = ({ error }: Partial<FallbackProps>) => {
	console.error("PageNotFound Error:", error);

	// Add detailed debugging information
	console.error("PageNotFound - Full error details:", JSON.stringify(error, null, 2));
	console.error("PageNotFound - Error stack:", (error as Error)?.stack);
	console.error("PageNotFound - Error message:", (error as Error)?.message);

	// eslint-disable-next-line no-restricted-globals
	const goBack = () => history.back();

	return (
		<ErrorContentWrapper>
			<div className="mb-4 flex w-28 flex-col">
				<SaleorLogo />
			</div>
			<p>We couldn&apos;t fetch information about your checkout. Go back to the store and try again.</p>
			{/* Add debug info in development */}
			{process.env.NODE_ENV === "development" && error && (
				<div className="mt-4 rounded border border-red-400 bg-red-100 p-4 text-sm">
					<p className="font-bold">Debug Info:</p>
					<p>Error: {(error as Error)?.message || "Unknown error"}</p>
					<pre className="mt-2 overflow-auto text-xs">{JSON.stringify(error, null, 2)}</pre>
				</div>
			)}
			<Button ariaLabel="Go back to store" onClick={goBack} variant="secondary" label="Go back to store" />
		</ErrorContentWrapper>
	);
};
