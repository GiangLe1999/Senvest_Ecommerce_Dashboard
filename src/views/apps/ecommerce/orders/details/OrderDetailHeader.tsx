// MUI Imports
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { OrderType } from '@/types/apps/ecommerceTypes'

// Component Imports
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

type PayementStatusType = {
  text: string
  color: ThemeColor
}

type StatusChipColorType = {
  color: ThemeColor
}

export const paymentStatus: { [key: string]: PayementStatusType } = {
  paid: { text: "Paid", color: "success" },
  pending: { text: "Pending", color: "warning" },
  refunded: { text: "Refunded", color: "secondary" },
  cancelled: { text: "Cancelled", color: "error" },
};

export const statusChipColor: { [key: string]: StatusChipColorType } = {
  Delivered: { color: "success" },
  "Out for Delivery": { color: "primary" },
  "Ready to Pickup": { color: "info" },
  Dispatched: { color: "warning" },
};

const OrderDetailHeader = ({ orderData}: { orderData?: OrderType }) => {
  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  return (
    <div className='flex flex-wrap justify-between items-center gap-y-4'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <Typography variant='h5'>{`Order #${orderData?.orderCode}`}</Typography>
          <Chip
            variant='tonal'
            label={orderData?.status}
            color={paymentStatus[orderData?.status || '']?.color}
            size='small'
          />
        </div>
        <Typography>{`${new Date(orderData?.createdAt ?? '').toDateString()} - ${new Date(orderData?.createdAt ?? '').toLocaleTimeString("vi-VN")}`}</Typography>
      </div>
      <OpenDialogOnElementClick
        element={Button}
        elementProps={buttonProps('Delete Order', 'error', 'outlined')}
        dialog={ConfirmationDialog}
        dialogProps={{ type: 'delete-order' }}
      />
    </div>
  )
}

export default OrderDetailHeader
