import { updateVariant } from "@/app/server/actions";

export const updateProductVariant = async (variant: any) => {
    const variantFormData = new FormData();

    if (variant.images) {
      variant.images.forEach((file : any) => {
        variantFormData.append("files", file);
      });
    }

    variantFormData.append("_id", variant._id);

    if (variant.fragrance) {
      variantFormData.append("fragrance", variant.fragrance);
    }

    if (variant.stock) {
      variantFormData.append("stock", variant.stock);
    }

    if (variant.price) {
      variantFormData.append("price", variant.price);
    }

    if (variant.discountedPrice) {
      variantFormData.append("discountedPrice", variant.discountedPrice)
    }

    if (variant.discountedFrom) {
      const discountedFromISO = new Date(variant.discountedFrom).toISOString();

      variantFormData.append("discountedFrom", discountedFromISO);
    }


    if (variant.discountedTo) {
      const discountedToISO = new Date(variant.discountedTo).toISOString();

      variantFormData.append("discountedTo", discountedToISO);
    }

    const result = await updateVariant(variantFormData);

    if (result.ok) {
      return {ok: true}
    } else {
      throw new Error(result.error);
    }
};
