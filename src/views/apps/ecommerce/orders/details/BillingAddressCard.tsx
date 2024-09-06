// MUI Imports
import type { FC } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { TypographyProps } from '@mui/material/Typography'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import AddAddress from '@components/dialogs/add-edit-address'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import type { OrderType } from '@/types/apps/ecommerceTypes'

// Vars
const data = {
  firstName: 'Roker',
  lastName: 'Terrace',
  email: 'sbaser0@boston.com',
  country: 'UK',
  address1: 'Latheronwheel',
  address2: 'KW5 8NW, London',
  landmark: 'Near Water Plant',
  city: 'London',
  state: 'Capholim',
  zipCode: '403114',
  taxId: 'TAX-875623',
  vatNumber: 'SDF754K77',
  contact: '+1 (609) 972-22-22'
}

interface Props {
  orderData: OrderType
}

const BillingAddress : FC<Props> = ({orderData}) => {
  // Vars
  const typographyProps = (children: string, color: ThemeColor, className: string): TypographyProps => ({
    children,
    color,
    className
  })

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-center'>
            <Typography variant='h5'>Billing Address</Typography>
            <OpenDialogOnElementClick
              element={Typography}
              elementProps={typographyProps('Edit', 'primary', 'cursor-pointer font-medium')}
              dialog={AddAddress}
              dialogProps={{ type: 'Add address for billing address', data }}
            />
          </div>
          <div className='flex flex-col'>
          <Typography>{orderData?.user_address?.address || orderData?.not_user_info?.address}</Typography>
          <Typography>{orderData?.user_address?.city || orderData?.not_user_info?.city}</Typography>
          <Typography>{orderData?.user_address?.province || orderData?.not_user_info?.province}, {orderData?.user_address?.zip || orderData?.not_user_info?.zip}</Typography>
          <Typography>Vietnam</Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BillingAddress
