export const productsToSearch = {
  product: Cypress.env("productToSearch"),
  nonExistingProduct: "!@#$%",
  noProductsInfo: "Search query didn't return any viable results",
  productWithVariants: Cypress.env("productWithVariants"),
  productWithoutVariants: Cypress.env("productWithoutVariants"),
  digitalProduct: Cypress.env("digitalProduct"),
};
