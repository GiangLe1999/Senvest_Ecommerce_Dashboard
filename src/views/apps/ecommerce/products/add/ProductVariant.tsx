import type { FC } from "react";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import type {
  Control,
  FieldErrors,
  UseFieldArrayRemove,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { toast } from "react-toastify";

import CustomIconButton from "@core/components/mui/IconButton";
import type { AddProductFormValues } from "./ProductAddOrEditForm";

interface Props {
  index: number;
  remove: UseFieldArrayRemove;
  control: Control<AddProductFormValues, any>;
  errors: FieldErrors<AddProductFormValues>;
  fieldsLength: number;
}

const ProductVariant: FC<Props> = ({
  index,
  remove,
  control,
  errors,
  fieldsLength,
}): JSX.Element => {
  const removeVariant = () => {
    if (fieldsLength > 1) {
      remove(index);
    } else {
      toast.error("At least one variant is required");
    }
  };

  return (
    <Grid item xs={12} className="repeater-item">
      <Grid container spacing={5}>
        <Grid item xs={12} md={2.8125}>
          <Controller
            name={`variants.${index}.color` as const}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Color Code"
                placeholder="Enter Variant Color Code"
                error={!!errors.variants?.[index]?.color}
                helperText={
                  errors.variants?.[index]?.color
                    ? errors.variants[index].color.message
                    : ""
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={2.8125}>
          <Controller
            name={`variants.${index}.price` as const}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Base Price"
                placeholder="Enter Base Price"
                error={!!errors.variants?.[index]?.price}
                helperText={
                  errors.variants?.[index]?.price
                    ? errors.variants[index].price.message
                    : ""
                }
                type="number"
                inputProps={{ min: 0 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={2.8125}>
          <Controller
            name={`variants.${index}.discountedPrice` as const}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Discounted Price"
                placeholder="Enter Discounted Price"
                type="number"
                inputProps={{ min: 0 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={2.8125}>
          <Controller
            name={`variants.${index}.stock` as const}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Stock Quantity"
                placeholder="Enter Stock Quantity"
                error={!!errors.variants?.[index]?.stock}
                helperText={
                  errors.variants?.[index]?.stock
                    ? errors.variants[index].stock.message
                    : ""
                }
                type="number"
                inputProps={{ min: 0 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={0.5} mt={2}>
          <CustomIconButton
            variant="contained"
            color="error"
            onClick={removeVariant}
            className="min-is-fit"
          >
            <i className="ri-close-line" />
          </CustomIconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductVariant;
