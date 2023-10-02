import { useRef, useLayoutEffect, useCallback } from "react";

// https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
export const useEvent = <Args extends unknown[], R>(handler: (...args: Args) => R) => {
	const handlerRef = useRef<null | ((...args: Args) => R)>(null);

	useLayoutEffect(() => {
		handlerRef.current = handler;
	});

	return useCallback((...args: Args) => {
		return handlerRef.current?.(...args) as R;
	}, []);
};
