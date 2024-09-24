import type { NextPage } from "next";

import { getDonations } from "@/app/server/actions";
import DonationListTable from "@/views/apps/ecommerce/donations/DonationListTable";

interface Props {}

const Page: NextPage<Props> = async () => {
  const data = await getDonations();

  return <DonationListTable donations={data?.donations} />;
};

export default Page;
