import { useEffect, useMemo, useState } from 'react'
import { OrthoView } from '@/components/mlops/cad-equipment-view'
import { Equipment3DViewport } from '@/components/mlops/equipment-3d-scene'
import { StatusBadge } from '@/components/mlops/status-badge'
import { DashboardCard } from '@/components/shared/dashboard-card'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { equipmentList, factories } from 'src/api/mlops/mlops-data'
import { useMlops } from 'src/context/mlops-context'
import { cn } from '@/lib/utils'
import {
  Box,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Eye,
  EyeOff,
  Ruler,
  Thermometer,
  Waves,
  Zap,
} from 'lucide-react'

interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
}

function buildModelTree(equipmentName: string, equipmentId: string): TreeNode {
  return {
    id: 'root',
    label: `${equipmentId.toUpperCase()} · ${equipmentName}`,
    children: [
      {
        id: 'annotations',
        label: 'Annotations',
        children: [
          { id: 'ann-front', label: 'Front' },
          { id: 'ann-top', label: 'Top' },
          { id: 'ann-right', label: 'Right' },
          { id: 'ann-origin', label: 'Origin' },
        ],
      },
      {
        id: 'assembly',
        label: 'Assembly',
        children: [
          { id: 'housing', label: 'Housing' },
          { id: 'cover', label: 'Cover' },
          { id: 'input-shaft', label: 'Input Shaft' },
          { id: 'gear-set', label: 'Gear Set' },
          { id: 'bearing-front', label: 'Bearing-Front' },
          { id: 'bearing-rear', label: 'Bearing-Rear' },
          { id: 'seal-input', label: 'Seal-Input' },
          { id: 'output-flange', label: 'Output Flange' },
          { id: 'fasteners', label: 'Fasteners' },
          { id: 'sensor-mount', label: 'Sensor Mount' },
        ],
      },
    ],
  }
}

const highlightable = new Set([
  'housing',
  'cover',
  'input-shaft',
  'gear-set',
  'bearing-front',
  'bearing-rear',
  'output-flange',
])

function TreeItem({
  node,
  depth,
  selectedId,
  hiddenIds,
  onSelect,
  onToggleVisible,
}: {
  node: TreeNode
  depth: number
  selectedId: string | null
  hiddenIds: Set<string>
  onSelect: (id: string) => void
  onToggleVisible: (id: string) => void
}) {
  const [open, setOpen] = useState(depth < 2)
  const hasChildren = !!node.children?.length
  const selected = selectedId === node.id

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 py-1 pr-2 text-xs cursor-pointer hover:bg-muted/50',
          selected && 'bg-primary/15 text-foreground',
        )}
        style={{ paddingLeft: 8 + depth * 12 }}
        onClick={() => onSelect(node.id)}
      >
        <button
          type="button"
          className="size-4 flex items-center justify-center text-muted-foreground cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) setOpen((v) => !v)
          }}
        >
          {hasChildren ? (
            open ? (
              <ChevronDown className="size-3" />
            ) : (
              <ChevronRight className="size-3" />
            )
          ) : (
            <span className="size-3" />
          )}
        </button>
        <Box className="size-3.5 text-muted-foreground shrink-0" />
        <span className="truncate flex-1">{node.label}</span>
        <button
          type="button"
          className="opacity-0 group-hover:opacity-100 size-4 text-muted-foreground cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onToggleVisible(node.id)
          }}
        >
          {hiddenIds.has(node.id) ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
        </button>
      </div>
      {hasChildren &&
        open &&
        node.children!.map((child) => (
          <TreeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            hiddenIds={hiddenIds}
            onSelect={onSelect}
            onToggleVisible={onToggleVisible}
          />
        ))}
    </div>
  )
}

