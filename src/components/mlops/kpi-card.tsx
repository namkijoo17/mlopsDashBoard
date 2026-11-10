import { DashboardCard } from '@/components/shared/dashboard-card'
import { CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const toneStyles = {
  default: 'text-foreground',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  danger: 'text-red-400',
  info: 'text-sky-400',
}

const iconTone = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-emerald-500/15 text-emerald-400',
  warning: 'bg-amber-500/15 text-amber-400',
  danger: 'bg-red-500/15 text-red-400',
  info: 'bg-sky-500/15 text-sky-400',
}

export function KpiCard({ title, value, subtitle, icon: Icon, tone = 'default' }: KpiCardProps) {
  return (
    <DashboardCard className="flex flex-col gap-0!">
      <CardContent className="p-4 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs text-muted-foreground">{title}</span>
          <span className={cn('text-2xl font-semibold tabular-nums tracking-tight', toneStyles[tone])}>
            {value}
          </span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
        <div className={cn('size-9 rounded-md flex items-center justify-center shrink-0', iconTone[tone])}>
          <Icon className="size-4" />
        </div>
      </CardContent>
    </DashboardCard>
  )
}
