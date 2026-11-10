import { useSidebar } from 'src/components/ui/sidebar'
import { Button } from 'src/components/ui/button'
import { PanelLeft } from 'lucide-react'
import { Separator } from 'src/components/ui/separator'
import { cn } from 'src/lib/utils'
import FullLogo from '../../shared/logo/FullLogo'
import Profile from './Profile'
import LightDark from './Light-Dark'
import Notifications from './Notifications'
import { useLocation } from 'react-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { factories } from 'src/api/mlops/mlops-data'
import { useMlops, type PeriodOption } from 'src/context/mlops-context'

const pageTitles: Record<string, string> = {
  '/': '통합 대시보드',
  '/equipment': '설비 관리',
  '/models': '모델 관리',
  '/digital-twin': '2.5D 디지털 트윈',
  '/training': '학습 관리',
  '/alerts': '알림 관리',
}

const periodLabels: { value: PeriodOption; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: '7d', label: '최근 7일' },
  { value: '30d', label: '최근 30일' },
]

function resolveTitle(pathname: string) {
  if (pathname.startsWith('/equipment/')) return '설비 상세'
  if (pathname.startsWith('/models/')) return '모델 상세'
  return pageTitles[pathname] ?? 'MLOps 관제'
}

const Header = () => {
  const { toggleSidebar } = useSidebar()
  const { pathname } = useLocation()
  const { factoryId, setFactoryId, period, setPeriod } = useMlops()
  const title = resolveTitle(pathname)

  return (
    <header className={cn('sticky top-0 z-2 bg-background border-b border-border')}>
      <nav>
        <div className="mx-auto flex flex-wrap items-center justify-between gap-2 p-2">
          <div className="flex gap-2 items-center min-w-0">
            <div className="block lg:hidden">
              <FullLogo />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="p-2 hover:bg-primary/5 rounded-full transition cursor-pointer"
              onClick={toggleSidebar}
            >
              <PanelLeft size={21} />
            </Button>

            <Separator
              orientation="vertical"
              className="h-4 mr-2 w-px ml-1 bg-border self-center max-lg:hidden"
            />

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">{title}</h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">공장 MLOps 통합 관제</p>
            </div>
          </div>

          <div className="flex sm:gap-2 gap-1 items-center flex-wrap justify-end">
            <Select value={factoryId} onValueChange={(v) => v && setFactoryId(v)}>
              <SelectTrigger className="h-8! w-[140px] sm:w-[160px] text-xs cursor-pointer">
                <SelectValue placeholder="공장 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  전체 공장
                </SelectItem>
                {factories.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="cursor-pointer">
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={period} onValueChange={(v) => v && setPeriod(v as PeriodOption)}>
              <SelectTrigger className="h-8! w-[110px] sm:w-[120px] text-xs cursor-pointer">
                <SelectValue placeholder="기간" />
              </SelectTrigger>
              <SelectContent>
                {periodLabels.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="cursor-pointer">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <LightDark />
            <Notifications className="sm:block hidden" />
            <Profile />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
