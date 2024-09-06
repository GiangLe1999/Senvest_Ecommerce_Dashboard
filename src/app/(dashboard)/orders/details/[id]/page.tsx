import OrderDetails from '@views/apps/ecommerce/orders/details'
import { getOrderById } from '@/app/server/actions'

const OrderDetailsPage = async ({ params }: { params: { id: string } }) => {
  // Vars
  const data = await getOrderById(params.id)

  return <OrderDetails orderData={data?.order} order={params.id} />
}

export default OrderDetailsPage
