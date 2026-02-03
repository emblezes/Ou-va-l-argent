'use client'

import { Bar } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'

interface BarChartProps {
  labels: string[]
  data: number[]
  colors?: string | string[] | ((ctx: { dataIndex: number }) => string)
  horizontal?: boolean
  yMin?: number
  yMax?: number
  tooltipSuffix?: string
  showLegend?: boolean
  label?: string
}

export function BarChart({
  labels,
  data,
  colors = '#00d4ff',
  horizontal = false,
  yMin,
  yMax,
  tooltipSuffix = '',
  showLegend = false,
  label = 'Valeur',
}: BarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: typeof colors === 'function'
          ? data.map((_, i) => colors({ dataIndex: i }))
          : Array.isArray(colors)
            ? colors
            : Array(data.length).fill(colors),
        borderRadius: 6,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: {
        display: showLegend,
      },
      tooltip: {
        backgroundColor: '#111820',
        padding: 12,
        callbacks: {
          label: (ctx) => `${ctx.parsed[horizontal ? 'x' : 'y']}${tooltipSuffix}`,
        },
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
          callback: tooltipSuffix ? (value) => `${value}${tooltipSuffix}` : undefined,
        },
      },
      x: {
        grid: {
          display: !horizontal,
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
