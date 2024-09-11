import CustomerDetails from '@/views/apps/ecommerce/customers/details'

// Data Imports
import {  getUserById } from '@/app/server/actions'

const CustomerDetailsPage = async ({ params }: { params: { id: string } }) => {
  // Vars
  const data = await getUserById(params.id)


  return <CustomerDetails customerData={data?.user} customerAddresses={data?.userAddresses} customerOrders={data?.userOrders} customerId={params.id} /> 
}

export default CustomerDetailsPage
