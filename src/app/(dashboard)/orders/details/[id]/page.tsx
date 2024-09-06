// Next Imports
import { redirect } from 'next/navigation'


// Component Imports
import OrderDetails from '@views/apps/ecommerce/orders/details'

// Data Imports
import { getEcommerceData } from '@/app/server/actions'

const OrderDetailsPage = async ({ params }: { params: { id: string } }) => {
  // Vars
  const data = await getEcommerceData()

  const filteredData = data?.orderData.filter((item: any) => item.order === params.id)[0]

  if (!filteredData) {
    redirect('/not-found')
  }

  return filteredData ? <OrderDetails orderData={filteredData} order={params.id} /> : null
}

export default OrderDetailsPage
