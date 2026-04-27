'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { VaultDay, VaultEvent } from '@/lib/points'

const fmt = (n: number) => n.toLocaleString('en-US')
const fmtUsd = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
const fmtHour = (h: number) => `${String(h).padStart(2, '0')}:00`

export function TrackASection({
  vault,
  events,
  pointsByDay,
}: {
  vault: VaultDay[]
  events: VaultEvent[]
  pointsByDay: number[]
}) {
  const sortedEvents = [...events].sort((a, b) =>
    a.day === b.day ? a.hour - b.hour : a.day - b.day,
  )

  const eventsWithBalance = sortedEvents.reduce<
    Array<VaultEvent & { balanceAfter: number }>
  >((acc, e) => {
    const prev = acc[acc.length - 1]?.balanceAfter ?? 0
    const delta = e.type === 'deposit' ? e.amount : -e.amount
    acc.push({ ...e, balanceAfter: prev + delta })
    return acc
  }, [])

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge variant="secondary">Track A · Vault</Badge>
      </div>
      <Tabs defaultValue="points">
        <TabsList>
          <TabsTrigger value="points">Points by day</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="mt-3">
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
                {vault.map((d, i) => (
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
                      {fmt(pointsByDay[i])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-3">
          {eventsWithBalance.length > 0 ? (
            <p className="mb-3 text-xs text-muted-foreground">
              Points are scored on each day&apos;s <strong>minimum</strong>{' '}
              balance — deposits made late in a day only start counting from
              the next day.
            </p>
          ) : null}
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Balance after</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventsWithBalance.map((e, i) => (
                  <TableRow key={`${e.day}-${e.hour}-${i}`}>
                    <TableCell className="font-medium">
                      Day {e.day + 1}
                    </TableCell>
                    <TableCell className="font-mono tabular-nums text-muted-foreground">
                      {fmtHour(e.hour)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={e.type === 'deposit' ? 'outline' : 'secondary'}
                        className={
                          e.type === 'deposit'
                            ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                            : 'border-orange-500/40 text-orange-700 dark:text-orange-400'
                        }
                      >
                        {e.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {e.type === 'deposit' ? '+' : '−'}
                      {fmtUsd(e.amount)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {fmtUsd(e.balanceAfter)}
                    </TableCell>
                  </TableRow>
                ))}
                {eventsWithBalance.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No vault activity in this window.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
