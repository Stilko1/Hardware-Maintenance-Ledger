import { useState } from 'react';
import type { CreateMaintenanceRecordInput, MaintenanceStatus, ValidationErrors } from '../../../shared/src/types.ts';
import { createRecord } from '../api';

const statusOptions: MaintenanceStatus[] = ['Scheduled', 'In Progress', 'Completed', 'Deferred'];

const initialForm: CreateMaintenanceRecordInput = {
  assetName: '',
  category: '',
  technicianEmail: '',
  maintenanceDate: '',
  cost: 0,
  status: 'Scheduled',
  notes: ''
};

export function NewRecordPage(): JSX.Element {
  const [form, setForm] = useState<CreateMaintenanceRecordInput>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [message, setMessage] = useState<string>('');

  function validateLive(nextForm: CreateMaintenanceRecordInput): ValidationErrors {
    const nextErrors: ValidationErrors = {};

    if (nextForm.assetName.trim() === '') {
      nextErrors.assetName = 'Asset name is required.';
    }

    if (nextForm.category.trim() === '') {
      nextErrors.category = 'Category is required.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextForm.technicianEmail)) {
      nextErrors.technicianEmail = 'Enter a valid email address.';
    }

    if (nextForm.notes.trim().length < 10) {
      nextErrors.notes = 'Notes must be at least 10 characters.';
    }

    if (nextForm.cost < 0) {
      nextErrors.cost = 'Cost cannot be negative.';
    }

    if (nextForm.maintenanceDate === '') {
      nextErrors.maintenanceDate = 'Choose a date.';
    }

    return nextErrors;
  }

  function updateField<K extends keyof CreateMaintenanceRecordInput>(key: K, value: CreateMaintenanceRecordInput[K]): void {
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);
    setErrors(validateLive(nextForm));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const liveErrors = validateLive(form);
    setErrors(liveErrors);

    if (Object.keys(liveErrors).length > 0) {
      return;
    }

    const payload: CreateMaintenanceRecordInput = {
      ...form,
      maintenanceDate: new Date(form.maintenanceDate).toISOString()
    };

    const response = await createRecord(payload);
    const data = (await response.json()) as { errors?: ValidationErrors };

    if (!response.ok) {
      setErrors(data.errors ?? { general: 'Could not save record.' });
      setMessage('');
      return;
    }

    setMessage('Record saved successfully.');
    setErrors({});
    setForm(initialForm);
  }

  return (
    <section className="page-panel form-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Page 2</p>
          <h2>Create New Record</h2>
          <p className="section-text">Use the controlled form below to add a maintenance entry. </p>
        </div>
      </div>

      {message ? <p className="success-banner">{message}</p> : null}
      {errors.general ? <p className="error-banner">{errors.general}</p> : null}

      <form className="record-form" onSubmit={(event) => void handleSubmit(event)}>
        <label>
          <span>Asset Name</span>
          <input value={form.assetName} onChange={(event) => updateField('assetName', event.target.value)} placeholder="Dell XPS 15" />
          {errors.assetName ? <span className="error-text">{errors.assetName}</span> : null}
        </label>

        <label>
          <span>Category</span>
          <input value={form.category} onChange={(event) => updateField('category', event.target.value)} placeholder="Laptop" />
          {errors.category ? <span className="error-text">{errors.category}</span> : null}
        </label>

        <label>
          <span>Technician Email</span>
          <input
            type="email"
            value={form.technicianEmail}
            onChange={(event) => updateField('technicianEmail', event.target.value)}
            placeholder="tech@example.com"
          />
          {errors.technicianEmail ? <span className="error-text">{errors.technicianEmail}</span> : null}
        </label>

        <label>
          <span>Maintenance Date</span>
          <input
            type="date"
            value={form.maintenanceDate}
            onChange={(event) => updateField('maintenanceDate', event.target.value)}
          />
          {errors.maintenanceDate ? <span className="error-text">{errors.maintenanceDate}</span> : null}
        </label>

        <label>
          <span>Cost</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.cost}
            onChange={(event) => updateField('cost', Number(event.target.value))}
          />
          {errors.cost ? <span className="error-text">{errors.cost}</span> : null}
        </label>

        <label>
          <span>Status</span>
          <select value={form.status} onChange={(event) => updateField('status', event.target.value as MaintenanceStatus)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="full-width">
          <span>Notes</span>
          <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows={5} placeholder="Describe the maintenance work performed or planned." />
          {errors.notes ? <span className="error-text">{errors.notes}</span> : null}
        </label>

        <div className="form-actions full-width">
          <button className="primary-button" type="submit">Save Record</button>
        </div>
      </form>
    </section>
  );
}
