import { Activity } from 'lucide-react'

export function NavSecondary() {
  return (
    <div className="-mx-4 border-t border-b border-border px-5 py-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-4 shrink-0 text-emerald-400" />
            <span className="font-medium text-sm text-foreground">시스템 상태</span>
          </div>
          <span className="text-xs text-emerald-400">정상</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-foreground/10 overflow-hidden">
          <div className="h-full w-[94%] bg-emerald-500 rounded-full" />
        </div>
        <p className="text-xs text-muted-foreground text-center">전체 가동률 94.2%</p>
      </div>
    </div>
  )
}
