import { Loader } from "@/ui/atoms/Loader";

export default function Loading() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<Loader />
		</div>
	);
}
