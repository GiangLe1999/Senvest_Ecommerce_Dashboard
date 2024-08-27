'use client'

// Next Imports
import type { FC } from 'react'

import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))


interface Props {
  reviewsByDayOfWeek: any
}

const ReviewsStatistics : FC<Props> = ({reviewsByDayOfWeek}) => {

  const series = [{ data:  reviewsByDayOfWeek.map((day : any) => day.value) }]
  const newReviews = reviewsByDayOfWeek.reduce(( total : any, day : any ) => total + day.value, 0)

  // Hook
  const theme = useTheme()

  // Vars
  const successLightOpacity = 'var(--mui-palette-success-lightOpacity)'

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        distributed: true,
        columnWidth: '40%'
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: [
      successLightOpacity,
      successLightOpacity,
      successLightOpacity,
      successLightOpacity,
      'var(--mui-palette-success-main)',
      successLightOpacity,
      successLightOpacity
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -30,
        left: -10,
        right: -7,
        bottom: -12
      }
    },
    xaxis: {
      categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: 'on',
      labels: {
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    yaxis: { show: false },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            width: 275
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardContent>
        <Grid container rowGap={6}>
          <Grid item xs={12} sm={6}>
            <div className='bs-full flex flex-col items-start justify-between gap-6'>
              <div className='flex flex-col gap-2'>
                <Typography variant='h5'>Reviews statistics</Typography>
                <div className='flex items-center gap-2'>
                  <Typography>{newReviews} New reviews</Typography>
                  <Chip label='+8.4%' variant='tonal' size='small' color='success' />
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Typography variant='body2'>Weekly Report</Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className='flex justify-center'>
            <AppReactApexCharts type='bar' width='100%' height={152} series={series} options={options} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ReviewsStatistics
