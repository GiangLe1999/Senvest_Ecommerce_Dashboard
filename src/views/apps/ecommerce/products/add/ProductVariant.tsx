import type {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  SyntheticEvent,
} from "react";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import CustomIconButton from "@core/components/mui/IconButton";
import type { Variant } from "./ProductAddForm";

interface Props {
  index: number;
  deleteForm: (e: SyntheticEvent, index: number) => void;
  variant: Variant;
  setVariants: Dispatch<SetStateAction<Variant[]>>;
}

const ProductVariant: FC<Props> = ({
  index,
  deleteForm,
  variant,
  setVariants,
}): JSX.Element => {
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVariants((prev) => {
      const newVariants = [...prev];

      newVariants[index] = {
        ...newVariants[index],
        [e.target.name]: e.target.value,
      };

      return newVariants;
    });
  };

  return (
    <Grid item xs={12} className="repeater-item">
      <Grid container spacing={5}>
        <Grid item xs={12} md={2.8125}>
          <TextField
            fullWidth
            label="Color code"
            placeholder="Enter Color Variant Value"
            required
            value={variant.color}
            onChange={onChange}
            name="color"
          />
        </Grid>
        <Grid item xs={12} md={2.8125}>
          <div className="flex items-center gap-6">
            <TextField
              fullWidth
              label="Base Price"
              placeholder="Enter base price"
              required
              name="price"
              onChange={onChange}
              type="number"
            />
          </div>
        </Grid>
        <Grid item xs={12} md={2.8125}>
          <div className="flex items-center gap-6">
            <TextField
              fullWidth
              label="Discounted Price"
              placeholder="Enter Discounted Price"
              name="discountedPrice"
              onChange={onChange}
              type="number"
            />
          </div>
        </Grid>
        <Grid item xs={12} md={2.8125}>
          <div className="flex items-center gap-6">
            <TextField
              fullWidth
              label="Stock"
              placeholder="Enter Stock Quantity"
              name="stock"
              required
              onChange={onChange}
              type="number"
            />
          </div>
        </Grid>
        <Grid item xs={12} md={0.5} mt={2}>
          <CustomIconButton
            variant="contained"
            color="error"
            onClick={(e) => deleteForm(e, index)}
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
