"use client";

import type { Dispatch, FC, SetStateAction } from "react";

// MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";

// Third-party Imports
import { Controller, type Control } from "react-hook-form";

// Style Imports
import "@/libs/styles/tiptapEditor.css";
import type { AddProductFormValues } from "./ProductAddForm";
import ProductDescriptionEditor from "./ProductDescriptionEditor";

interface Props {
  control: Control<AddProductFormValues, any>;
  errors: any;
  description: { vi: string; en: string };
  setDescription: Dispatch<
    SetStateAction<{
      vi: string;
      en: string;
    }>
  >;
}

const ProductInformation: FC<Props> = ({
  control,
  errors,
  description,
  setDescription,
}) => {
  const updateViDescription = (html: string) => {
    setDescription((prev) => ({
      ...prev,
      vi: html,
    }));
  };

  const updateEnDescription = (html: string) => {
    setDescription((prev) => ({
      ...prev,
      en: html,
    }));
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
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Vietnamese name"
                  placeholder="Vietnamese name"
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
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="English name"
                  placeholder="English name"
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
            label="Vietnamese Description (Optional)"
            value={description.vi}
          />
          <ProductDescriptionEditor
            onUpdate={updateEnDescription}
            label="English Description (Optional)"
            value={description.en}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductInformation;
