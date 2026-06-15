import React from 'react';
import '../styles/ExpenseList.css';

export default function ExpenseList({ expenses }) {
  return (
    <div className="expense-list-container glass">
      <h2>Recent Expenses</h2>
      <div className="table-responsive">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Paid By</th>
              <th>Amount</th>
              <th>Split With</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td className="fw-bold">{expense.description}</td>
                <td><span className="badge badge-payer">{expense.paid_by}</span></td>
                <td className="amount">₹{expense.amount.toLocaleString()}</td>
                <td>
                  <div className="split-avatars">
                    {expense.split_with.map((person, idx) => (
                      <span key={idx} className="avatar" title={person}>{person.charAt(0)}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
