import type { NextPage } from "next";

import SloganListTable from "@/views/apps/ecommerce/manage-slogan/SloganListTable";
import { getAdminSlogans } from "@/app/server/actions";

interface Props {}

const Page: NextPage<Props> = async () => {
  const data = await getAdminSlogans();

  return <SloganListTable slogans={data?.slogans} />;
};

export default Page;
