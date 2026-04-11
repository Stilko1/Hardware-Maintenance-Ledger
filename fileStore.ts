import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { MaintenanceRecord } from '../../shared/src/types.js';

const recordsFilePath = path.join(process.cwd(), 'src', 'data', 'records.json');
const exportFilePath = path.join(process.cwd(), 'src', 'data', 'maintenance_export.csv');

export async function readRecords(): Promise<MaintenanceRecord[]> {
  const fileContent = await fs.readFile(recordsFilePath, 'utf-8');
  return JSON.parse(fileContent) as MaintenanceRecord[];
}

export async function writeRecords(records: MaintenanceRecord[]): Promise<void> {
  const jsonText = JSON.stringify(records, null, 2);
  await fs.writeFile(recordsFilePath, jsonText, 'utf-8');
}

function escapeCsvValue(value: string): string {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}

export async function exportRecordsToCsv(records: MaintenanceRecord[]): Promise<string> {
  const header = 'id,assetName,category,technicianEmail,maintenanceDate,cost,status,notes';

  const rows = records.map((record) => {
    return [
      escapeCsvValue(record.id),
      escapeCsvValue(record.assetName),
      escapeCsvValue(record.category),
      escapeCsvValue(record.technicianEmail),
      escapeCsvValue(record.maintenanceDate),
      String(record.cost),
      escapeCsvValue(record.status),
      escapeCsvValue(record.notes)
    ].join(',');
  });

  const csvText = [header, ...rows].join('\n');
  await fs.writeFile(exportFilePath, csvText, 'utf-8');
  return exportFilePath;
}
