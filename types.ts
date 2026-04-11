export type MaintenanceStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Deferred';

export interface MaintenanceRecord {
  id: string;
  assetName: string;
  category: string;
  technicianEmail: string;
  maintenanceDate: string;
  cost: number;
  status: MaintenanceStatus;
  notes: string;
}

export interface CreateMaintenanceRecordInput {
  assetName: string;
  category: string;
  technicianEmail: string;
  maintenanceDate: string;
  cost: number;
  status: MaintenanceStatus;
  notes: string;
}

export interface ValidationErrors {
  [key: string]: string;
}
