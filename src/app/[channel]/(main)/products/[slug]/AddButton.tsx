"use client";

import { useFormStatus } from "react-dom";

export function AddButton({ disabled }: { disabled?: boolean }) {
	const { pending } = useFormStatus();
	const isButtonDisabled = disabled || pending;

	return (
		<button
			type="submit"
			aria-disabled={isButtonDisabled}
			aria-busy={pending}
			aria-label={pending ? "Adding to cart" : "Add to cart"}
			onClick={(e) => isButtonDisabled && e.preventDefault()}
			className="btn-primary h-14 w-full text-base font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
		>
			{pending ? (
				<span className="inline-flex items-center gap-3">
					<svg
						className="h-5 w-5 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<span>Adding to Cart...</span>
				</span>
			) : (
				<span>Add to Cart</span>
			)}
		</button>
	);
}
