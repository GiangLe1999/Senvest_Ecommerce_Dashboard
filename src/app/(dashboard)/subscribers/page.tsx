import type { NextPage } from "next";

import { getSubscribers } from "@/app/server/actions";
import SubscriberListTable from "@/views/apps/ecommerce/subscribers/SubscriberListTable";

interface Props {}

const Page: NextPage<Props> = async () => {
  const data = await getSubscribers();

  return <SubscriberListTable subscribers={data?.subscribers} />;
};

export default Page;
