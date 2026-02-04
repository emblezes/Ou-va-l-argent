'use client'

import { Line } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'

interface DataSet {
  label: string
  data: number[]
  borderColor: string
  backgroundColor?: string
  fill?: boolean
  tension?: number
  borderWidth?: number
}

interface LineChartProps {
  labels: string[]
  datasets: DataSet[]
  yMin?: number
  yMax?: number
  yCallback?: (value: number | string) => string
  showLegend?: boolean
}

export function LineChart({ labels, datasets, yMin, yMax, yCallback, showLegend = true }: LineChartProps) {
  const data = {
    labels,
    datasets: datasets.map((ds) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.borderColor,
      backgroundColor: ds.backgroundColor || 'transparent',
      fill: ds.fill ?? false,
      tension: ds.tension ?? 0.3,
      borderWidth: ds.borderWidth ?? 2,
    })),
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#111820',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: {
        min: yMin,
        max: yMax,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          callback: yCallback ? (value) => yCallback(value as number) : undefined,
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  }

  return <Line data={data} options={options} />
}
