import { Link } from 'react-router'
import { Factory } from 'lucide-react'

const FullLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 max-w-[160px] overflow-hidden">
      <div className="size-8 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
        <Factory className="size-4 text-primary" />
      </div>
      <div className="hidden lg:flex flex-col leading-tight min-w-0">
        <span className="text-sm font-semibold text-foreground truncate">Factory MLOps</span>
        <span className="text-[10px] text-muted-foreground truncate">통합 관제 플랫폼</span>
      </div>
    </Link>
  )
}

export default FullLogo
