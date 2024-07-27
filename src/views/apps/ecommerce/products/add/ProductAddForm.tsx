"use client";

// MUI Imports
import { useState, type FC } from "react";

import Grid from "@mui/material/Grid";

// Third-party Imports
import { useForm } from "react-hook-form";

import ProductAddHeader from "@views/apps/ecommerce/products/add/ProductAddHeader";
import ProductInformation from "@views/apps/ecommerce/products/add/ProductInformation";
import ProductImage from "@views/apps/ecommerce/products/add/ProductImage";
import ProductVariants from "@views/apps/ecommerce/products/add/ProductVariants";
import ProductOrganize from "@views/apps/ecommerce/products/add/ProductOrganize";

export type Variant = {
  color: string;
  stock: string;
  price: string;
  discountedPrice?: string;
};

export const defaultVariant = {
  color: "",
  stock: "0",
  price: "0",
  discountedPrice: "0",
};

export type AddProductFormValues = {
  vi_name: string;
  en_name: string;
  vi_description: string;
  en_description: string;
};

interface Props {}

const ProductAddForm: FC<Props> = (props): JSX.Element => {
  // State
  const [description, setDescription] = useState({ vi: "", en: "" });
  const [files, setFiles] = useState<File[]>([]);

  const [variants, setVariants] = useState<Variant[]>([defaultVariant]);

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductFormValues>({
    defaultValues: {
      vi_name: "",
      en_name: "",
      vi_description: "",
      en_description: "",
    },
  });

  // Handle Form Submit
  const handleFormSubmit = async (formValues: AddProductFormValues) => {
    handleReset();
  };

  // Handle Form Reset
  const handleReset = () => {
    resetForm({
      vi_name: "",
      en_name: "",
      vi_description: "",
      en_description: "",
    });

    setVariants([defaultVariant]);
  };

  return (
    <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
      <Grid item xs={12} mb={6}>
        <ProductAddHeader />
      </Grid>
      <Grid item xs={12} md={8}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ProductInformation
              control={control}
              errors={errors}
              description={description}
              setDescription={setDescription}
            />
          </Grid>
          <Grid item xs={12}>
            <ProductOrganize />
          </Grid>
          <Grid item xs={12}>
            <ProductImage files={files} setFiles={setFiles} />
          </Grid>
          <Grid item xs={12}>
            <ProductVariants variants={variants} setVariants={setVariants} />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductAddForm;
