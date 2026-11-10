import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type {
  AlertActionStatus,
  AlertSeverity,
  DeployStatus,
  EquipmentStatus,
  ModelStatus,
  TrainingStatus,
} from 'src/types/mlops'

const equipmentMap: Record<EquipmentStatus, { label: string; className: string }> = {
  normal: { label: '정상', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  warning: { label: '주의', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  fault: { label: '장애', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  offline: { label: '오프라인', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
}

const modelMap: Record<ModelStatus, { label: string; className: string }> = {
  active: { label: '운영중', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  inactive: { label: '비활성', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
  training: { label: '학습중', className: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  deprecated: { label: '폐기', className: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
}

const deployMap: Record<DeployStatus, { label: string; className: string }> = {
  deployed: { label: '배포됨', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  staging: { label: '스테이징', className: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  undeployed: { label: '미배포', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
  failed: { label: '실패', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

const trainingMap: Record<TrainingStatus, { label: string; className: string }> = {
  queued: { label: '대기', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
  running: { label: '진행 중', className: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  completed: { label: '완료', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  failed: { label: '실패', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

const severityMap: Record<AlertSeverity, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  warning: { label: 'Warning', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  info: { label: 'Info', className: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
}

const actionMap: Record<AlertActionStatus, { label: string; className: string }> = {
  open: { label: '미조치', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  acknowledged: { label: '확인됨', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  resolved: { label: '조치완료', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
}

type Props =
  | { kind: 'equipment'; value: EquipmentStatus }
  | { kind: 'model'; value: ModelStatus }
  | { kind: 'deploy'; value: DeployStatus }
  | { kind: 'training'; value: TrainingStatus }
  | { kind: 'severity'; value: AlertSeverity }
  | { kind: 'action'; value: AlertActionStatus }

export function StatusBadge(props: Props) {
  const map =
    props.kind === 'equipment'
      ? equipmentMap[props.value]
      : props.kind === 'model'
        ? modelMap[props.value]
        : props.kind === 'deploy'
          ? deployMap[props.value]
          : props.kind === 'training'
            ? trainingMap[props.value]
            : props.kind === 'severity'
              ? severityMap[props.value]
              : actionMap[props.value]

  return (
    <Badge variant="outline" className={cn('rounded-md font-medium', map.className)}>
      {map.label}
    </Badge>
  )
}
