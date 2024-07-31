import { createVariant } from "@/app/server/actions";
import type { Variant } from "@/views/apps/ecommerce/products/add/ProductAddOrEditForm";

export const createProductVariants = async (formVariants: Variant[]) => {
  const variantIds: string[] = [];

  for (const variant of formVariants) {
    const variantFormData = new FormData();

    variant.images.forEach((file) => {
      variantFormData.append("files", file);
    });

    variantFormData.append("fragrance", variant.fragrance);
    variantFormData.append("stock", variant.stock);
    variantFormData.append("price", variant.price);

    if (variant.discountedPrice) {
      variantFormData.append("discountedPrice", variant.discountedPrice);

      if (!variant.discountedFrom || !variant.discountedTo) {
        throw new Error("Please provide discount duration");
      }

      const discountedFromISO = new Date(variant.discountedFrom).toISOString();

      const discountedToISO = new Date(variant.discountedTo).toISOString();

      variantFormData.append("discountedFrom", discountedFromISO);
      variantFormData.append("discountedTo", discountedToISO);
    }

    const result = await createVariant(variantFormData);

    if (result.ok) {
      variantIds.push(result.variant._id);
    } else {
      throw new Error(result.error);
    }
  }

  return variantIds;
};
