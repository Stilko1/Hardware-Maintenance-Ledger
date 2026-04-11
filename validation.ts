import type { NextFunction, Request, Response } from 'express';
import type {
  CreateMaintenanceRecordInput,
  MaintenanceStatus,
  ValidationErrors
} from '../../shared/src/types.js';

const allowedStatuses: MaintenanceStatus[] = [
  'Scheduled',
  'In Progress',
  'Completed',
  'Deferred'
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRecordInput(input: unknown): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!isObject(input)) {
    errors.general = 'Request body must be a valid object.';
    return errors;
  }

  const body = input as Record<string, unknown>;

  if (typeof body.assetName !== 'string' || body.assetName.trim() === '') {
    errors.assetName = 'Asset name is required.';
  }

  if (typeof body.category !== 'string' || body.category.trim() === '') {
    errors.category = 'Category is required.';
  }

  if (
    typeof body.technicianEmail !== 'string' ||
    !emailRegex.test(body.technicianEmail)
  ) {
    errors.technicianEmail = 'Technician email must be valid.';
  }

  if (
    typeof body.maintenanceDate !== 'string' ||
    !isValidDateWithinOneYear(body.maintenanceDate)
  ) {
    errors.maintenanceDate =
      'Maintenance date must be valid and within 12 months in the future.';
  }

  if (
    typeof body.cost !== 'number' ||
    Number.isNaN(body.cost) ||
    body.cost < 0
  ) {
    errors.cost = 'Cost must be a non-negative number.';
  }

  if (
    typeof body.status !== 'string' ||
    !allowedStatuses.includes(body.status as MaintenanceStatus)
  ) {
    errors.status = 'Status must be one of the allowed values.';
  }

  if (typeof body.notes !== 'string' || body.notes.trim().length < 10) {
    errors.notes = 'Notes must be at least 10 characters long.';
  }

  return errors;
}

export function toCreateRecordInput(input: unknown): CreateMaintenanceRecordInput {
  if (!isObject(input)) {
    throw new Error('Invalid request body.');
  }

  const body = input as Record<string, unknown>;

  return {
    assetName: String(body.assetName ?? '').trim(),
    category: String(body.category ?? '').trim(),
    technicianEmail: String(body.technicianEmail ?? '').trim(),
    maintenanceDate: new Date(String(body.maintenanceDate ?? '')).toISOString(),
    cost: Number(body.cost),
    status: String(body.status ?? '') as MaintenanceStatus,
    notes: String(body.notes ?? '').trim()
  };
}


export function validateCreateRecordMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validateRecordInput(req.body);

  if (Object.keys(errors).length > 0) {
    res.status(400).json({ errors });
    return;
  }

  res.locals.validatedInput = toCreateRecordInput(req.body);
  next();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidDateWithinOneYear(value: string): boolean {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 12);

  return date.getTime() <= maxDate.getTime();
}