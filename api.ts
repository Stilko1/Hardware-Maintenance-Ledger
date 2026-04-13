import type { CreateMaintenanceRecordInput, MaintenanceRecord } from '../../shared/src/types.ts';

export async function getRecords(): Promise<MaintenanceRecord[]> {
  const response = await fetch('/api/records');

  if (!response.ok) {
    throw new Error('Could not load records.');
  }

  return (await response.json()) as MaintenanceRecord[];
}

export async function createRecord(record: CreateMaintenanceRecordInput): Promise<Response> {
  return fetch('/api/records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(record)
  });
}

export async function exportCsv(): Promise<string> {
  const response = await fetch('/api/export', {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Export failed.');
  }

  const data = (await response.json()) as { filePath: string };
  return data.filePath;
}
