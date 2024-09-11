// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import type { Customer } from '@/types/apps/ecommerceTypes'

const CustomerDetailHeader = ({ customerId, customerData }: { customerId: string, customerData: Customer }) => {
  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  return (
    <div className='flex flex-wrap justify-between items-center gap-x-6 gap-y-4'>
      <div className='flex flex-col gap-1'>
        <Typography variant='h4'>{`Customer ID #${customerId}`}</Typography>
        <Typography>{`${new Date(customerData.createdAt).toDateString()} - ${new Date(customerData.createdAt ?? '').toLocaleTimeString("vi-VN")}`}</Typography>
      </div>
      <OpenDialogOnElementClick
        element={Button}
        elementProps={buttonProps('Delete Customer', 'error', 'outlined')}
        dialog={ConfirmationDialog}
        dialogProps={{ type: 'delete-customer' }}
      />
    </div>
  )
}

export default CustomerDetailHeader
