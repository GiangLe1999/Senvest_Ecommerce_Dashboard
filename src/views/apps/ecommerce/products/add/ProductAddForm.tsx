"use client";

// MUI Imports
import { useState, type FC } from "react";

import Grid from "@mui/material/Grid";

// Third-party Imports
import { useFieldArray, useForm } from "react-hook-form";
import { object, minLength, string, pipe, nonEmpty, array } from "valibot";

// Components Imports
import { valibotResolver } from "@hookform/resolvers/valibot";

import { toast } from "react-toastify";

import ProductAddHeader from "@views/apps/ecommerce/products/add/ProductAddHeader";
import ProductInformation from "@views/apps/ecommerce/products/add/ProductInformation";
import ProductImage from "@views/apps/ecommerce/products/add/ProductImage";
import ProductVariants from "@views/apps/ecommerce/products/add/ProductVariants";
import ProductOrganize from "@views/apps/ecommerce/products/add/ProductOrganize";
import { createProduct } from "@/app/server/actions";

export type Variant = {
  color: string;
  stock: string;
  price: string;
  discountedPrice?: string;
};

export const defaultVariant = {
  color: "",
  stock: "",
  price: "",
  discountedPrice: "",
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
  color: pipe(string(), minLength(1, "Variant color is required")),
  stock: pipe(string(), minLength(1, "Variant stock quantity is required")),
  price: pipe(string(), minLength(1, "Variant base price is required")),
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
  variants: pipe(
    array(variantSchema),
    minLength(1, "Variants cannot be empty"),
  ),
});

interface Props {}

const ProductAddForm: FC<Props> = (): JSX.Element => {
  // State
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Hooks
  const {
    control,
    reset: resetForm,
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
    if (files.length === 0) {
      return toast.error("Please upload at least one image");
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("name[en]", formValues.en_name);
    formData.append("name[vi]", formValues.vi_name);
    formData.append("description[en]", formValues.en_description);
    formData.append("description[vi]", formValues.vi_description);
    formData.append(
      "status",
      formValues.status ? formValues.status : "Published",
    );
    formData.append("category", formValues.category);
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

    setLoading(true);

    try {
      const result = await createProduct(formData);

      if (result.ok) {
        toast.success("Create product successfully");
      } else {
        console.log;
        toast.error(result?.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);

    handleReset();
  };

  // Handle Form Reset
  const handleReset = () => {
    resetForm({
      vi_name: "",
      en_name: "",
      vi_description: "",
      en_description: "",
      category: "",
      status: "",
      variants: [defaultVariant],
    });
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
      <Grid item xs={12} mb={6}>
        <ProductAddHeader loading={loading} />
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
            <ProductImage files={files} setFiles={setFiles} />
          </Grid>
          <Grid item xs={12}>
            <ProductVariants
              fields={fields}
              append={append}
              remove={remove}
              control={control}
              errors={errors}
            />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductAddForm;
