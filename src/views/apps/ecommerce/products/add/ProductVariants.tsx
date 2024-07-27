"use client";

// React Imports
import type { Dispatch, FC, SetStateAction, SyntheticEvent } from "react";

// MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

// Components Imports
import { toast } from "react-toastify";

import { defaultVariant, type Variant } from "./ProductAddForm";
import ProductVariant from "./ProductVariant";

interface Props {
  variants: Variant[];
  setVariants: Dispatch<SetStateAction<Variant[]>>;
}

const ProductVariants: FC<Props> = ({ variants, setVariants }) => {
  const deleteForm = (e: SyntheticEvent, index: number) => {
    e.preventDefault();

    if (variants.length > 1) {
      setVariants(variants.filter((variant, i) => i !== index));
    } else {
      toast.error("At least one variant is required");
    }
  };

  const addNewVariant = () => {
    setVariants([...variants, defaultVariant]);
  };

  console.log(variants);

  return (
    <Card>
      <CardHeader title="Variants" />
      <CardContent>
        <Grid container spacing={6}>
          {Array.from(Array(variants?.length).keys()).map((item, index) => (
            <ProductVariant
              key={index}
              index={index}
              deleteForm={deleteForm}
              setVariants={setVariants}
              variant={variants[index]}
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
