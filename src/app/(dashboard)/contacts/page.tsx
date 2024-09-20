import type { NextPage } from "next";

import { getContacts, getSubscribers } from "@/app/server/actions";
import ContactListTable from "@/views/apps/ecommerce/contacts/ContactListTable";

interface Props {}

const Page: NextPage<Props> = async () => {
  const data = await getContacts();

  return <ContactListTable contacts={data?.contacts} />;
};

export default Page;
