import type { NextPage } from "next";

import ProductAddOrEditForm from "@/views/apps/ecommerce/products/add/ProductAddOrEditForm";
import { getAdminProduct } from "@/app/server/actions";

interface Props {
  params: {
    id: string;
  };
}

const ECommerceProductsUpdate: NextPage<Props> = async ({ params: { id } }) => {
  const data = await getAdminProduct(id);

  return <ProductAddOrEditForm initialProductData={data?.product} />;
};

export default ECommerceProductsUpdate;
