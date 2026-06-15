import React, { useState } from 'react';
import '../styles/ImportReport.css';

export default function ImportReport({ anomalies }) {
  const [isOpen, setIsOpen] = useState(false);

  const downloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,Row,Detected Issue,Action Taken\n";
    anomalies.forEach(a => {
      csvContent += `${a.row},"${a.issue}","${a.action}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "import_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (anomalies.length === 0) return null;

  return (
    <div className="import-report-container">
      <button className="toggle-report-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Import Report' : `View Import Report (${anomalies.length} anomalies)`}
      </button>

      {isOpen && (
        <div className="report-panel glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3>Data Import Anomaly Log</h3>
            <button onClick={downloadReport} className="download-btn">Download CSV</button>
          </div>
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
