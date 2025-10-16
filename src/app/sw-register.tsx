"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
	useEffect(() => {
		if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
			void navigator.serviceWorker
				.register("/sw.js")
				.then((registration) => {
					console.log("Service Worker registered:", registration);

					// Check for updates periodically
					setInterval(() => {
						void registration.update();
					}, 60000); // Check every minute

					// Handle updates
					registration.addEventListener("updatefound", () => {
						const newWorker = registration.installing;
						if (!newWorker) return;

						newWorker.addEventListener("statechange", () => {
							if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
								// New service worker available, could show update notification
								console.log("New service worker available");
							}
						});
					});
				})
				.catch((error) => {
					console.error("Service Worker registration failed:", error);
				});
		}
	}, []);

	return null;
}
