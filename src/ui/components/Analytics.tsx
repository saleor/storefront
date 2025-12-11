"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// Google Analytics page view tracking
function GoogleAnalyticsPageView() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (!GA_MEASUREMENT_ID) return;

		const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
		
		// @ts-ignore
		window.gtag?.("config", GA_MEASUREMENT_ID, {
			page_path: url,
		});
	}, [pathname, searchParams]);

	return null;
}

// Facebook Pixel page view tracking
function FacebookPixelPageView() {
	const pathname = usePathname();

	useEffect(() => {
		if (!FB_PIXEL_ID) return;

		// @ts-ignore
		window.fbq?.("track", "PageView");
	}, [pathname]);

	return null;
}

export function Analytics() {
	return (
		<>
			{/* Google Analytics */}
			{GA_MEASUREMENT_ID && (
				<>
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
						strategy="afterInteractive"
					/>
					<Script id="google-analytics" strategy="afterInteractive">
						{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${GA_MEASUREMENT_ID}', {
								page_path: window.location.pathname,
							});
						`}
					</Script>
					<Suspense fallback={null}>
						<GoogleAnalyticsPageView />
					</Suspense>
				</>
			)}

			{/* Facebook Pixel */}
			{FB_PIXEL_ID && (
				<>
					<Script id="facebook-pixel" strategy="afterInteractive">
						{`
							!function(f,b,e,v,n,t,s)
							{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
							n.callMethod.apply(n,arguments):n.queue.push(arguments)};
							if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
							n.queue=[];t=b.createElement(e);t.async=!0;
							t.src=v;s=b.getElementsByTagName(e)[0];
							s.parentNode.insertBefore(t,s)}(window, document,'script',
							'https://connect.facebook.net/en_US/fbevents.js');
							fbq('init', '${FB_PIXEL_ID}');
							fbq('track', 'PageView');
						`}
					</Script>
					<noscript>
						<img
							height="1"
							width="1"
							style={{ display: "none" }}
							src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
							alt=""
						/>
					</noscript>
					<Suspense fallback={null}>
						<FacebookPixelPageView />
					</Suspense>
				</>
			)}
		</>
	);
}

// E-commerce event tracking helpers
export const trackEvent = {
	// Google Analytics events
	ga: {
		viewItem: (item: { id: string; name: string; price: number; currency: string }) => {
			// @ts-ignore
			window.gtag?.("event", "view_item", {
				currency: item.currency,
				value: item.price,
				items: [{ item_id: item.id, item_name: item.name, price: item.price }],
			});
		},
		addToCart: (item: { id: string; name: string; price: number; currency: string; quantity: number }) => {
			// @ts-ignore
			window.gtag?.("event", "add_to_cart", {
				currency: item.currency,
				value: item.price * item.quantity,
				items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity }],
			});
		},
		purchase: (transaction: { id: string; value: number; currency: string; items: any[] }) => {
			// @ts-ignore
			window.gtag?.("event", "purchase", {
				transaction_id: transaction.id,
				value: transaction.value,
				currency: transaction.currency,
				items: transaction.items,
			});
		},
	},
	// Facebook Pixel events
	fb: {
		viewContent: (item: { id: string; name: string; value: number; currency: string }) => {
			// @ts-ignore
			window.fbq?.("track", "ViewContent", {
				content_ids: [item.id],
				content_name: item.name,
				content_type: "product",
				value: item.value,
				currency: item.currency,
			});
		},
		addToCart: (item: { id: string; name: string; value: number; currency: string }) => {
			// @ts-ignore
			window.fbq?.("track", "AddToCart", {
				content_ids: [item.id],
				content_name: item.name,
				content_type: "product",
				value: item.value,
				currency: item.currency,
			});
		},
		purchase: (transaction: { value: number; currency: string; content_ids: string[] }) => {
			// @ts-ignore
			window.fbq?.("track", "Purchase", {
				value: transaction.value,
				currency: transaction.currency,
				content_ids: transaction.content_ids,
				content_type: "product",
			});
		},
	},
};
