import React from 'react';
import '../styles/DashboardStats.css';

export default function DashboardStats({ totalExpenses, balances }) {
  // Find top spender
  let topSpender = { name: '', amount: 0 };
  Object.keys(balances).forEach(person => {
    if (balances[person].totalSpent > topSpender.amount) {
      topSpender = { name: person, amount: balances[person].totalSpent };
    }
  });

  return (
    <div className="stats-container">
      <div className="stat-card glass primary-gradient">
        <h3>Total Group Expenses</h3>
        <p className="stat-amount">₹{totalExpenses.toLocaleString()}</p>
      </div>
      <div className="stat-card glass secondary-gradient">
        <h3>Top Spender</h3>
        <p className="stat-amount">{topSpender.name}</p>
        <p className="stat-subtitle">₹{topSpender.amount.toLocaleString()} spent</p>
      </div>
      <div className="stat-card glass tertiary-gradient">
        <h3>Total Members</h3>
        <p className="stat-amount">{Object.keys(balances).length}</p>
      </div>
    </div>
  );
}
