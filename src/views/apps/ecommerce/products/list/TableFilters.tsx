// React Imports
import { useState, useEffect } from "react";

// MUI Imports
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Type Imports
import type { ProductType } from "@/types/apps/ecommerceTypes";
import type { Category } from "@/entities/category.entity";
import { publicAxiosInstance } from "@/configs/axios";

const TableFilters = ({
  setData,
  productData,
}: {
  setData: (data: ProductType[]) => void;
  productData?: ProductType[];
}) => {
  // States
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [getCategoriesLoading, setGetCategoriesLoading] = useState(false);

  const [stock, setStock] = useState("");
  const [status, setStatus] = useState<ProductType["status"]>("");

  useEffect(() => {
    const fetchCategories = async () => {
      setGetCategoriesLoading(true);

      try {
        const { data }: { data: { ok: boolean; categories: Category[] } } =
          await publicAxiosInstance.get("/categories");

        if (data?.ok) {
          setCategories(data?.categories);
        }
      } catch (error) {
        console.log(error);
      }

      setGetCategoriesLoading(false);
    };

    fetchCategories();
  }, []);

  useEffect(
    () => {
      const filteredData = productData?.filter((product) => {
        if (category && product.category.name.en !== category) return false;

        const stockQuantity = product?.variants?.reduce(
          (a, b) => a + b.stock,
          0,
        );

        if (stock === "In Stock" && stockQuantity === 0) return false;
        if (stock === "Out of Stock" && stockQuantity > 0) return false;
        if (status && product.status !== status) return false;

        return true;
      });

      setData(filteredData ?? []);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, stock, status, productData],
  );

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="status-select">Status</InputLabel>
            <Select
              fullWidth
              id="select-status"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              labelId="status-select"
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="Published">Publish</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="category-select">Category</InputLabel>
            <Select
              fullWidth
              id="select-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              label="Category"
              labelId="category-select"
              disabled={getCategoriesLoading}
            >
              {categories?.map((category) => (
                <MenuItem key={category._id} value={category.name.en || ""}>
                  {category.name.en}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="stock-select">Stock</InputLabel>
            <Select
              fullWidth
              id="select-stock"
              value={stock}
              onChange={(e) => setStock(e.target.value as string)}
              label="Stock"
              labelId="stock-select"
            >
              <MenuItem value="">Select Stock</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
