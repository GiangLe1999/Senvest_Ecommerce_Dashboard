import CustomerListTable from '@views/apps/ecommerce/customers/list/CustomerListTable'

import { getAllUsers } from '@/app/server/actions'


const CustomerListTablePage = async () => {
  const data = await getAllUsers()

  return <CustomerListTable customerData={data?.users} />
}

export default CustomerListTablePage
