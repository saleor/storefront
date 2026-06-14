import { readFileSync, writeFileSync } from "node:fs";

/** Extra address field labels for checkout country-adaptive forms (shared with account). */
const FIELD_ADDITIONS = {
	en: {
		country: "Country",
		cityArea: "City area",
		localized: {
			province: "Province",
			district: "District",
			state: "State",
			zip: "Zip code",
			postal: "Postal code",
			postTown: "Post town",
			prefecture: "Prefecture",
		},
	},
	pl: {
		country: "Kraj",
		cityArea: "Dzielnica",
		localized: {
			province: "Prowincja",
			district: "Dystrykt",
			state: "Stan",
			zip: "Kod pocztowy",
			postal: "Kod pocztowy",
			postTown: "Miejscowość",
			prefecture: "Prefektura",
		},
	},
	de: {
		country: "Land",
		cityArea: "Stadtteil",
		localized: {
			province: "Provinz",
			district: "Bezirk",
			state: "Bundesland",
			zip: "Postleitzahl",
			postal: "Postleitzahl",
			postTown: "Ort",
			prefecture: "Präfektur",
		},
	},
	fr: {
		country: "Pays",
		cityArea: "Quartier",
		localized: {
			province: "Province",
			district: "District",
			state: "État",
			zip: "Code postal",
			postal: "Code postal",
			postTown: "Ville",
			prefecture: "Préfecture",
		},
	},
	fi: {
		country: "Maa",
		cityArea: "Kaupunginosa",
		localized: {
			province: "Maakunta",
			district: "Piiri",
			state: "Osavaltio",
			zip: "Postinumero",
			postal: "Postinumero",
			postTown: "Postitoimipaikka",
			prefecture: "Prefektuuri",
		},
	},
	nb: {
		country: "Land",
		cityArea: "Bydel",
		localized: {
			province: "Provins",
			district: "Distrikt",
			state: "Delstat",
			zip: "Postnummer",
			postal: "Postnummer",
			postTown: "Poststed",
			prefecture: "Prefektur",
		},
	},
};

for (const [locale, additions] of Object.entries(FIELD_ADDITIONS)) {
	const path = `messages/${locale}.json`;
	const messages = JSON.parse(readFileSync(path, "utf8"));
	Object.assign(messages.account.fields, additions);
	writeFileSync(path, JSON.stringify(messages, null, "\t") + "\n");
	console.log(`extended account.fields → ${path}`);
}
