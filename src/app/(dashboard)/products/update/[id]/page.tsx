import type { NextPage } from "next";

import ProductAddForm from "@/views/apps/ecommerce/products/add/ProductAddForm";
import { getAdminProduct } from "@/app/server/actions";

interface Props {
  params: {
    id: string;
  };
}

const ECommerceProductsUpdate: NextPage<Props> = async ({ params: { id } }) => {
  const data = await getAdminProduct(id);

  return <ProductAddForm initialProductData={data?.product} />;
};

export default ECommerceProductsUpdate;
