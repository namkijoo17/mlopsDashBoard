import { useMemo, useState } from 'react'
import { KpiCard } from '@/components/mlops/kpi-card'
import { StatusBadge } from '@/components/mlops/status-badge'
import { DashboardCard } from '@/components/shared/dashboard-card'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { alerts as alertsSeed } from 'src/api/mlops/mlops-data'
import { useMlops } from 'src/context/mlops-context'
import type { AlertItem } from 'src/types/mlops'
import { AlertTriangle, Bell, Info, Search, Siren } from 'lucide-react'

export default function AlertsPage() {
  const { factoryId } = useMlops()
  const [items, setItems] = useState<AlertItem[]>(alertsSeed)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<AlertItem | null>(null)

  const filtered = useMemo(() => {
    return items.filter((a) => {
      if (factoryId !== 'all' && a.factoryId !== factoryId) return false
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false
      if (statusFilter !== 'all' && a.status !== statusFilter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        a.title.toLowerCase().includes(q) ||
        a.equipmentName.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q)
      )
    })
  }, [items, factoryId, severityFilter, statusFilter, search])

  const acknowledge = (id: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setItems((prev) =>
      prev.map((a) =>
        a.id === id && a.status === 'open'
          ? { ...a, status: 'acknowledged', acknowledgedAt: now }
          : a,
      ),
    )
    setSelected((cur) =>
      cur?.id === id && cur.status === 'open'
        ? { ...cur, status: 'acknowledged', acknowledgedAt: now }
        : cur,
    )
  }

  const resolve = (id: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    setItems((prev) =>
      prev.map((a) =>
        a.id === id && a.status !== 'resolved'
          ? { ...a, status: 'resolved', resolvedAt: now, acknowledgedAt: a.acknowledgedAt ?? now }
          : a,
      ),
    )
    setSelected((cur) =>
      cur?.id === id && cur.status !== 'resolved'
        ? { ...cur, status: 'resolved', resolvedAt: now, acknowledgedAt: cur.acknowledgedAt ?? now }
        : cur,
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="전체 알림" value={filtered.length} icon={Bell} />
        <KpiCard
          title="Critical"
          value={filtered.filter((a) => a.severity === 'critical').length}
          icon={Siren}
          tone="danger"
        />
        <KpiCard
          title="Warning"
          value={filtered.filter((a) => a.severity === 'warning').length}
          icon={AlertTriangle}
          tone="warning"
        />
        <KpiCard
          title="Info"
          value={filtered.filter((a) => a.severity === 'info').length}
          icon={Info}
          tone="info"
        />
      </div>

      <DashboardCard className="flex flex-col gap-0!">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-sm">알림 목록</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8 h-9"
                placeholder="제목, 설비, 내용 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={severityFilter} onValueChange={(v) => v && setSeverityFilter(v)}>
              <SelectTrigger className="h-9! w-[130px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  전체 심각도
                </SelectItem>
                <SelectItem value="critical" className="cursor-pointer">
                  Critical
                </SelectItem>
                <SelectItem value="warning" className="cursor-pointer">
                  Warning
                </SelectItem>
                <SelectItem value="info" className="cursor-pointer">
                  Info
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
              <SelectTrigger className="h-9! w-[130px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  전체 조치상태
                </SelectItem>
                <SelectItem value="open" className="cursor-pointer">
                  미조치
                </SelectItem>
                <SelectItem value="acknowledged" className="cursor-pointer">
                  확인됨
                </SelectItem>
                <SelectItem value="resolved" className="cursor-pointer">
                  조치완료
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>발생 시간</TableHead>
                <TableHead>심각도</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>공장</TableHead>
                <TableHead>설비</TableHead>
                <TableHead>조치 상태</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="tabular-nums text-muted-foreground whitespace-nowrap">
                    {alert.createdAt}
                  </TableCell>
                  <TableCell>
                    <StatusBadge kind="severity" value={alert.severity} />
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{alert.title}</TableCell>
                  <TableCell>{alert.factoryName}</TableCell>
                  <TableCell>{alert.equipmentName}</TableCell>
                  <TableCell>
                    <StatusBadge kind="action" value={alert.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setSelected(alert)}
                    >
                      상세
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    조건에 맞는 알림이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </DashboardCard>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>알림 상세</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid gap-3 text-sm py-1">
              <div className="flex items-center gap-2">
                <StatusBadge kind="severity" value={selected.severity} />
                <StatusBadge kind="action" value={selected.status} />
              </div>
              <h3 className="text-base font-semibold">{selected.title}</h3>
              <p className="text-muted-foreground">{selected.message}</p>
              <div className="grid gap-2 border-t border-border pt-3">
                {[
                  ['알림 ID', selected.id],
                  ['발생 시간', selected.createdAt],
                  ['공장', selected.factoryName],
                  ['설비', selected.equipmentName],
                  ['확인 시간', selected.acknowledgedAt ?? '-'],
                  ['조치 완료', selected.resolvedAt ?? '-'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" className="cursor-pointer" onClick={() => setSelected(null)}>
              닫기
            </Button>
            {selected && selected.status === 'open' && (
              <Button
                variant="secondary"
                className="cursor-pointer"
                onClick={() => acknowledge(selected.id)}
              >
                확인
              </Button>
            )}
            {selected && selected.status !== 'resolved' && (
              <Button className="cursor-pointer" onClick={() => resolve(selected.id)}>
                조치 완료
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
