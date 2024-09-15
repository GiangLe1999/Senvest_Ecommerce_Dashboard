import type { NextPage } from "next";

import { getAdminCoupons } from "@/app/server/actions";
import CouponListTable from "@/views/apps/ecommerce/coupons/CouponListTable";

interface Props {}

const Page: NextPage<Props> = async () => {
  const data = await getAdminCoupons();

  return <CouponListTable coupons={data?.coupons} />;
};

export default Page;
