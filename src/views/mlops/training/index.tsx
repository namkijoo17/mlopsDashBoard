import { useMemo, useState } from 'react'
import { KpiCard } from '@/components/mlops/kpi-card'
import { StatusBadge } from '@/components/mlops/status-badge'
import { DashboardCard } from '@/components/shared/dashboard-card'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
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
import { trainingAccuracyCompare, trainingJobs } from 'src/api/mlops/mlops-data'
import type { TrainingJob } from 'src/types/mlops'
import { Boxes, CheckCircle2, Loader2, Search, XCircle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const compareConfig = {
  v1: { label: '이전 버전', color: 'color-mix(in srgb, var(--primary) 45%, transparent)' },
  v2: { label: '최신 버전', color: 'var(--color-primary)' },
} satisfies ChartConfig

export default function TrainingPage() {
  const [jobs, setJobs] = useState(trainingJobs)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<TrainingJob | null>(null)
  const [startOpen, setStartOpen] = useState(false)

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (statusFilter !== 'all' && j.status !== statusFilter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        j.modelName.toLowerCase().includes(q) ||
        j.dataset.toLowerCase().includes(q) ||
        j.id.toLowerCase().includes(q)
      )
    })
  }, [jobs, search, statusFilter])

  const startQueued = () => {
    setJobs((prev) =>
      prev.map((j) =>
        j.status === 'queued'
          ? {
              ...j,
              status: 'running',
              progress: 5,
              currentEpoch: 1,
              startedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
            }
          : j,
      ),
    )
    setStartOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="전체 작업" value={jobs.length} icon={Boxes} />
        <KpiCard
          title="진행 중"
          value={jobs.filter((j) => j.status === 'running').length}
          icon={Loader2}
          tone="info"
        />
        <KpiCard
          title="완료"
          value={jobs.filter((j) => j.status === 'completed').length}
          icon={CheckCircle2}
          tone="success"
        />
        <KpiCard
          title="실패"
          value={jobs.filter((j) => j.status === 'failed').length}
          icon={XCircle}
          tone="danger"
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-sm">학습 작업 목록</CardTitle>
              <Button size="sm" className="cursor-pointer" onClick={() => setStartOpen(true)}>
                학습 시작
              </Button>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-8 h-9"
                    placeholder="모델명, 데이터셋, ID 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
                  <SelectTrigger className="h-9! w-[130px] cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">
                      전체 상태
                    </SelectItem>
                    <SelectItem value="queued" className="cursor-pointer">
                      대기
                    </SelectItem>
                    <SelectItem value="running" className="cursor-pointer">
                      진행 중
                    </SelectItem>
                    <SelectItem value="completed" className="cursor-pointer">
                      완료
                    </SelectItem>
                    <SelectItem value="failed" className="cursor-pointer">
                      실패
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>작업 ID</TableHead>
                    <TableHead>모델</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>진행률</TableHead>
                    <TableHead>데이터셋</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="tabular-nums text-muted-foreground">{job.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{job.modelName}</div>
                        <div className="text-xs text-muted-foreground">{job.modelType}</div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge kind="training" value={job.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 min-w-[100px]">
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {job.progress}% · {job.currentEpoch}/{job.epochs} epoch
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{job.dataset}</div>
                        <div className="text-xs text-muted-foreground">{job.datasetSize}</div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => setSelected(job)}
                        >
                          상세
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </DashboardCard>
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-sm">학습 결과 정확도 비교</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChartContainer config={compareConfig} className="h-[260px]! w-full">
                <BarChart data={trainingAccuracyCompare} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis
                    domain={[80, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="v1" fill="color-mix(in srgb, var(--primary) 45%, transparent)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="v2" fill="var(--color-primary)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </DashboardCard>

          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-sm">학습 이력</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>모델</TableHead>
                    <TableHead>완료</TableHead>
                    <TableHead>정확도</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs
                    .filter((j) => j.status === 'completed' || j.status === 'failed')
                    .map((j) => (
                      <TableRow key={j.id}>
                        <TableCell className="font-medium">{j.modelName}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {j.finishedAt ?? '-'}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {j.accuracy != null ? `${j.accuracy}%` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </DashboardCard>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>학습 작업 상세 — {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid gap-2 text-sm py-2">
              {[
                ['모델', selected.modelName],
                ['유형', selected.modelType],
                ['상태', selected.status],
                ['진행률', `${selected.progress}%`],
                ['Epoch', `${selected.currentEpoch} / ${selected.epochs}`],
                ['데이터셋', `${selected.dataset} (${selected.datasetSize})`],
                ['시작', selected.startedAt],
                ['종료', selected.finishedAt ?? '-'],
                ['정확도', selected.accuracy != null ? `${selected.accuracy}%` : '-'],
                ['Loss', selected.loss != null ? String(selected.loss) : '-'],
                ['요청자', selected.createdBy],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button className="cursor-pointer" onClick={() => setSelected(null)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={startOpen} onOpenChange={setStartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>학습 시작</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            대기 중인 학습 작업을 시작합니다. (Mock — 실제 학습은 수행되지 않습니다)
          </p>
          <DialogFooter>
            <Button variant="outline" className="cursor-pointer" onClick={() => setStartOpen(false)}>
              취소
            </Button>
            <Button className="cursor-pointer" onClick={startQueued}>
              대기 작업 시작
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
