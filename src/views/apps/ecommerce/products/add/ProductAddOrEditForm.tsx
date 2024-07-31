"use client";

// MUI Imports
import { useEffect, useMemo, useState, type FC } from "react";

import Grid from "@mui/material/Grid";

// Third-party Imports
import { useFieldArray, useForm } from "react-hook-form";
import {
  object,
  minLength,
  string,
  pipe,
  nonEmpty,
  array,
  file,
} from "valibot";

// Components Imports
import { valibotResolver } from "@hookform/resolvers/valibot";

import { toast } from "react-toastify";

import ProductAddHeader from "@views/apps/ecommerce/products/add/ProductAddHeader";
import ProductInformation from "@views/apps/ecommerce/products/add/ProductInformation";
import ProductVariants from "@views/apps/ecommerce/products/add/ProductVariants";
import ProductOrganize from "@views/apps/ecommerce/products/add/ProductOrganize";
import {
  createProduct,
  createVariant,
  updateProduct,
} from "@/app/server/actions";
import type { Product } from "@/entities/product.entity";
import {
  createFilesFromUrls,
  extractFileNameFromCloudinaryUrl,
} from "@/utils/createFileFromUrl";
import { getChangedFields } from "@/utils/getChangedFields";

export type Variant = {
  fragrance: string;
  stock: string;
  price: string;
  discountedPrice?: string;
  discountedFrom?: string;
  discountedTo?: string;
  images: File[];
};

export const defaultVariant = {
  fragrance: "",
  stock: "",
  price: "",
  discountedPrice: "",
  discountedFrom: undefined,
  discountedTo: undefined,
  images: [],
};

export type AddProductFormValues = {
  vi_name: string;
  en_name: string;
  vi_description: string;
  en_description: string;
  category: string;
  status: string;
  variants: Variant[];
};

const variantSchema = object({
  fragrance: pipe(string(), minLength(1, "Variant fragrance is required")),
  stock: pipe(string(), minLength(1, "Variant stock quantity is required")),
  price: pipe(string(), minLength(1, "Variant base price is required")),
  images: pipe(array(file()), minLength(1, "Variant images cannot be empty")),
});

const schema = object({
  vi_name: pipe(string(), minLength(1, "This field is required")),
  en_name: pipe(
    string(),
    nonEmpty("This field is required"),
    minLength(1, "This field is required"),
  ),
  vi_description: pipe(string(), minLength(1, "This field is required")),
  en_description: pipe(string(), minLength(1, "This field is required")),
  category: pipe(string(), minLength(1, "This field is required")),
  status: pipe(string(), minLength(1, "This field is required")),
  variants: pipe(
    array(variantSchema),
    minLength(1, "Variants cannot be empty"),
  ),
});

interface Props {
  initialProductData?: Product;
}

