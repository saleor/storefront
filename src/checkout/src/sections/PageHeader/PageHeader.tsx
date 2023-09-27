import { SaleorLogo } from "@/checkout/src/assets/images/SaleorLogo";
import { LanguageSelect } from "@/checkout/src/sections/PageHeader/LanguageSelect";

export const PageHeader = () => {
	return (
		<div className="mb-6 flex flex-row items-center justify-between md:mb-12">
			<SaleorLogo />
			<LanguageSelect />
		</div>
	);
};
