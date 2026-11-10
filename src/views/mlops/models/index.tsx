import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { KpiCard } from '@/components/mlops/kpi-card'
import { StatusBadge } from '@/components/mlops/status-badge'
import { DashboardCard } from '@/components/shared/dashboard-card'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { aiModels } from 'src/api/mlops/mlops-data'
import type { AiModel, DeployStatus } from 'src/types/mlops'
import { BrainCircuit, Rocket, Search } from 'lucide-react'

export default function ModelsPage() {
  const [search, setSearch] = useState('')
  const [deployFilter, setDeployFilter] = useState('all')
  const [models, setModels] = useState<AiModel[]>(aiModels)

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (deployFilter !== 'all' && m.deployStatus !== deployFilter) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        m.name.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q) ||
        m.equipmentName.toLowerCase().includes(q)
      )
    })
  }, [models, search, deployFilter])

  const toggleDeploy = (id: string) => {
    setModels((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        const next: DeployStatus = m.deployStatus === 'deployed' ? 'undeployed' : 'deployed'
        return {
          ...m,
          deployStatus: next,
          status: next === 'deployed' ? 'active' : m.status === 'training' ? m.status : 'inactive',
        }
      }),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="전체 모델" value={models.length} icon={BrainCircuit} />
        <KpiCard
          title="배포됨"
          value={models.filter((m) => m.deployStatus === 'deployed').length}
          icon={Rocket}
          tone="success"
        />
        <KpiCard
          title="스테이징"
          value={models.filter((m) => m.deployStatus === 'staging').length}
          icon={BrainCircuit}
          tone="info"
        />
        <KpiCard
          title="학습중"
          value={models.filter((m) => m.status === 'training').length}
          icon={BrainCircuit}
          tone="warning"
        />
      </div>

      <DashboardCard className="flex flex-col gap-0!">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-sm">AI 모델 목록</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8 h-9"
                placeholder="모델명, 유형, 설비 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={deployFilter} onValueChange={(v) => v && setDeployFilter(v)}>
              <SelectTrigger className="h-9! w-[150px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  전체 배포상태
                </SelectItem>
                <SelectItem value="deployed" className="cursor-pointer">
                  배포됨
                </SelectItem>
                <SelectItem value="staging" className="cursor-pointer">
                  스테이징
                </SelectItem>
                <SelectItem value="undeployed" className="cursor-pointer">
                  미배포
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
                <TableHead>모델명</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>적용 설비</TableHead>
                <TableHead>버전</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>배포</TableHead>
                <TableHead>정확도</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.type}</TableCell>
                  <TableCell>{m.equipmentName}</TableCell>
                  <TableCell className="tabular-nums">{m.version}</TableCell>
                  <TableCell>
                    <StatusBadge kind="model" value={m.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge kind="deploy" value={m.deployStatus} />
                  </TableCell>
                  <TableCell className="tabular-nums">{m.accuracy}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/models/${m.id}`}
                        className="inline-flex h-7 items-center px-2.5 text-[0.8rem] hover:bg-muted rounded-lg cursor-pointer"
                      >
                        상세
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => toggleDeploy(m.id)}
                      >
                        {m.deployStatus === 'deployed' ? '배포 취소' : '배포'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </DashboardCard>
    </div>
  )
}
