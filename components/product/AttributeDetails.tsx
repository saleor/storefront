import { getProductAttributes } from "@/lib/product";
import {
  ProductDetailsFragment,
  ProductVariantDetailsFragment,
} from "@/saleor/api";

export interface AttributeDetailsProps {
  product: ProductDetailsFragment;
  selectedVariant?: ProductVariantDetailsFragment;
}

export const AttributeDetails = ({
  product,
  selectedVariant,
}: AttributeDetailsProps) => {
  const attributes = getProductAttributes(product, selectedVariant);
  if (attributes.length === 0) {
    return <></>;
  }
  console.log(attributes);
  return (
    <div>
      <p className="text-lg mt-2 font-medium text-gray-500">Attributes</p>
      <div>
        {attributes.map((attribute) => (
          <div key={attribute.attribute.name} className="grid grid-cols-2">
            <div>
              <p>{attribute.attribute.name}</p>
            </div>
            <div>
              {attribute.values.map((value, index) => (
                <p key={index}>
                  {value?.name}
                  {attribute.values.length !== index + 1 && <div>{" | "}</div>}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
