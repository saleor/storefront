import { useIntl } from "react-intl";
import { paymentSectionMessages } from "./messages";

interface CompleteCheckoutButtonProps {
  isDisabled: boolean;
  isProcessing: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function CompleteCheckoutButton({
  isDisabled,
  isProcessing,
  children,
  onClick,
}: CompleteCheckoutButtonProps) {
  const t = useIntl();

  const getButtonStyles = () => {
    if (isProcessing) {
      return { backgroundColor: "#03C988", color: "#fff" };
    }
    if (isDisabled) {
      return { backgroundColor: "lightgray", color: "#fff" };
    }
    return { backgroundColor: "green", color: "#fff" };
  };

  const getButtonClassNames = () => {
    if (isProcessing) {
      return "w-full mt-6 border border-transparent rounded-md shadow-sm py-2 px-4 text-base font-medium text-white flex items-center justify-center gap-4";
    }
    return "w-full mb-4 border border-transparent rounded-md shadow-sm py-2 px-4 text-lg font-medium text-white hover:bg-green-600 flex items-center justify-center transition";
  };
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      type={isProcessing ? "button" : "submit"}
      className={getButtonClassNames()}
      style={getButtonStyles()}
    >
      {isProcessing ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {t.formatMessage(paymentSectionMessages.processingPayment)}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default CompleteCheckoutButton;
