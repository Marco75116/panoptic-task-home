'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

export type DailyPoint = {
  day: string
  trackA: number
  trackB: number
}

const chartConfig = {
  trackA: { label: 'Vault (Track A)', color: 'var(--chart-2)' },
  trackB: { label: 'Trading (Track B)', color: 'var(--chart-4)' },
} satisfies ChartConfig

const compact = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function DailyAreaChart({ data }: { data: DailyPoint[] }) {
  const hasTrackA = data.some((d) => d.trackA > 0)
  const hasTrackB = data.some((d) => d.trackB > 0)

  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <AreaChart data={data} margin={{ left: 8, right: 16, top: 12, bottom: 0 }}>
        <defs>
          <linearGradient id="fillTrackA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-trackA)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-trackA)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillTrackB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-trackB)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-trackB)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
          minTickGap={28}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={48}
          tickFormatter={(v: number) => compact.format(v)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        {hasTrackA ? (
          <Area
            dataKey="trackA"
            type="monotone"
            fill="url(#fillTrackA)"
            stroke="var(--color-trackA)"
            stackId="points"
          />
        ) : null}
        {hasTrackB ? (
          <Area
            dataKey="trackB"
            type="monotone"
            fill="url(#fillTrackB)"
            stroke="var(--color-trackB)"
            stackId="points"
          />
        ) : null}
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )
}
