import { useEffect, useMemo, useState } from 'react';
import type { MaintenanceRecord } from '../../../shared/src/types.ts';
import { getRecords } from '../api';

export function StatisticsPage(): JSX.Element {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);

  useEffect(() => {
    async function load(): Promise<void> {
      const data = await getRecords();
      setRecords(data);
    }

    void load();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const record of records) {
      counts[record.category] = (counts[record.category] ?? 0) + 1;
    }

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [records]);

  return (
    <section className="page-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Page 3</p>
          <h2>Statistics</h2>
          <p className="section-text">This summary groups the current maintenance records by category and shows how many assets appear in each one.</p>
        </div>
      </div>

      <div className="stats-grid">
        {categoryCounts.map(([category, count]) => (
          <article key={category} className="stats-card">
            <span className="stats-label">Category</span>
            <h3>{category}</h3>
            <p>{count} asset record{count === 1 ? '' : 's'}</p>
          </article>
        ))}
      </div>

      {categoryCounts.length === 0 ? (
        <div className="empty-state">
          <h3>No statistics available</h3>
          <p>Add some records first and the categories will appear here automatically.</p>
        </div>
      ) : null}
    </section>
  );
}
