"use client";

import type { FC } from "react";

// MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";

// Third-party Imports
import {
  type UseFormSetValue,
  type UseFormWatch,
  type Control,
  Controller,
} from "react-hook-form";

// Style Imports
import "@/libs/styles/tiptapEditor.css";
import type { AddProductFormValues } from "./ProductAddOrEditForm";
import ProductDescriptionEditor from "./ProductDescriptionEditor";

interface Props {
  control: Control<AddProductFormValues, any>;
  errors: any;
  setValue: UseFormSetValue<AddProductFormValues>;
  watch: UseFormWatch<AddProductFormValues>;
}

const ProductInformation: FC<Props> = ({
  control,
  errors,
  setValue,
  watch,
}) => {
  const updateViDescription = (html: string) => {
    setValue("vi_description", html);
  };

  const updateEnDescription = (html: string) => {
    setValue("en_description", html);
  };

  return (
    <Card>
      <CardHeader title="Product Information" />
      <CardContent>
        <Grid container spacing={10} className="mbe-5">
          <Grid item xs={6}>
            <Controller
              name="vi_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Vietnamese Name"
                  placeholder="Vietnamese Name"
                  {...(errors.vi_name && {
                    error: true,
                    helperText: "This field is required.",
                  })}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="en_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="English Name"
                  placeholder="English Name"
                  {...(errors.en_name && {
                    error: true,
                    helperText: "This field is required.",
                  })}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={10}>
          <ProductDescriptionEditor
            onUpdate={updateViDescription}
            label="Vietnamese Description"
            value={watch("vi_description")}
            error={errors.vi_description}
          />
          <ProductDescriptionEditor
            onUpdate={updateEnDescription}
            label="English Description"
            value={watch("en_description")}
            error={errors.en_description}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductInformation;
