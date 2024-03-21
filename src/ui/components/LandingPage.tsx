import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

export const LandingPage = () => {
	return (
		<div className="h-20 w-20">
			<ProductImageWrapper
				src="https://static.wikia.nocookie.net/narnia/images/9/91/Narniadawntreader.png/revision/latest?cb=20101128130243"
				alt="Caspian King"
				width={512}
				height={512}
				sizes={"512px"}
				className="max-w-220 object-contain object-center"
			/>
		</div>
	);
};
