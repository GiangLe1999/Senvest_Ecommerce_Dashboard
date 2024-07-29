import type { NextPage } from "next";

import BannerListTable from "@/views/apps/ecommerce/manage-banners/BannerListTable";
import { getAdminBanners } from "@/app/server/actions";

interface Props {}

const Page: NextPage<Props> = async () => {
  const data = await getAdminBanners();

  return <BannerListTable banners={data?.banners} />;
};

export default Page;
