export interface ChildItem {
  id?: number | string
  name: string
  icon?: LucideIcon
  items?: ChildItem[]
  item?: unknown
  url?: string
  color?: string
  disabled?: boolean
  subtitle?: string
  badge?: boolean
  badgeType?: string
  badgeContent?: string
  isActive?: boolean
  external?: boolean
  isPro?: boolean
}

export interface MenuItem {
  heading?: string
  name?: string
  icon?: LucideIcon
  id?: number
  to?: string
  item?: MenuItem[]
  items?: ChildItem[]
  url?: string
  disabled?: boolean
  subtitle?: string
  badgeType?: string
  badge?: boolean
  badgeContent?: string
  isActive?: boolean
  isPro?: boolean
}

import { uniqueId } from 'lodash'
import {
  AlertTriangle,
  Boxes,
  BrainCircuit,
  Factory,
  LayoutDashboard,
  LucideIcon,
  Map,
} from 'lucide-react'

const SidebarContent: MenuItem[] = [
  {
    heading: 'MLOps 관제',
    items: [
      {
        id: uniqueId(),
        name: '통합 대시보드',
        icon: LayoutDashboard,
        url: '/',
      },
      {
        id: uniqueId(),
        name: '설비 관리',
        icon: Factory,
        url: '/equipment',
      },
      {
        id: uniqueId(),
        name: '모델 관리',
        icon: BrainCircuit,
        url: '/models',
      },
      {
        id: uniqueId(),
        name: '2.5D 디지털 트윈',
        icon: Map,
        url: '/digital-twin',
      },
      {
        id: uniqueId(),
        name: '학습 관리',
        icon: Boxes,
        url: '/training',
      },
      {
        id: uniqueId(),
        name: '알림 관리',
        icon: AlertTriangle,
        url: '/alerts',
      },
    ],
  },
]

export default SidebarContent
