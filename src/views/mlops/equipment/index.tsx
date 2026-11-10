import { useMemo, useState } from 'react'
import { Link } from 'react-router'
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
import { Label } from '@/components/ui/label'
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
import { equipmentList, productionLines } from 'src/api/mlops/mlops-data'
import { useMlops } from 'src/context/mlops-context'
import type { Equipment, EquipmentStatus } from 'src/types/mlops'
import { Factory, Plus, Search } from 'lucide-react'

const statusFilterOptions: { value: string; label: string }[] = [
  { value: 'all', label: '전체 상태' },
  { value: 'normal', label: '정상' },
  { value: 'warning', label: '주의' },
  { value: 'fault', label: '장애' },
  { value: 'offline', label: '오프라인' },
]

export default function EquipmentPage() {
  const { factoryId } = useMlops()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [lineFilter, setLineFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Equipment | null>(null)
  const [form, setForm] = useState({ name: '', type: '', location: '', status: 'normal' })

  const lines = useMemo(
    () =>
      productionLines.filter((l) => factoryId === 'all' || l.factoryId === factoryId),
    [factoryId],
  )

  const filtered = useMemo(() => {
    return equipmentList.filter((eq) => {
      if (factoryId !== 'all' && eq.factoryId !== factoryId) return false
      if (statusFilter !== 'all' && eq.status !== statusFilter) return false
      if (lineFilter !== 'all' && eq.lineId !== lineFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          eq.name.toLowerCase().includes(q) ||
          eq.type.toLowerCase().includes(q) ||
          eq.location.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [factoryId, statusFilter, lineFilter, search])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', type: '', location: '', status: 'normal' })
    setDialogOpen(true)
  }

  const openEdit = (eq: Equipment) => {
    setEditing(eq)
    setForm({
      name: eq.name,
      type: eq.type,
      location: eq.location,
      status: eq.status,
    })
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="표시 설비" value={filtered.length} icon={Factory} />
        <KpiCard
          title="정상"
          value={filtered.filter((e) => e.status === 'normal').length}
          icon={Factory}
          tone="success"
        />
        <KpiCard
          title="주의"
          value={filtered.filter((e) => e.status === 'warning').length}
          icon={Factory}
          tone="warning"
        />
        <KpiCard
          title="장애"
          value={filtered.filter((e) => e.status === 'fault').length}
          icon={Factory}
          tone="danger"
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-3">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-sm">공장 / 생산라인</CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setLineFilter('all')}
                className={`text-left text-sm px-3 py-2 border cursor-pointer ${
                  lineFilter === 'all' ? 'border-primary bg-primary/10' : 'border-border'
                }`}
              >
                전체 라인
              </button>
              {lines.map((line) => (
                <button
                  key={line.id}
                  type="button"
                  onClick={() => setLineFilter(line.id)}
                  className={`text-left px-3 py-2 border cursor-pointer ${
                    lineFilter === line.id ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <div className="text-sm font-medium">{line.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-between mt-1">
                    <span>설비 {line.equipmentCount}</span>
                    <StatusBadge kind="equipment" value={line.status} />
                  </div>
                </button>
              ))}
            </CardContent>
          </DashboardCard>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-sm">설비 목록</CardTitle>
              <Button size="sm" className="cursor-pointer" onClick={openCreate}>
                <Plus className="size-4" />
                설비 등록
              </Button>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-8 h-9"
                    placeholder="설비명, 유형, 위치 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
                  <SelectTrigger className="h-9! w-[140px] cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilterOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value} className="cursor-pointer">
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>설비명</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>위치</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>가동률</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell className="font-medium">{eq.name}</TableCell>
                      <TableCell>{eq.type}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {eq.lineName} · {eq.location}
                      </TableCell>
                      <TableCell>
                        <StatusBadge kind="equipment" value={eq.status} />
                      </TableCell>
                      <TableCell className="tabular-nums">{eq.uptime}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/equipment/${eq.id}`}
                            className="inline-flex h-7 items-center px-2.5 text-[0.8rem] hover:bg-muted rounded-lg cursor-pointer"
                          >
                            상세
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => openEdit(eq)}
                          >
                            수정
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        조건에 맞는 설비가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </DashboardCard>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? '설비 수정' : '설비 등록'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>설비명</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="예: 유압 프레스 #3"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>설비 유형</Label>
              <Input
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                placeholder="예: 프레스"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>위치</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="예: Zone A-03"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>상태</Label>
              <Select
                value={form.status}
                onValueChange={(v) => v && setForm((f) => ({ ...f, status: v }))}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['normal', 'warning', 'fault', 'offline'] as EquipmentStatus[]).map((s) => (
                    <SelectItem key={s} value={s} className="cursor-pointer">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="cursor-pointer" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button className="cursor-pointer" onClick={() => setDialogOpen(false)}>
              {editing ? '저장' : '등록'} (Mock)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
