import { LanguageSelect } from "@/checkout/sections/PageHeader/LanguageSelect";

export const PageHeader = () => {
	return (
		<div className="mb-6 flex flex-row items-center justify-between md:mb-12">
			<LanguageSelect />
		</div>
	);
};
