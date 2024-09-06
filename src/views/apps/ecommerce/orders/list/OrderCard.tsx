// MUI Imports
import type { FC } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Vars
const icons = {
    'pending': 'ri-calendar-2-line',
    'paid': 'ri-check-double-line',
    'refunded': 'ri-wallet-3-line',
    'cancelled': 'ri-error-warning-line',}

interface Props {
  data: any
}

const OrderCard : FC<Props> = ({ data }) => {
  // Hooks
  const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))


  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          {data?.map((item : any, index : number) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              className={classnames({
                '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie':
                  isBelowMdScreen && !isBelowSmScreen,
                '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
              })}
            >
              <div className='flex justify-between'>
                <div className='flex flex-col'>
                  <Typography variant='h4'>{item.count}</Typography>
                  <Typography className='capitalize'>{item.status}</Typography>
                </div>
                <CustomAvatar variant='rounded' size={42} skin='light'>
                  <i className={classnames('text-[26px]', icons[item.status as keyof typeof icons  ] as any)} />
                </CustomAvatar>
              </div>
              {isBelowMdScreen && !isBelowSmScreen && index < data.length - 2 && (
                <Divider
                  className={classnames('mbs-6', {
                    'mie-6': index % 2 === 0
                  })}
                />
              )}
              {isBelowSmScreen && index < data.length - 1 && <Divider className='mbs-6' />}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default OrderCard
