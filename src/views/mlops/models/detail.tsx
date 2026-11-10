import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { StatusBadge } from '@/components/mlops/status-badge'
import { DashboardCard } from '@/components/shared/dashboard-card'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { aiModels } from 'src/api/mlops/mlops-data'
import type { DeployStatus } from 'src/types/mlops'
import { ArrowLeft } from 'lucide-react'

export default function ModelDetailPage() {
  const { id } = useParams()
  const base = aiModels.find((m) => m.id === id)
  const [deployStatus, setDeployStatus] = useState<DeployStatus | undefined>(base?.deployStatus)

  if (!base) {
    return (
      <div className="flex flex-col gap-3 items-start">
        <p className="text-muted-foreground">모델을 찾을 수 없습니다.</p>
        <Link to="/models" className="text-sm text-primary hover:underline">
          목록으로
        </Link>
      </div>
    )
  }

  const currentDeploy = deployStatus ?? base.deployStatus

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/models"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            모델 목록
          </Link>
          <span className="text-muted-foreground">/</span>
          <h2 className="text-lg font-semibold">{base.name}</h2>
          <StatusBadge kind="model" value={base.status} />
          <StatusBadge kind="deploy" value={currentDeploy} />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="cursor-pointer"
            disabled={currentDeploy === 'deployed'}
            onClick={() => setDeployStatus('deployed')}
          >
            배포
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer"
            disabled={currentDeploy === 'undeployed'}
            onClick={() => setDeployStatus('undeployed')}
          >
            배포 취소
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-sm">모델 상세</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3 text-sm">
              {[
                ['모델 ID', base.id],
                ['유형', base.type],
                ['적용 설비', base.equipmentName],
                ['현재 버전', base.version],
                ['최근 배포', base.lastDeployedAt],
                ['누적 추론', `${base.inferenceCount.toLocaleString()}건`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right">{value}</span>
                </div>
              ))}
              <p className="text-muted-foreground pt-1">{base.description}</p>
            </CardContent>
          </DashboardCard>
        </div>

        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ['Accuracy', base.accuracy],
              ['Precision', base.precision],
              ['Recall', base.recall],
              ['F1 Score', base.f1Score],
            ].map(([label, value]) => (
              <DashboardCard key={String(label)} className="flex flex-col gap-0!">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-xl font-semibold tabular-nums mt-1">{value}%</div>
                </CardContent>
              </DashboardCard>
            ))}
          </div>

          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-sm">버전 관리</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>버전</TableHead>
                    <TableHead>정확도</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {base.versions.map((v) => (
                    <TableRow key={v.version}>
                      <TableCell className="font-medium tabular-nums">{v.version}</TableCell>
                      <TableCell className="tabular-nums">{v.accuracy}%</TableCell>
                      <TableCell>{v.createdAt}</TableCell>
                      <TableCell>
                        <StatusBadge kind="deploy" value={v.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{v.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
