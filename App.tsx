import { NavLink, Route, Routes } from 'react-router-dom';
import { LedgerPage } from './pages/LedgerPage';
import { NewRecordPage } from './pages/NewRecordPage';
import { StatisticsPage } from './pages/StatisticsPage';

function App(): JSX.Element {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-block">
          <div className="brand-logo" aria-hidden="true">
            HL
          </div>
          <div>
            <p className="eyebrow">Technical Support Register</p>
            <h1>Hardware Maintenance Ledger</h1>
            <p className="subtitle">Track company assets, maintenance costs and service status in one place.</p>
          </div>
        </div>

        <nav className="main-nav" aria-label="Primary navigation">
          <NavLink to="/">Ledger</NavLink>
          <NavLink to="/new">New Record</NavLink>
          <NavLink to="/statistics">Statistics</NavLink>
        </nav>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<LedgerPage />} />
          <Route path="/new" element={<NewRecordPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div>
          
          <p>Hardware Maintenance Ledger.website</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
