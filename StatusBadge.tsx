import type { MaintenanceStatus } from '../../../shared/src/types.ts';

interface StatusBadgeProps {
  status: MaintenanceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
  let className = 'badge badge-gray';

  if (status === 'Completed') {
    className = 'badge badge-green';
  }

  if (status === 'In Progress') {
    className = 'badge badge-blue';
  }

  if (status === 'Deferred') {
    className = 'badge badge-red';
  }

  return <span className={className}>{status}</span>;
}