export default function DigitalTwinPage() {
  const { factoryId } = useMlops()
  const activeFactoryId = factoryId === 'all' ? 'fac-01' : factoryId
  const factory = factories.find((f) => f.id === activeFactoryId) ?? factories[0]

  const items = useMemo(
    () => equipmentList.filter((e) => e.factoryId === factory.id),
    [factory.id],
  )

  const [equipmentId, setEquipmentId] = useState(items[0]?.id ?? '')
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())
  const [showDimensions, setShowDimensions] = useState(true)

  useEffect(() => {
    setEquipmentId(items[0]?.id ?? '')
    setSelectedPart(null)
  }, [factory.id, items])

  const equipment = items.find((e) => e.id === equipmentId) ?? items[0]
  const tree = useMemo(
    () =>
      equipment
        ? buildModelTree(equipment.name, equipment.id)
        : { id: 'root', label: 'No Model', children: [] },
    [equipment],
  )

  const partForHighlight =
    selectedPart && highlightable.has(selectedPart) ? selectedPart : null

  if (!equipment) {
    return (
      <div className="text-sm text-muted-foreground">이 공장에 표시할 설비가 없습니다.</div>
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full min-h-[640px]">
      {/* CAD-like toolbar */}
      <div className="flex flex-wrap items-center gap-2 border border-border bg-background px-3 py-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
          <Crosshair className="size-3.5" />
          <span className="font-medium text-foreground">3D Digital Twin</span>
          <span>·</span>
          <span>{factory.name}</span>
        </div>
        <Separator orientation="vertical" className="h-5" />
        <Select value={equipment.id} onValueChange={(v) => v && setEquipmentId(v)}>
          <SelectTrigger className="h-8! w-[220px] text-xs cursor-pointer">
            <SelectValue placeholder="설비 선택" />
          </SelectTrigger>
          <SelectContent>
            {items.map((eq) => (
              <SelectItem key={eq.id} value={eq.id} className="cursor-pointer text-xs">
                {eq.name} · {eq.lineName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant={showDimensions ? 'secondary' : 'outline'}
          className="cursor-pointer h-8"
          onClick={() => setShowDimensions((v) => !v)}
        >
          <Ruler className="size-3.5" />
          Dimensions
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge kind="equipment" value={equipment.status} />
          <span className="text-xs text-muted-foreground tabular-nums">
            {equipment.id.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left: Model tree */}
        <div className="col-span-12 lg:col-span-2 min-h-[280px]">
          <DashboardCard className="flex flex-col gap-0! h-full">
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Model
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-[520px]">
                <div className="py-1">
                  <TreeItem
                    node={tree}
                    depth={0}
                    selectedId={selectedPart}
                    hiddenIds={hiddenIds}
                    onSelect={setSelectedPart}
                    onToggleVisible={(id) =>
                      setHiddenIds((prev) => {
                        const next = new Set(prev)
                        if (next.has(id)) next.delete(id)
                        else next.add(id)
                        return next
                      })
                    }
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </DashboardCard>
        </div>

        {/* Center: main 3D viewport + ortho */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-3 min-h-0">
          <DashboardCard className="flex flex-col gap-0! flex-1">
            <CardHeader className="border-b border-border py-2.5 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-mono text-muted-foreground">
                Viewport · Perspective 3D · drag to orbit
              </CardTitle>
              <span className="text-[10px] text-muted-foreground">
                PMI {showDimensions ? 'ON' : 'OFF'}
                {partForHighlight ? ` · Focus: ${partForHighlight}` : ''}
              </span>
            </CardHeader>
            <CardContent className="p-0 bg-[#0c0f14]">
              <div className="h-[420px] w-full">
                <Equipment3DViewport
                  status={equipment.status}
                  selectedPart={partForHighlight}
                  hiddenParts={hiddenIds}
                  showDimensions={showDimensions}
                  autoRotateGears
                />
              </div>
            </CardContent>
          </DashboardCard>

          <div className="grid grid-cols-3 gap-3">
            <OrthoView label="Top View" variant="top" status={equipment.status} />
            <OrthoView label="Right View" variant="right" status={equipment.status} />
            <OrthoView label="Front View" variant="front" status={equipment.status} />
          </div>
        </div>

        {/* Right: properties / sensors / AI */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex flex-col gap-2.5 text-xs">
              {[
                ['Equipment', equipment.name],
                ['Type', equipment.type],
                ['Line', equipment.lineName],
                ['Location', equipment.location],
                ['Uptime', `${equipment.uptime}%`],
                ['Installed', equipment.installedAt],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium text-right truncate max-w-[60%]">{v}</span>
                </div>
              ))}
            </CardContent>
          </DashboardCard>

          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Live Sensors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Thermometer className="size-3.5" /> Temperature
                </span>
                <span className="tabular-nums font-medium">
                  {equipment.sensors.temperature}°C
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Waves className="size-3.5" /> Vibration
                </span>
                <span className="tabular-nums font-medium">
                  {equipment.sensors.vibration} mm/s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Zap className="size-3.5" /> Current
                </span>
                <span className="tabular-nums font-medium">{equipment.sensors.current} A</span>
              </div>
            </CardContent>
          </DashboardCard>

          <DashboardCard className="flex flex-col gap-0!">
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Linked AI Model
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex flex-col gap-2 text-xs">
              <div className="font-medium text-sm">{equipment.modelName ?? '미연결'}</div>
              {equipment.modelId && (
                <div className="text-muted-foreground font-mono">{equipment.modelId}</div>
              )}
              <Separator className="my-1" />
              <p className="text-muted-foreground leading-relaxed">
                Three.js 실시간 3D 뷰포트입니다. 드래그로 회전, 스크롤로 줌, 좌측 트리로 부품
                하이라이트가 가능합니다.
              </p>
            </CardContent>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
