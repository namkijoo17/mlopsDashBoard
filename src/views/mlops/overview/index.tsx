import { KpiCard } from '@/components/mlops/kpi-card'
import { StatusBadge } from '@/components/mlops/status-badge'
import { DashboardCard } from '@/components/shared/dashboard-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  factories,
  inferenceChartData,
  overviewEvents,
  overviewKpis,
  uptimeChartData,
} from 'src/api/mlops/mlops-data'
import { useMlops } from 'src/context/mlops-context'
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Factory,
  XCircle,
} from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const uptimeConfig = {
  uptime: { label: '가동률', color: 'var(--color-primary)' },
  target: { label: '목표', color: 'hsl(var(--muted-foreground))' },
} satisfies ChartConfig

const inferenceConfig = {
  inferences: { label: '추론 건수', color: 'var(--color-primary)' },
  anomalies: { label: '이상 탐지', color: 'hsl(0 72% 55%)' },
} satisfies ChartConfig

export default function OverviewPage() {
  const { factoryName, period } = useMlops()
  const periodLabel = period === 'today' ? '오늘' : period === '7d' ? '최근 7일' : '최근 30일'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {factoryName} · {periodLabel} 기준 운영 현황
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard title="전체 설비" value={overviewKpis.totalEquipment} icon={Factory} />
        <KpiCard
          title="정상 설비"
          value={overviewKpis.normalEquipment}
          icon={CheckCircle2}
          tone="success"
        />
        <KpiCard
          title="이상 설비"
          value={overviewKpis.abnormalEquipment}
          icon={XCircle}
          tone="danger"
        />
        <KpiCard
          title="운영 AI 모델"
          value={overviewKpis.activeModels}
          icon={BrainCircuit}
          tone="info"
        />
        <KpiCard
          title="오늘 이상 탐지"
          value={overviewKpis.todayAnomalies}
          icon={AlertTriangle}
          tone="warning"
          subtitle="건"
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity size={16} className="text-muted-foreground" />
                설비 가동률
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChartContainer config={uptimeConfig} className="h-[240px]! w-full">
                <AreaChart data={uptimeChartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    tickFormatter={(v) => `${v}시`}
                  />
                  <YAxis
                    domain={[80, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="var(--muted-foreground)"
                    fill="transparent"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                  <Area
                    type="monotone"
                    dataKey="uptime"
                    stroke="var(--color-primary)"
                    fill="color-mix(in srgb, var(--primary) 20%, transparent)"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </DashboardCard>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BrainCircuit size={16} className="text-muted-foreground" />
                AI 모델 추론 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChartContainer config={inferenceConfig} className="h-[240px]! w-full">
                <BarChart data={inferenceChartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="inferences" fill="var(--color-primary)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="anomalies" fill="hsl(0 72% 55%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </DashboardCard>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-sm">최근 장애 및 이벤트</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시간</TableHead>
                    <TableHead>공장</TableHead>
                    <TableHead>설비</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>심각도</TableHead>
                    <TableHead>내용</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overviewEvents.map((ev) => (
                    <TableRow key={ev.id}>
                      <TableCell className="tabular-nums text-muted-foreground">{ev.time}</TableCell>
                      <TableCell>{ev.factory}</TableCell>
                      <TableCell>{ev.equipment}</TableCell>
                      <TableCell>{ev.type}</TableCell>
                      <TableCell>
                        <StatusBadge kind="severity" value={ev.severity} />
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate">{ev.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </DashboardCard>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-sm">공장별 운영 현황</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3">
              {factories.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-3 border border-border p-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{f.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {f.location} · 라인 {f.lines} · 설비 {f.equipmentCount}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge kind="equipment" value={f.status} />
                    <span className="text-xs tabular-nums text-muted-foreground">
                      가동률 {f.uptime}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
