import express, { type Request, type Response } from 'express';
import { randomUUID } from 'node:crypto';
import type { MaintenanceRecord } from '../../shared/src/types.js';
import { exportRecordsToCsv, readRecords, writeRecords } from './fileStore.js';
import { validateCreateRecordMiddleware } from './validation.js';

const app = express();
const port = 3001;

app.use(express.json());

app.get('/api/records', async (_req: Request, res: Response) => {
  const records = await readRecords();
  res.json(records);
});

app.post('/api/records', validateCreateRecordMiddleware, async (_req: Request, res: Response) => {
  const input = res.locals.validatedInput;
  const currentRecords = await readRecords();

  const newRecord: MaintenanceRecord = {
    id: randomUUID(),
    ...input
  };

  currentRecords.push(newRecord);
  await writeRecords(currentRecords);

  res.status(201).json(newRecord);
});

app.post('/api/export', async (_req: Request, res: Response) => {
  const records = await readRecords();
  const filePath = await exportRecordsToCsv(records);
  res.json({ message: 'CSV export completed.', filePath });
});

app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
