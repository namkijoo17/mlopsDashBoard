import { Link, useParams } from 'react-router'
import { StatusBadge } from '@/components/mlops/status-badge'
import { DashboardCard } from '@/components/shared/dashboard-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { equipmentList, sensorSeries } from 'src/api/mlops/mlops-data'
import { ArrowLeft, Thermometer, Waves, Zap } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

const sensorConfig = {
  temperature: { label: '온도 (°C)', color: 'hsl(0 72% 55%)' },
  vibration: { label: '진동 (mm/s)', color: 'hsl(45 93% 47%)' },
  current: { label: '전류 (A)', color: 'var(--color-primary)' },
} satisfies ChartConfig

export default function EquipmentDetailPage() {
  const { id } = useParams()
  const equipment = equipmentList.find((e) => e.id === id)

  if (!equipment) {
    return (
      <div className="flex flex-col gap-3 items-start">
        <p className="text-muted-foreground">설비를 찾을 수 없습니다.</p>
        <Link to="/equipment" className="text-sm text-primary hover:underline">
          목록으로
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to="/equipment"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          설비 목록
        </Link>
        <span className="text-muted-foreground">/</span>
        <h2 className="text-lg font-semibold">{equipment.name}</h2>
        <StatusBadge kind="equipment" value={equipment.status} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-sm">설비 상세 정보</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3 text-sm">
              {[
                ['설비 ID', equipment.id],
                ['유형', equipment.type],
                ['공장', equipment.factoryName],
                ['생산라인', equipment.lineName],
                ['위치', equipment.location],
                ['가동률', `${equipment.uptime}%`],
                ['연결 모델', equipment.modelName ?? '-'],
                ['설치일', equipment.installedAt],
                ['최근 점검', equipment.lastMaintenance],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right">{value}</span>
                </div>
              ))}
            </CardContent>
          </DashboardCard>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <DashboardCard className="flex flex-col gap-0!">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-9 rounded-md bg-red-500/15 text-red-400 flex items-center justify-center">
                  <Thermometer className="size-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">온도</div>
                  <div className="text-lg font-semibold tabular-nums">
                    {equipment.sensors.temperature}°C
                  </div>
                </div>
              </CardContent>
            </DashboardCard>
            <DashboardCard className="flex flex-col gap-0!">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-9 rounded-md bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <Waves className="size-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">진동</div>
                  <div className="text-lg font-semibold tabular-nums">
                    {equipment.sensors.vibration} mm/s
                  </div>
                </div>
              </CardContent>
            </DashboardCard>
            <DashboardCard className="flex flex-col gap-0!">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-9 rounded-md bg-sky-500/15 text-sky-400 flex items-center justify-center">
                  <Zap className="size-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">전류</div>
                  <div className="text-lg font-semibold tabular-nums">
                    {equipment.sensors.current} A
                  </div>
                </div>
              </CardContent>
            </DashboardCard>
          </div>

          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-sm">센서 데이터 모니터링 (24h)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChartContainer config={sensorConfig} className="h-[280px]! w-full">
                <LineChart data={sensorSeries} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="time"
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
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(0 72% 55%)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="vibration"
                    stroke="hsl(45 93% 47%)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="var(--color-primary)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
