"use client";

// React Imports
import type { FC } from "react";
import { useEffect, useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Component Imports
import { FormHelperText, Grid } from "@mui/material";

// Third Parties
import { Controller, type Control } from "react-hook-form";

import { publicAxiosInstance } from "@/configs/axios";
import type { Category } from "@/entities/category.entity";
import type { AddProductFormValues } from "./ProductAddForm";

interface Props {
  control: Control<AddProductFormValues, any>;
  errors: any;
}

const ProductOrganize: FC<Props> = ({ control, errors }) => {
  // States
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const { data }: { data: { ok: boolean; categories: Category[] } } =
          await publicAxiosInstance.get("/categories");

        if (data?.ok) {
          setCategories(data?.categories);
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <Card>
      <CardHeader title="Organize" />
      <CardContent>
        <Grid container spacing={10}>
          <Grid item xs={6}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Select Category</InputLabel>
                  <Select {...field} label="Select Category" disabled={loading}>
                    {categories?.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category?.name?.en}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <FormHelperText>{errors.category.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Select Status</InputLabel>
                  <Select {...field} label="Select Status">
                    <MenuItem value="Published">Published</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductOrganize;
