export const productsToSearch = {
  product: "polo",
  nonExistingProduct: "!@#$%",
  noProductsInfo: "Search query didn't return any viable results",
  productWithVariants: "T-shirt",
  productWithoutVariants: Cypress.env("productWithoutVariants"),
  digitalProduct: Cypress.env("digitalProduct"),

  //cloud db products:
  // need to figure out how to use correct fixtures in diffrent env as we cannot create new products in demo
  // digitalProduct: "sea",
  // productWithoutVariants: "Lager",
};
