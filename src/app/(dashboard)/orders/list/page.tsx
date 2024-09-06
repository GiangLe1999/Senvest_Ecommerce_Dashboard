// Component Imports
import OrderList from '@views/apps/ecommerce/orders/list'

// Data Imports
import { getOrders } from '@/app/server/actions'

const OrdersListPage = async () => {
  // Vars
  const data = await getOrders()

  return <OrderList data={data} />
}

export default OrdersListPage
