'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports

// Component Imports
import OrderCard from './OrderCard'
import OrderListTable from './OrderListTable'

const OrderList = ({data} : {data: any}) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <OrderCard data = {data.statusSummary}/>
      </Grid>
      <Grid item xs={12}>
        <OrderListTable orderData={data.orders} />
      </Grid>
    </Grid>
  )
}

export default OrderList
