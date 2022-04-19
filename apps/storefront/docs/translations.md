# Translations

There are two types of translations:

- Translations that can be managed via Dashboard and are fetched from the API. For example, the name of a specific product.
- Interface translations. For example, the label on the "Add to cart" button.

## API translations

Documentation for the API can be found [here](https://docs.saleor.io/docs/3.x/developer/api-conventions/translations). The dashboard guide is located [here](https://docs.saleor.io/docs/3.x/dashboard/translations).

React Storefront has a helper for displaying translated fields called `translate` located in the `lib/translations.ts` file. The function will revert back to the default language if the API has no translation available.

## Interface translations

SRS uses [FormatJS](https://formatjs.io/) as a library for translating the interface. We recommend reading its [documentation](https://formatjs.io/docs/getting-started/application-workflow) if you haven't used it before.

Translation sources are located in the `locale` directory. Please note that SRS uses full language code names to differentiate between language dialects (e.g., en-US and `en-UK`).

### Adding new languages

1. Create a new json file in the `locale` directory
2. Add a language to the `LOCALES` constant in the `lib/regions.ts` file
3. Extend the `importMessages` function to import the proper json file based on chosen locale

### Translation management

Instead of editing files manually, we recommend using translation platforms like:

- [Transifex](https://www.transifex.com/)
- [POEditor](https://poeditor.com/)

There are multiple other online platforms and locally installed software to choose from. The only requirement is to use JSON files to synchronize.