const ProductAddOrEditForm: FC<Props> = ({
  initialProductData,
}): JSX.Element => {
  // State
  const [loading, setLoading] = useState(false);

  // Flag
  const isEdit = useMemo(() => !!initialProductData, [initialProductData]);

  // Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddProductFormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      vi_name: "",
      en_name: "",
      vi_description: "",
      en_description: "",
      category: "",
      status: "",
      variants: [defaultVariant],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control,
  });

  // Handle Form Submit
  const handleFormSubmit = async (formValues: AddProductFormValues) => {
    if (formValues.variants.length === 0) {
      return toast.error("Please upload at least one image");
    }

    const formData = new FormData();

    setLoading(true);

    if (isEdit) {
      const formattedInitialProductData = {
        ...initialProductData,
        vi_name: initialProductData?.name.vi,
        en_name: initialProductData?.name.en,
        en_description: initialProductData?.description.en,
        vi_description: initialProductData?.description.vi,
        category: initialProductData?.category?._id,
        files: initialProductData?.images?.map((url) =>
          extractFileNameFromCloudinaryUrl(url),
        ),

        status: initialProductData?.status,

        // Remove _id to compare
        variants: initialProductData?.variants?.map((variant) => ({
          fragrance: variant.fragrance,
          stock: variant.stock,
          price: variant.price,
          discountedPrice: variant.discountedPrice,
        })),
      };

      const formattedFormValues = {
        ...formValues,
        variants: formValues.variants.map((item) => ({
          ...item,
          discountedPrice: item.discountedPrice ? item.discountedPrice : "0",
        })),
      };

      const changedFields = getChangedFields({
        initialFormData: formattedInitialProductData,
        currentFormData: formattedFormValues,
      });

      if (Object.keys(changedFields).length === 0) {
        setLoading(false);

        return toast.error("No changes made to the product");
      }

      if (initialProductData?._id) {
        formData.append("_id", initialProductData._id);
      }

      if (changedFields.en_name) {
        formData.append("name[en]", formValues.en_name);
      }

      if (changedFields.vi_name) {
        formData.append("name[vi]", formValues.vi_name);
      }

      if (changedFields.en_description) {
        formData.append("description[en]", formValues.en_description);
      }

      if (changedFields.vi_description) {
        formData.append("description[vi]", formValues.vi_description);
      }

      if (changedFields.category) {
        formData.append("category", formValues.category);
      }

      if (changedFields.status) {
        formData.append("status", formValues.status);
      }

      if (changedFields.variants) {
        formData.append(
          "variants",
          JSON.stringify(
            formValues.variants.map((item) => ({
              ...item,
              discountedPrice: item.discountedPrice
                ? Number(item.discountedPrice)
                : 0,
              price: Number(item.price),
              stock: Number(item.stock),
            })),
          ),
        );
      }

      try {
        const result = await updateProduct(formData);

        if (result.ok) {
          toast.success("Update product successfully");
          window.location.replace("/products/list");
        } else {
          console.log;
          toast.error(result?.error);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    } else {
      const variants: string[] = [];

      for (const variant of formValues.variants) {
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
            toast.error("Please provide discount duration");

            return;
          }

          variantFormData.append(
            "discountedFrom",
            String(variant.discountedFrom),
          );
          variantFormData.append("discountedTo", String(variant.discountedTo));
        }

        try {
          const result = await createVariant(variantFormData);

          if (result.ok) {
            variants.push(result.variant._id);
          } else {
            return toast.error(result?.error);
          }
        } catch (error: any) {
          return toast.error(error?.message);
        }
      }

      const productData = {
        name: {
          en: formValues.en_name,
          vi: formValues.vi_name,
        },
        description: {
          en: formValues.en_description,
          vi: formValues.vi_description,
        },
        category: formValues.category,
        status: formValues.status,
        variants,
      };

      try {
        const result = await createProduct(productData);

        if (result.ok) {
          toast.success("Create product successfully");
          window.location.replace("/products/list");
        } else {
          toast.error(result?.error);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }

    setLoading(false);
  };

  // Handle Form Reset
  useEffect(() => {
    const setInitialValues = async () => {
      if (initialProductData) {
        setValue("vi_name", initialProductData?.name?.vi);
        setValue("en_name", initialProductData?.name?.en);
        setValue("vi_description", initialProductData?.description?.vi);
        setValue("en_description", initialProductData?.description?.en);
        setValue("category", initialProductData?.category._id);
        setValue("status", initialProductData?.status);

        const variantsWithFiles = await Promise.all(
          initialProductData.variants.map(async (variant) => {
            const files = await createFilesFromUrls(variant.images as any);

            return {
              ...variant,
              images: files,
            };
          }),
        );

        setValue("variants", variantsWithFiles);
      }
    };

    setInitialValues();
  }, [initialProductData, setValue]);

  return (
    <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
      <Grid item xs={12} mb={6}>
        <ProductAddHeader loading={loading} isEdit={isEdit} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ProductInformation
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          </Grid>
          <Grid item xs={12}>
            <ProductOrganize control={control} errors={errors} />
          </Grid>

          <Grid item xs={12}>
            <ProductVariants
              fields={fields}
              append={append}
              remove={remove}
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductAddOrEditForm;
