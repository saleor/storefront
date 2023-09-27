import { SaleorLogo } from "@/checkout/src/assets/images/SaleorLogo";
import { LanguageSelect } from "@/checkout/src/sections/PageHeader/LanguageSelect";

export const PageHeader = () => {
	return (
		<div className="page-header">
			<SaleorLogo />
			<LanguageSelect />
		</div>
	);
};
