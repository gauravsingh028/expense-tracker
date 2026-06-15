import React from 'react';
import '../styles/Balances.css';

export default function Balances({ balances }) {
  const people = Object.keys(balances);

  return (
    <div className="balances-container glass">
      <h2>Who owes whom?</h2>
      <div className="balances-grid">
        {people.map(person => {
          const { owes, netBalance } = balances[person];
          const oweKeys = Object.keys(owes);
          
          if (oweKeys.length === 0 && netBalance >= 0) {
            return (
              <div key={person} className="balance-card settled">
                <div className="person-header">
                  <span className="avatar lg">{person.charAt(0)}</span>
                  <h4>{person}</h4>
                </div>
                <p className="status text-success">Settled up!</p>
              </div>
            );
          }

          return (
            <div key={person} className="balance-card">
              <div className="person-header">
                <span className="avatar lg">{person.charAt(0)}</span>
                <h4>{person}</h4>
              </div>
              <div className="debts-list">
                {oweKeys.map(owedTo => {
                  const amount = owes[owedTo];
                  if (amount > 0) {
                    return (
                      <div key={owedTo} className="debt-item">
                        <span>Owes <strong>{owedTo}</strong></span>
                        <span className="text-danger fw-bold">₹{amount.toFixed(2)}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              <div className="net-balance">
                <span>Net Balance:</span>
                <span className={netBalance >= 0 ? 'text-success' : 'text-danger'}>
                  {netBalance >= 0 ? '+' : ''}₹{netBalance.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
