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
          ctx.fillStyle = '#f0f4f8'
          ctx.font = 'bold 14px JetBrains Mono, monospace'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'

          // Formater la valeur (sans unité pour la lisibilité)
          const formattedValue = value.toLocaleString('fr-FR')

          if (horizontal) {
            // Pour les barres horizontales - valeur à droite
            const x = bar.x + 8
            const y = bar.y
            ctx.textAlign = 'left'
            ctx.textBaseline = 'middle'
            ctx.fillText(formattedValue, x, y)
          } else {
            // Pour les barres verticales - valeur au-dessus de la barre
            const x = bar.x
            const y = bar.y - 6
            ctx.fillText(formattedValue, x, y)
          }
          ctx.restore()
        })
      })
    },
  }

  // Plugin watermark pour identifier la source
  const watermarkPlugin: Plugin<'bar'> = {
    id: 'watermark',
    afterDraw(chart) {
      const { ctx, chartArea } = chart
      ctx.save()
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px JetBrains Mono, monospace'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'
      ctx.fillText('ouvalargent.fr', chartArea.right - 5, chartArea.bottom - 5)
      ctx.restore()
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

  return <Bar data={chartData} options={options} plugins={[dataLabelsPlugin, watermarkPlugin]} />
}
