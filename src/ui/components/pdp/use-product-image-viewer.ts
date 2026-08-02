"use client";

import * as React from "react";

/** Local open/close state for the fullscreen product image viewer. */
export function useProductImageViewer(imagesKey: string) {
	const [viewerIndex, setViewerIndex] = React.useState<number | null>(null);

	React.useEffect(() => {
		setViewerIndex(null);
	}, [imagesKey]);

	return {
		viewerIndex,
		isViewerOpen: viewerIndex !== null,
		openViewer: setViewerIndex,
		onViewerOpenChange: (open: boolean) => {
			if (!open) setViewerIndex(null);
		},
	};
}
