import type messages from "../../messages/en.json";

// Type-safe `useTranslations`/`getTranslations` keys — `en.json` is the source of truth.
declare module "next-intl" {
	interface AppConfig {
		Messages: typeof messages;
	}
}
