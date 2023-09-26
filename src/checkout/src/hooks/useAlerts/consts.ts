import clsx from "clsx";
import { TypeOptions } from "react-toastify";

export const alertsContainerProps = {
  toastClassName: "alert-container",
  bodyClassName: (data?: { type?: TypeOptions }) =>
    clsx("alert", {
      ["alert-error"]: data?.type === "error",
      ["alert-success"]: data?.type === "success",
    }),
  autoClose: 4000,
  hideProgressBar: true,
  closeButton: () => null,
  closeOnClick: false,
};
