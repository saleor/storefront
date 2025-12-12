import { MessageCircle } from "lucide-react";
import { getShopInfo } from "@/lib/content";

export async function WhatsAppButton() {
	const shopInfo = await getShopInfo();

	// Only render if WhatsApp is configured
	if (!shopInfo.whatsApp) {
		return null;
	}

	const { phoneNumber, message } = shopInfo.whatsApp;
	const whatsAppUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
		message,
	)}`;
	const tooltip = "Chat with us on WhatsApp";

	return (
		<a
			href={whatsAppUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
			aria-label={tooltip}
			title={tooltip}
		>
			<MessageCircle className="h-7 w-7" />
		</a>
	);
}
