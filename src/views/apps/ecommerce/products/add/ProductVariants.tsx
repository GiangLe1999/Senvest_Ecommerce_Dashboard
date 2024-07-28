"use client";

// React Imports
import type { FC } from "react";

// MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import type {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";

import type { AddProductFormValues } from "./ProductAddForm";
import { defaultVariant } from "./ProductAddForm";

import ProductVariant from "./ProductVariant";

interface Props {
  append: UseFieldArrayAppend<AddProductFormValues, "variants">;
  remove: UseFieldArrayRemove;
  control: Control<AddProductFormValues, any>;
  errors: FieldErrors<AddProductFormValues>;
  fields: FieldArrayWithId<AddProductFormValues, "variants", "id">[];
}

const ProductVariants: FC<Props> = ({
  fields,
  append,
  remove,
  control,
  errors,
}) => {
  const addNewVariant = () => {
    append(defaultVariant);
  };

  return (
    <Card>
      <CardHeader title="Variants" />
      <CardContent>
        <Grid container spacing={6}>
          {fields.map((field, index) => (
            <ProductVariant
              key={field.id}
              index={index}
              remove={remove}
              control={control}
              errors={errors}
              fieldsLength={fields.length}
            />
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={addNewVariant}
              startIcon={<i className="ri-add-line" />}
            >
              Add Another Option
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductVariants;
