'use client'

import { Doughnut } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'

interface DoughnutChartProps {
  labels: string[]
  data: number[]
  colors: string[]
  cutout?: string
  legendPosition?: 'top' | 'bottom' | 'left' | 'right'
  tooltipSuffix?: string
}

export function DoughnutChart({
  labels,
  data,
  colors,
  cutout = '55%',
  legendPosition = 'right',
  tooltipSuffix = '%',
}: DoughnutChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: '#0a0e14',
        borderWidth: 3,
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout,
    plugins: {
      legend: {
        position: legendPosition,
        labels: {
          usePointStyle: true,
          padding: 10,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: '#111820',
        padding: 12,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed}${tooltipSuffix}`,
        },
      },
    },
  }

  return <Doughnut data={chartData} options={options} />
}
