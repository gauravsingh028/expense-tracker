import React, { useState } from 'react';
import '../styles/ImportReport.css';

export default function ImportReport({ anomalies }) {
  const [isOpen, setIsOpen] = useState(false);

  if (anomalies.length === 0) return null;

  return (
    <div className="import-report-container">
      <button className="toggle-report-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Import Report' : `View Import Report (${anomalies.length} anomalies)`}
      </button>

      {isOpen && (
        <div className="report-panel glass">
          <h3>Data Import Anomaly Log</h3>
          <p className="report-subtitle">The following issues were detected and auto-corrected during CSV ingestion:</p>
          
          <div className="table-responsive">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Detected Issue</th>
                  <th>Action Taken</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.map((a, idx) => (
                  <tr key={idx}>
                    <td>#{a.row}</td>
                    <td className="text-danger">{a.issue}</td>
                    <td className="text-success">{a.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
