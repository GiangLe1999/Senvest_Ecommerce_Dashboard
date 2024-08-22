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
  optional,
  date,
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
  removeProductVideos,
  updateProduct,
  updateProductVideos,
  uploadProductVideos,
} from "@/app/server/actions";
import type { Product } from "@/entities/product.entity";
import {
  createFilesFromUrls,
  extractFileNameFromCloudinaryUrl,
} from "@/utils/createFileFromUrl";
import { getChangedFields } from "@/utils/getChangedFields";
import { updateProductVariant } from "@/utils/updateProductVariants";

export type Variant = {
  _id?: string;
  fragrance: string;
  stock: string;
  price: string;
  discountedPrice?: string;
  discountedFrom?: Date;
  discountedTo?: Date;
  video?: string[];
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
  videos: File[];
  variants: Variant[];
};

const variantSchema = object({
  _id: optional(string()),
  fragrance: pipe(string(), minLength(1, "Variant fragrance is required")),
  stock: pipe(string(), minLength(1, "Variant stock quantity is required")),
  price: pipe(string(), minLength(1, "Variant base price is required")),
  images: pipe(array(file()), minLength(1, "Variant images cannot be empty")),
  discountedPrice: optional(string()),
  discountedFrom: optional(date()),
  discountedTo: optional(date()),
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
  videos: optional(array(file())),
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
      videos: [],
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

    if (isEdit && initialProductData) {
      const initialVariantsData = {
        variants: initialProductData.variants.map((variant) => {
          return {
            _id: variant._id,
            fragrance: variant.fragrance,
            stock: variant.stock,
            price: variant.price,
            ...(variant?.discountedPrice && {
              discountedPrice: variant.discountedPrice,
            }),
            ...(variant?.discountedFrom && {
              discountedFrom: new Date(variant.discountedFrom).toISOString(),
            }),
            ...(variant?.discountedTo && {
              discountedTo: new Date(variant.discountedTo).toISOString(),
            }),
            images: variant.images.map((url) =>
              extractFileNameFromCloudinaryUrl(url as any),
            ),
          };
        }),
      };

      const formattedVariantsFormValues = {
        variants: formValues.variants.map((variant) => {
          return {
            ...variant,
            ...(variant?.discountedFrom && {
              discountedFrom: new Date(variant.discountedFrom).toISOString(),
            }),
            ...(variant?.discountedTo && {
              discountedTo: new Date(variant.discountedTo).toISOString(),
            }),
            images: variant.images.map((file) => file.name),
          };
        }),
      };


      const changedVariants = getChangedFields({
        initialFormData: initialVariantsData,
        currentFormData: formattedVariantsFormValues,
      });

      const formattedInitialProductData = {
        name: {
          vi: initialProductData?.name?.vi,
          en: initialProductData?.name?.en,
        },
        description: {
          vi: initialProductData?.description?.vi,
          en: initialProductData?.description?.en,
        },
        category: initialProductData?.category._id,
        status: initialProductData?.status,
        ...(initialProductData?.videos && {
          videos: initialProductData?.videos.map((url) =>
            extractFileNameFromCloudinaryUrl(url as any),
          ),
        }),
      };


      const formattedProductFormValues = {
        name: {
          vi: formValues.vi_name,
          en: formValues.en_name,
        },
        description: {
          vi: formValues.vi_description,
          en: formValues.en_description,
        },
        category: formValues.category,
        status: formValues.status,
        ...(formValues.videos && {
          videos: formValues.videos.map((file) => file.name),
        }),
      };


      const productChangedFields = getChangedFields({
        initialFormData: formattedInitialProductData,
        currentFormData: formattedProductFormValues,
      });

      if (
        Object.keys(productChangedFields).length === 0 &&
        Object.keys(changedVariants).length === 0
      ) {
        return toast.error("No changes made to the product");
      }

      setLoading(true);

      if (Object.keys(changedVariants).length > 0) {
        try {
          if (productChangedFields?.videos) {
            const formData = new FormData();

            if (formValues?.videos?.length > 0) {
              formValues.videos.forEach((file) => {
                formData.append("files", file);
              });

              formData.append("_id", initialProductData._id);

              try {
                const result = await updateProductVideos(formData);

                if (!result.ok) {
                  setLoading(false);

                  return toast.error(result?.error);
                }
              } catch (error) {
                console.log(error);
                setLoading(false);

                return toast.error("Something went wrong");
              }
            } else {
              try {
                await removeProductVideos(initialProductData._id);
              } catch (error) {
                console.log("Error removing product videos");
              }
            }
          }

          if (productChangedFields?.videos) {
            delete productChangedFields.videos;
          }

          const updateVariantsPromises = formValues.variants.map((variant: any) =>
            updateProductVariant(
              {_id: variant._id, ...variant},
            )
          );

          const updateVariantsResults = await Promise.all(updateVariantsPromises);

          updateVariantsResults.forEach((result : any) => {
            if (!result.ok) {
              console.error("Error updating variant");
            }
          });

          try {
            const result = await updateProduct({
              ...productChangedFields,
              _id: initialProductData._id,
            });

            if (result.ok) {
              toast.success("Update product successfully");
              setLoading(false);
              window.location.replace("/products/list");
            } else {
              setLoading(false);

              return toast.error(result?.error);
            }
          } catch (error) {
            setLoading(false);
            console.log(error);

            return toast.error("Something went wrong");
          }
        } catch (error) {
          setLoading(false);
          console.log(error);

          return toast.error("Something went wrong");
        }
      } else {
        try {
          if (productChangedFields?.videos) {
            const formData = new FormData();

            if (formValues?.videos?.length > 0) {
              formValues.videos.forEach((file) => {
                formData.append("files", file);
              });

              formData.append("_id", initialProductData._id);

              try {
                const result = await updateProductVideos(formData);

                if (!result.ok) {
                  setLoading(false);

                  return toast.error(result?.error);
                }
              } catch (error) {
                console.log(error);
                setLoading(false);

                return toast.error("Something went wrong");
              }
            } else {
              try {
                await removeProductVideos(initialProductData._id);
              } catch (error) {
                console.log("Error removing product videos");
              }
            }
          }

          if (productChangedFields?.videos) {
            delete productChangedFields.videos;
          }

          const result = await updateProduct({
            ...productChangedFields,
            _id: initialProductData._id,
          });

          if (result.ok) {
            toast.success("Update product successfully");
            window.location.replace("/products/list");
          } else {
            setLoading(false);

            return toast.error(result?.error);
          }
        } catch (error) {
          setLoading(false);
          console.log(error);

          return toast.error("Something went wrong");
        }
      }
    } else {
      setLoading(true);

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
            return toast.error("Please provide discount duration");
          }

          const discountedFromISO = new Date(
            variant.discountedFrom,
          ).toISOString();

          const discountedToISO = new Date(variant.discountedTo).toISOString();

          variantFormData.append("discountedFrom", discountedFromISO);
          variantFormData.append("discountedTo", discountedToISO);
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
          if (formValues?.videos.length > 0) {
            const formData = new FormData();

            formValues.videos.forEach((file) => {
              formData.append("files", file);
            });

            formData.append("_id", result.product._id);

            try {
              const uploadVideosResult = await uploadProductVideos(formData);

              if (uploadVideosResult.ok) {
                toast.success("Create product successfully");
                window.location.replace("/products/list");
              } else {
                return toast.error(result?.error);
              }
            } catch (error) {
              return toast.error(result?.error);
            }
          } else {
            toast.success("Create product successfully");
            window.location.replace("/products/list");
          }
        } else {
          return toast.error(result?.error);
        }
      } catch (error) {
        console.log(error);

        return toast.error("Something went wrong");
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

        if (initialProductData?.videos) {
          createFilesFromUrls(initialProductData?.videos).then((files) => {
            setValue("videos", files);
          });
        }

        const variantsWithFiles = await Promise.all(
          initialProductData.variants.map(async (variant) => {
            const files = await createFilesFromUrls(variant.images as any);

            return {
              ...variant,
              ...(variant?.discountedFrom && {
                discountedFrom: new Date(variant.discountedFrom),
              }),
              ...(variant?.discountedTo && {
                discountedTo: new Date(variant.discountedTo),
              }),
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
