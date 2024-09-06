// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import type { TypographyProps } from '@mui/material/Typography'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { OrderType } from '@/types/apps/ecommerceTypes'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import EditUserInfo from '@components/dialogs/edit-user-info'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

// Vars
const userData = {
  firstName: 'Gabrielle',
  lastName: 'Feyer',
  userName: '@gabriellefeyer',
  billingEmail: 'gfeyer0@nyu.edu',
  status: 'active',
  role: 'Customer',
  taxId: 'Tax-8894',
  contact: '+1 (234) 464-0600',
  language: ['English'],
  country: 'France',
  useAsBillingAddress: true
}

const CustomerDetails = ({ orderData }: { orderData?: OrderType }) => {
  // Vars
  const typographyProps = (children: string, color: ThemeColor, className: string): TypographyProps => ({
    children,
    color,
    className
  })

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <Typography variant='h5'>Customer details</Typography>
        <div className='flex items-center gap-3'>
        <Avatar src="" />
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {orderData?.user?.name || orderData?.not_user_info?.name}
            </Typography>
            <Typography>Customer ID: # {orderData?.user?._id || "Unknown"}</Typography>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <CustomAvatar skin='light' color='success' size={40}>
            <i className='ri-shopping-cart-2-line' />
          </CustomAvatar>
          <Typography color='text.primary' className='font-medium'>
            {orderData?.user?.orders || 0} Orders
          </Typography>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between items-center'>
            <Typography color='text.primary' className='font-medium'>
              Contact info
            </Typography>
            <OpenDialogOnElementClick
              element={Typography}
              elementProps={typographyProps('Edit', 'primary', 'cursor-pointer font-medium')}
              dialog={EditUserInfo}
              dialogProps={{ data: userData }}
            />
          </div>
          <Typography>Email: {orderData?.user?.email || orderData?.not_user_info?.email}</Typography>
          <Typography>Mobile: {orderData?.user_address?.phone || orderData?.not_user_info?.phone}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerDetails
