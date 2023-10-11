import clsx from "clsx";
import { type TypeOptions } from "react-toastify";

export const alertsContainerProps = {
	toastClassName: "rounded shadow-none mb-2 p-0 flex font-sans text-base text-gray-900 min-h-0 bg-white",
	bodyClassName: (data?: { type?: TypeOptions }) =>
		clsx("flex w-full items-start px-5 py-3", {
			["bg-red-400"]: data?.type === "error",
			["bg-green-400"]: data?.type === "success",
		}),
	autoClose: 4000,
	hideProgressBar: true,
	closeButton: () => null,
	closeOnClick: false,
};
