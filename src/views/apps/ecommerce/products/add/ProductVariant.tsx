import type { FC } from "react";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { vi } from "date-fns/locale/vi";
import { Chip } from "@mui/material";

import type {
  Control,
  FieldErrors,
  UseFieldArrayRemove,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { toast } from "react-toastify";

import type { AddProductFormValues } from "./ProductAddOrEditForm";
import ProductImage from "./ProductImage";

interface Props {
  index: number;
  remove: UseFieldArrayRemove;
  control: Control<AddProductFormValues, any>;
  errors: FieldErrors<AddProductFormValues>;
  fieldsLength: number;
  setValue: UseFormSetValue<AddProductFormValues>;
  watch: UseFormWatch<AddProductFormValues>;
}

const ProductVariant: FC<Props> = ({
  index,
  remove,
  control,
  errors,
  fieldsLength,
  setValue,
  watch,
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
        <Grid item xs={12} className="text-center">
          <div className="flex items-center justify-between">
            <Chip
              variant="tonal"
              label={`Variant ${index + 1}`}
              size="small"
              color="info"
              className="rounded-lg text-xs"
            />
            <Chip
              variant="tonal"
              label={`Remove Variant ${index + 1}`}
              size="small"
              color="error"
              className="rounded-lg text-xs"
              onClick={removeVariant}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name={`variants.${index}.fragrance` as const}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Fragrance Type"
                placeholder="Enter Variant Fragrance Type"
                error={!!errors.variants?.[index]?.fragrance}
                helperText={
                  errors.variants?.[index]?.fragrance
                    ? errors.variants[index].fragrance.message
                    : ""
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12}>
          <ProductImage
            index={index}
            files={watch(`variants.${index}.images`)}
            setValue={setValue}
            error={errors.variants?.[index]?.images}
          />
        </Grid>

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
          <Controller
            name={`variants.${index}.discountedFrom` as const}
            control={control}
            render={({ field }) => (
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
              >
                <DatePicker
                  slotProps={{
                    textField: {
                      error: false,
                    },
                  }}
                  className="w-full"
                  label="Discounted From"
                  {...field}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name={`variants.${index}.discountedTo` as const}
            control={control}
            render={({ field }) => (
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
              >
                <DatePicker
                  slotProps={{
                    textField: {
                      error: false,
                    },
                  }}
                  className="w-full"
                  label="Discounted To"
                  {...field}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductVariant;
