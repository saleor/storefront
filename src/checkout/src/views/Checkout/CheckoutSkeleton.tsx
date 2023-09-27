import { CheckoutFormSkeleton } from "@/checkout/src/sections/CheckoutForm";
import { PageHeader } from "@/checkout/src/sections/PageHeader";
import { SummarySkeleton } from "@/checkout/src/sections/Summary";

export const CheckoutSkeleton = () => (
	<div className="min-h-screen px-4 lg:px-0">
		<div className="px-4 md:px-12 xl:px-16">
			<PageHeader />
			<div className="box-border flex w-full flex-col-reverse lg:flex-row lg:items-start">
				<CheckoutFormSkeleton />
				<div className="h-6 w-full lg:h-full lg:w-5" />
				<SummarySkeleton />
			</div>
		</div>
	</div>
);
