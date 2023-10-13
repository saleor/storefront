import { CheckIcon, XIcon } from "lucide-react";

type Props = {
	isAvailable: boolean;
};

const pClasses = "ml-1 text-sm font-semibold text-neutral-500";

export const AvailabilityMessage = ({ isAvailable }: Props) => {
	if (isAvailable) {
		return (
			<div className="mt-6 flex items-center">
				<CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
				<p className={pClasses}>In stock</p>
			</div>
		);
	}
	return (
		<div className="mt-6 flex items-center">
			<XIcon className="h-5 w-5 flex-shrink-0 text-red-500" aria-hidden="true" />
			<p className={pClasses}>Out of stock</p>
		</div>
	);
};
