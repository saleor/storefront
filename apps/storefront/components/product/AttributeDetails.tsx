import { getProductAttributes } from "@/lib/product";
import { translate } from "@/lib/translations";
import { ProductDetailsFragment, ProductVariantDetailsFragment } from "@/saleor/api";

export interface AttributeDetailsProps {
  product: ProductDetailsFragment;
  selectedVariant?: ProductVariantDetailsFragment;
}

export function AttributeDetails({ product, selectedVariant }: AttributeDetailsProps) {
  const attributes = getProductAttributes(product, selectedVariant);
  const { variants } = product;
  if (attributes.length === 0) {
    return null;
  }
  return (
    <div className="grid grid-cols-2">
      {attributes.map((attribute) => (
        <div key={attribute.attribute.id} className="w-max">
          <div>
            {attribute.values.map((value) => {
              if (!value) {
                return null;
              }
              return (
                <div key={value.id} className="prose-2xl text-3xl px-2">
                  <div className="flex flex-row gap-3 items-center">
                    <p>{translate(attribute.attribute, "name")}:</p>
                    {attribute.values.map((value) => value.name).join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {variants?.map((variant) => {
        if (!variant) {
          return null;
        }
        return (
          <div key={variant?.id} className="prose-2xl px-2">
            <div className="flex flex-row gap-3 items-center">
              <p>SKU: </p>
              {variant?.sku}
            </div>
          </div>
        );
      })}
    </div>
  );
}
