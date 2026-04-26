import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DailyAreaChart,
  type DailyPoint,
} from '@/components/dashboard/daily-area-chart'
import { profile } from '@/lib/mock-data'
import {
  tradeDayPoints,
  tradeHeldHours,
  tradePoints,
  vaultDayPoints,
} from '@/lib/points'

const fmt = (n: number) => n.toLocaleString('en-US')
const fmtUsd = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

export default function Home() {
  const trackAByDay = profile.vault.map((d) => vaultDayPoints(d))
  const trackBByDay = profile.vault.map((d) =>
    profile.trades.reduce((sum, t) => sum + tradeDayPoints(t, d.day), 0),
  )

  const totalA = trackAByDay.reduce((s, n) => s + n, 0)
  const totalB = trackBByDay.reduce((s, n) => s + n, 0)
  const total = totalA + totalB
  const shareA = total > 0 ? (totalA / total) * 100 : 0
  const shareB = total > 0 ? (totalB / total) * 100 : 0

  let cumA = 0
  let cumB = 0
  const chartData: DailyPoint[] = profile.vault.map((d, i) => {
    cumA += trackAByDay[i]
    cumB += trackBByDay[i]
    return {
      day: `Day ${d.day + 1}`,
      trackA: cumA,
      trackB: cumB,
    }
  })

  return (
    <div className="min-h-full bg-muted/40 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              HyperUnicorn Points
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-medium">{profile.name}</span>
            <span className="text-muted-foreground">{profile.handle}</span>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardDescription>Total points</CardDescription>
            <CardTitle className="font-mono text-4xl tabular-nums">
              {fmt(total)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <TrackStat
                label="Vault (Track A)"
                value={totalA}
                share={shareA}
                swatch="var(--chart-2)"
              />
              <TrackStat
                label="Trading (Track B)"
                value={totalB}
                share={shareB}
                swatch="var(--chart-4)"
              />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Window
                </p>
                <p className="font-mono text-lg tabular-nums">
                  {profile.vault.length} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative points</CardTitle>
            <CardDescription>
              Running total stacked by track — top of the curve is your score
              on that day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DailyAreaChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score breakdown</CardTitle>
            <CardDescription>
              Every row shows the inputs to the formula{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                value × weight × time × boost × scale
              </code>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="secondary">Track A · Vault</Badge>
              </div>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Min balance</TableHead>
                      <TableHead>Held</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profile.vault.map((d, i) => (
                      <TableRow key={d.day}>
                        <TableCell className="font-medium">
                          Day {d.day + 1}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                          {fmtUsd(d.minBalance)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          24 h
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {fmt(trackAByDay[i])}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>

            <Separator />

            <section>
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="secondary">Track B · Trading</Badge>
              </div>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trade</TableHead>
                      <TableHead>Notional</TableHead>
                      <TableHead>Held</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profile.trades.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {t.id}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                          {fmtUsd(t.notional)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {tradeHeldHours(t)} h
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {fmt(tradePoints(t))}
                        </TableCell>
                      </TableRow>
                    ))}
                    {profile.trades.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground"
                        >
                          No trades in this window.
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TrackStat({
  label,
  value,
  share,
  swatch,
}: {
  label: string
  value: number
  share: number
  swatch: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span
          className="size-2.5 rounded-[2px]"
          style={{ backgroundColor: swatch }}
        />
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="font-mono text-lg tabular-nums">{fmt(value)}</p>
      <p className="text-xs text-muted-foreground">
        {share.toFixed(1)}% of total
      </p>
    </div>
  )
}
