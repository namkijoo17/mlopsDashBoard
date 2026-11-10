





//   Message Data
interface MessageType {
  title: string;
  avatar: string;
  subtitle: string;
  color: string;
  time: string;
  badgeColor: string;
  isRead?: boolean;
}

import user1 from "@/assets/images/profile/user-1.png";
import user2 from "@/assets/images/profile/user-2.png";
import user3 from "@/assets/images/profile/user-3.png";
import user4 from "@/assets/images/profile/user-4.png";
import user5 from "@/assets/images/profile/user-5.png";

const MessagesLink: MessageType[] = [
  {
    avatar: user1,
    color: "bg-destructive",
    title: "Michell Flintoff",
    subtitle: "You: Yesterdy was great...",
    time: "just now",
    badgeColor: "bg-destructive",
    isRead: false,
  },
  {
    avatar: user2,
    color: "bg-primary",
    title: "Bianca Anderson",
    subtitle: "Nice looking dress you...",
    time: "5 mins ago",
    badgeColor: "bg-primary",
    isRead: false,
  },
  {
    avatar: user3,
    color: "bg-secondary",
    title: "Andrew Johnson",
    subtitle: "Sent a photo",
    time: "10 mins ago",
    badgeColor: "bg-chart-2",
    isRead: false,
  },
  {
    avatar: user4,
    color: "bg-chart-2",
    title: "Jolly Cummins",
    subtitle: "If I don't like something",
    time: "5 days ago",
    badgeColor: "bg-chart-4",
    isRead: true,
  },
  {
    avatar: user5,
    color: "bg-chart-1",
    title: "Josh Macklow",
    subtitle: "$230 deducted from account",
    time: "year ago",
    badgeColor: "bg-chart-2",
    isRead: true,
  },
];

//   Notification Data
import { AlertTriangle, Settings, LucideIcon, BrainCircuit, Thermometer, Factory } from 'lucide-react';

interface NotificationType {
  title: string;
  icon: LucideIcon;
  subtitle: string;
  bgcolor: string;
  color: string;
  time: string;
  isRead?: boolean;
}

const Notification: NotificationType[] = [
  {
    icon: AlertTriangle,
    bgcolor: "bg-red-500/10",
    color: 'text-red-400',
    title: "용접기 과열 감지",
    subtitle: "로봇 용접기 #1 온도 임계치 초과",
    time: "09:42",
    isRead: false,
  },
  {
    icon: Thermometer,
    bgcolor: "bg-amber-500/10",
    color: 'text-amber-400',
    title: "프레스 온도 상승",
    subtitle: "유압 프레스 #2 주의 구간 진입",
    time: "07:50",
    isRead: false,
  },
  {
    icon: BrainCircuit,
    bgcolor: "bg-sky-500/10",
    color: 'text-sky-400',
    title: "모델 배포 실패",
    subtitle: "Paint Thickness Estimator 엣지 배포 실패",
    time: "어제",
    isRead: false,
  },
  {
    icon: Factory,
    bgcolor: "bg-primary/5",
    color: 'text-primary',
    title: "학습 작업 완료",
    subtitle: "Assembly Vision Model 학습 완료",
    time: "11/04",
    isRead: true,
  },
  {
    icon: Settings,
    bgcolor: "bg-chart-1/10",
    color: 'text-chart-1',
    title: "정기 점검 예정",
    subtitle: "유압 프레스 #1 점검 D-3",
    time: "11/08",
    isRead: true,
  },
];

interface profileType {
  avatar: LucideIcon;
  title: string;
  href: string;
  badge: boolean;
}

import { User, Bell, LayoutDashboard } from 'lucide-react';

const profileDD: profileType[] = [
  {
    avatar: LayoutDashboard,
    title: '통합 대시보드',
    href: '/',
    badge: false
  },
  {
    avatar: Bell,
    title: '알림 관리',
    href: '/alerts',
    badge: true
  },
  {
    avatar: Factory,
    title: '설비 관리',
    href: '/equipment',
    badge: false
  },
  {
    avatar: User,
    title: '운영자 프로필',
    href: '/',
    badge: false
  },
  {
    avatar: Settings,
    title: '계정 설정',
    href: '/',
    badge: false
  }
];

export {



  MessagesLink,
  Notification,
  profileDD,
};
