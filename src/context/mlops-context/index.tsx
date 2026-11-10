import { createContext, useContext, useMemo, useState } from 'react'
import { factories } from 'src/api/mlops/mlops-data'

export type PeriodOption = 'today' | '7d' | '30d'

interface MlopsContextType {
  factoryId: string
  setFactoryId: (id: string) => void
  period: PeriodOption
  setPeriod: (period: PeriodOption) => void
  factoryName: string
}

const MlopsContext = createContext<MlopsContextType | null>(null)

export function MlopsProvider({ children }: { children: React.ReactNode }) {
  const [factoryId, setFactoryId] = useState<string>('all')
  const [period, setPeriod] = useState<PeriodOption>('today')

  const factoryName = useMemo(() => {
    if (factoryId === 'all') return '전체 공장'
    return factories.find((f) => f.id === factoryId)?.name ?? '전체 공장'
  }, [factoryId])

  return (
    <MlopsContext.Provider
      value={{ factoryId, setFactoryId, period, setPeriod, factoryName }}
    >
      {children}
    </MlopsContext.Provider>
  )
}

export function useMlops() {
  const ctx = useContext(MlopsContext)
  if (!ctx) throw new Error('useMlops must be used within MlopsProvider')
  return ctx
}
