export const getProductCountDescription = (count: number) => {
  if (count === 1) {
    return "produkt";
  }

  if (count > 1 && count < 5) {
    return "produkty";
  }

  return "produktów";
};
