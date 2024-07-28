// MUI Imports
import Grid from "@mui/material/Grid";

// Component Imports
import ProductListTable from "@views/apps/ecommerce/products/list/ProductListTable";
import ProductCard from "@views/apps/ecommerce/products/list/ProductCard";
import { getAdminProducts } from "@/app/server/actions";

const eCommerceProductsList = async () => {
  const data = await getAdminProducts();

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ProductCard />
      </Grid>
      <Grid item xs={12}>
        <ProductListTable productData={data?.products} />
      </Grid>
    </Grid>
  );
};

export default eCommerceProductsList;
