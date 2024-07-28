// Component Imports
import { getAdminCategories } from "@/app/server/actions";
import ProductCategoryTable from "@views/apps/ecommerce/products/category/ProductCategoryTable";

const eCommerceProductsCategory = async () => {
  const { categories } = await getAdminCategories();

  return <ProductCategoryTable categories={categories} />;
};

export default eCommerceProductsCategory;
