import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const key = "idempotencyKey";

export const useIdempotency = () => {
	const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined" && window.localStorage) {
			let idempotencyKey = localStorage.getItem(key);

			if (!idempotencyKey) {
				idempotencyKey = uuidv4();
				localStorage.setItem(key, idempotencyKey);
			}

			setIdempotencyKey(idempotencyKey);
		}
	}, []);

	const clearIdempotencyKey = () => {
		if (typeof window !== "undefined" && window.localStorage) {
			localStorage.removeItem(key);
			setIdempotencyKey(null);
		}
	};

	return { idempotencyKey, clearIdempotencyKey };
};
