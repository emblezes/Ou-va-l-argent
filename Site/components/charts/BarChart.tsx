'use client'

import { Bar } from 'react-chartjs-2'
import type { ChartOptions, Plugin } from 'chart.js'

interface BarChartProps {
  labels: string[]
  data: number[]
  colors?: string | string[] | ((ctx: { dataIndex: number }) => string)
  horizontal?: boolean
  yMin?: number
  yMax?: number
  tooltipSuffix?: string
  yAxisSuffix?: string // Suffixe séparé pour l'axe Y (ex: "%" au lieu de "% du PIB")
  showLegend?: boolean
  label?: string
  showValues?: boolean
}

export function BarChart({
  labels,
  data,
  colors = '#00d4ff',
  horizontal = false,
  yMin,
  yMax,
  tooltipSuffix = '',
  yAxisSuffix,
  showLegend = false,
  label = 'Valeur',
  showValues = false,
}: BarChartProps) {
  // Si yAxisSuffix n'est pas défini, utiliser tooltipSuffix
  const axisLabel = yAxisSuffix !== undefined ? yAxisSuffix : tooltipSuffix
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

  // Plugin pour afficher les valeurs sur les barres
  const dataLabelsPlugin: Plugin<'bar'> = {
    id: 'dataLabels',
    afterDatasetsDraw(chart) {
      if (!showValues) return
      const { ctx } = chart
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex)
        meta.data.forEach((bar, index) => {
          const value = dataset.data[index] as number
          ctx.save()
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 12px JetBrains Mono, monospace'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          if (horizontal) {
            // Pour les barres horizontales
            const x = bar.x - 20
            const y = bar.y
            ctx.fillText(`${value}`, x, y)
          } else {
            // Pour les barres verticales - valeur au milieu de la barre
            const x = bar.x
            const barHeight = Math.abs(bar.y - (chart.scales.y.getPixelForValue(0) || 0))
            const y = value >= 0
              ? bar.y + barHeight / 2
              : bar.y - barHeight / 2
            ctx.fillText(`${value}`, x, y)
          }
          ctx.restore()
        })
      })
    },
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
          callback: axisLabel ? (value) => `${value}${axisLabel}` : undefined,
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

  return <Bar data={chartData} options={options} plugins={[dataLabelsPlugin]} />
}
