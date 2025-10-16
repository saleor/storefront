import { useState, useEffect } from "react";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import clsx from "clsx";

export interface QuantitySelectorProps {
	/** Current quantity value */
	value: number;
	/** Minimum allowed quantity (default: 0) */
	min?: number;
	/** Maximum allowed quantity (default: 999) */
	max?: number;
	/** Called when quantity changes */
	onChange: (quantity: number) => void;
	/** Called when quantity is set to 0 (delete action) */
	onDelete?: () => void;
	/** Whether the control is disabled */
	disabled?: boolean;
	/** Whether the control is in a loading state */
	loading?: boolean;
	/** Size variant */
	size?: "sm" | "md" | "lg";
	/** Optional test id */
	"data-testid"?: string;
}

/**
 * Quantity selector with increment/decrement buttons and input field.
 * Includes validation to prevent negative numbers and other exploits.
 */
export const QuantitySelector = ({
	value,
	min = 0,
	max = 999,
	onChange,
	onDelete,
	disabled = false,
	loading = false,
	size = "md",
	"data-testid": dataTestId,
}: QuantitySelectorProps) => {
	const [inputValue, setInputValue] = useState(String(value));
	const [isFocused, setIsFocused] = useState(false);

	// Sync internal state with external value when not focused
	useEffect(() => {
		if (!isFocused) {
			setInputValue(String(value));
		}
	}, [value, isFocused]);

	// Validate and sanitize quantity
	const sanitizeQuantity = (qty: number): number => {
		// Remove any decimal places
		const intQty = Math.floor(qty);

		// Clamp between min and max
		return Math.max(min, Math.min(max, intQty));
	};

	const handleDecrement = () => {
		if (disabled || loading) return;

		const newQuantity = sanitizeQuantity(value - 1);

		if (newQuantity === 0 && onDelete) {
			onDelete();
		} else {
			onChange(newQuantity);
		}
	};

	const handleIncrement = () => {
		if (disabled || loading) return;

		const newQuantity = sanitizeQuantity(value + 1);
		onChange(newQuantity);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;

		// Allow empty string while typing
		if (rawValue === "") {
			setInputValue("");
			return;
		}

		// Remove any non-digit characters
		const digitsOnly = rawValue.replace(/\D/g, "");

		// Update input display
		setInputValue(digitsOnly);
	};

	const handleInputBlur = () => {
		setIsFocused(false);

		// Parse the input value
		const numValue = parseInt(inputValue, 10);

		// If empty or invalid, revert to current value
		if (inputValue === "" || Number.isNaN(numValue)) {
			setInputValue(String(value));
			return;
		}

		// Sanitize and apply
		const sanitizedValue = sanitizeQuantity(numValue);

		if (sanitizedValue === 0 && onDelete) {
			onDelete();
		} else if (sanitizedValue !== value) {
			onChange(sanitizedValue);
		} else {
			// Ensure input shows sanitized value
			setInputValue(String(sanitizedValue));
		}
	};

	const handleInputFocus = () => {
		setIsFocused(true);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// Prevent non-numeric keys (except control keys)
		if (
			!/^\d$/.test(e.key) &&
			!["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
		) {
			e.preventDefault();
		}

		// Submit on Enter
		if (e.key === "Enter") {
			e.currentTarget.blur();
		}
	};

	const sizeClasses = {
		sm: {
			button: "h-7 w-7 text-xs",
			input: "h-7 w-12 text-sm",
		},
		md: {
			button: "h-9 w-9 text-sm",
			input: "h-9 w-14 text-base",
		},
		lg: {
			button: "h-11 w-11 text-base",
			input: "h-11 w-16 text-lg",
		},
	};

	const isAtMin = value <= min;
	const isAtMax = value >= max;

	return (
		<div
			className="flex items-center gap-2"
			data-testid={dataTestId}
		>
			{/* Decrement button */}
			<button
				type="button"
				onClick={handleDecrement}
				disabled={disabled || loading || isAtMin}
				className={clsx(
					"flex items-center justify-center rounded-md border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
					sizeClasses[size].button,
					{
						"border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100":
							!disabled && !loading && !isAtMin,
						"border-red-300 bg-white text-red-600 hover:bg-red-50 active:bg-red-100":
							!disabled && !loading && isAtMin && onDelete,
						"cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400":
							disabled || loading || (isAtMin && !onDelete),
					},
				)}
				aria-label={isAtMin && onDelete ? "Remove item" : "Decrease quantity"}
			>
				{isAtMin && onDelete ? (
					<Trash2Icon className="h-4 w-4" />
				) : (
					<MinusIcon className="h-4 w-4" />
				)}
			</button>

			{/* Quantity input */}
			<input
				type="text"
				inputMode="numeric"
				pattern="\d*"
				value={inputValue}
				onChange={handleInputChange}
				onBlur={handleInputBlur}
				onFocus={handleInputFocus}
				onKeyDown={handleKeyDown}
				disabled={disabled || loading}
				className={clsx(
					"rounded-md border border-neutral-300 text-center font-medium transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200",
					sizeClasses[size].input,
					{
						"bg-white text-neutral-900": !disabled && !loading,
						"cursor-not-allowed bg-neutral-100 text-neutral-400": disabled || loading,
					},
				)}
				aria-label="Quantity"
				min={min}
				max={max}
			/>

			{/* Increment button */}
			<button
				type="button"
				onClick={handleIncrement}
				disabled={disabled || loading || isAtMax}
				className={clsx(
					"flex items-center justify-center rounded-md border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
					sizeClasses[size].button,
					{
						"border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100":
							!disabled && !loading && !isAtMax,
						"cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400":
							disabled || loading || isAtMax,
					},
				)}
				aria-label="Increase quantity"
			>
				<PlusIcon className="h-4 w-4" />
			</button>
		</div>
	);
};
