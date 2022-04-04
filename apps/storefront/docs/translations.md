# Translations

There are 2 types of translations:

- translations which can be managed via Dashboard and are fetched from the API. For example: name of a certain product
- interface translations. For example label on "Add to cart" button

## API translations

Documentation for API can be found [here](https://docs.saleor.io/docs/3.x/developer/api-conventions/translations). Dashboard guide is located [here](https://docs.saleor.io/docs/3.x/dashboard/translations).

React Storefront has helper for displaying translated field called `translate` located in th `lib/translations.ts` file. Function will fall back to default language, if API has no translation available.

## Interface translations

SRS use [FormatJS](https://formatjs.io/) as a library for translating the interface. If you haven't used it before, we recommend reading it's [documentation](https://formatjs.io/docs/getting-started/application-workflow).

Translation sources are located at `locale` directory. Please note: SRS use full language code names to differentiate between language dialects (eg. `en-US` and `en-UK`).

### Adding new languages

1. Create a new json file in the `locale` directory
2. Add a language to the `LOCALES` constant in the `lib/regions.ts` file
3. Extend the `importMessages` function to import the proper json file based on chosen locale

### Translation management

Instead of editing file by hand, we recommend using translation platforms like:

- [Transifex](https://www.transifex.com/)
- [POEditor](https://poeditor.com/)

There are multiple other online platforms and locally installed software to choose from. The only requirement is to use JSON files to synchronize.
