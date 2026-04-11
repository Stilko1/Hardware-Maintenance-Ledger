import { useEffect, useMemo, useState } from 'react';
import type { MaintenanceRecord } from '../../../shared/src/types.ts';
import { exportCsv, getRecords } from '../api';
import { StatusBadge } from '../components/StatusBadge';

type SortOrder = 'asc' | 'desc';

export function LedgerPage(): JSX.Element {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [dateOrder, setDateOrder] = useState<SortOrder>('desc');
  const [costOrder, setCostOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    async function load(): Promise<void> {
      const data = await getRecords();
      setRecords(data);
      setLoading(false);
    }

    void load();
  }, []);

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const dateDifference = new Date(a.maintenanceDate).getTime() - new Date(b.maintenanceDate).getTime();

      if (dateDifference !== 0) {
        return dateOrder === 'asc' ? dateDifference : -dateDifference;
      }

      const costDifference = a.cost - b.cost;
      return costOrder === 'asc' ? costDifference : -costDifference;
    });
  }, [records, dateOrder, costOrder]);

  const totalCost = useMemo(() => {
    return sortedRecords.reduce((sum, item) => sum + item.cost, 0);
  }, [sortedRecords]);

  async function handleExport(): Promise<void> {
    const filePath = await exportCsv();
    setMessage(`CSV file saved on server: ${filePath}`);
  }

  return (
    <section className="page-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Page 1</p>
          <h2>Maintenance Register</h2>
          <p className="section-text">All  records are listed here. Use the toolbar to sort or export data.</p>
      </div>
      </div>

      <div className="summary-grid">
        <article className="summary-card">
          <span className="summary-label">Visible Records</span>
          <strong>{sortedRecords.length}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">Total Visible Cost</span>
          <strong>{totalCost.toFixed(2)}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">Date Order</span>
          <strong>{dateOrder === 'asc' ? 'Ascending' : 'Descending'}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">Cost Order</span>
          <strong>{costOrder === 'asc' ? 'Low to High' : 'High to Low'}</strong>
        </article>
      </div>

      <div className="toolbar">
        <button className="primary-button" onClick={() => setDateOrder(dateOrder === 'asc' ? 'desc' : 'asc')}>
          Sort date: {dateOrder}
        </button>
        <button className="secondary-button" onClick={() => setCostOrder(costOrder === 'asc' ? 'desc' : 'asc')}>
          Sort cost: {costOrder}
        </button>
        <button className="secondary-button" onClick={() => void handleExport()}>
          Export CSV
        </button>
      </div>

      {message ? <p className="success-banner">{message}</p> : null}
      {loading ? <p className="info-text">Loading records...</p> : null}

      {!loading ? (
        sortedRecords.length > 0 ? (
          <div className="table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Category</th>
                  <th>Technician</th>
                  <th>Date</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.assetName}</strong>
                    </td>
                    <td>{record.category}</td>
                    <td>{record.technicianEmail}</td>
                    <td>{new Date(record.maintenanceDate).toLocaleDateString()}</td>
                    <td>{record.cost.toFixed(2)}</td>
                    <td>
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="notes-cell">{record.notes}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>Total visible cost</td>
                  <td>{totalCost.toFixed(2)}</td>
                  <td colSpan={2}>Records: {sortedRecords.length}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No records yet</h3>
            <p>Add a new maintenance record from the form page to populate the table.</p>
          </div>
        )
      ) : null}
    </section>
  );
}
