export type EquipmentStatus = 'normal' | 'warning' | 'fault' | 'offline'
export type ModelStatus = 'active' | 'inactive' | 'training' | 'deprecated'
export type DeployStatus = 'deployed' | 'staging' | 'undeployed' | 'failed'
export type TrainingStatus = 'queued' | 'running' | 'completed' | 'failed'
export type AlertSeverity = 'critical' | 'warning' | 'info'
export type AlertActionStatus = 'open' | 'acknowledged' | 'resolved'

export interface Factory {
  id: string
  name: string
  location: string
  lines: number
  equipmentCount: number
  uptime: number
  status: EquipmentStatus
}

export interface ProductionLine {
  id: string
  factoryId: string
  name: string
  equipmentCount: number
  status: EquipmentStatus
}

export interface Equipment {
  id: string
  name: string
  type: string
  factoryId: string
  factoryName: string
  lineId: string
  lineName: string
  location: string
  status: EquipmentStatus
  uptime: number
  modelId?: string
  modelName?: string
  lastMaintenance: string
  installedAt: string
  twinX: number
  twinY: number
  sensors: {
    temperature: number
    vibration: number
    current: number
  }
}

export interface SensorSeriesPoint {
  time: string
  temperature: number
  vibration: number
  current: number
}

export interface AiModel {
  id: string
  name: string
  type: string
  equipmentId: string
  equipmentName: string
  version: string
  status: ModelStatus
  deployStatus: DeployStatus
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  inferenceCount: number
  lastDeployedAt: string
  description: string
  versions: ModelVersion[]
}

export interface ModelVersion {
  version: string
  accuracy: number
  createdAt: string
  status: DeployStatus
  notes: string
}

export interface TrainingJob {
  id: string
  modelName: string
  modelType: string
  status: TrainingStatus
  progress: number
  dataset: string
  datasetSize: string
  startedAt: string
  finishedAt?: string
  accuracy?: number
  loss?: number
  epochs: number
  currentEpoch: number
  createdBy: string
}

export interface AlertItem {
  id: string
  title: string
  message: string
  severity: AlertSeverity
  status: AlertActionStatus
  factoryId: string
  factoryName: string
  equipmentId: string
  equipmentName: string
  createdAt: string
  acknowledgedAt?: string
  resolvedAt?: string
}

export interface OverviewEvent {
  id: string
  time: string
  factory: string
  equipment: string
  type: string
  severity: AlertSeverity
  message: string
}

export interface UptimePoint {
  hour: string
  uptime: number
  target: number
}

export interface InferencePoint {
  hour: string
  inferences: number
  anomalies: number
}
