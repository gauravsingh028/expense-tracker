import React, { useState, useEffect } from 'react';
import { expensesData } from './data';
import { calculateBalances, getTotalExpenses } from './utils';
import DashboardStats from './components/DashboardStats';
import ExpenseList from './components/ExpenseList';
import Balances from './components/Balances';
import AddExpenseModal from './components/AddExpenseModal';
import './styles/App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate data fetching
    setExpenses(expensesData);
    setBalances(calculateBalances(expensesData));
    setTotalExpenses(getTotalExpenses(expensesData));
  }, []);

  const handleAddExpense = (newExpense) => {
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    setBalances(calculateBalances(updatedExpenses));
    setTotalExpenses(getTotalExpenses(updatedExpenses));
  };

  return (
    <div className="app-container">
      <header className="app-header glass">
        <div className="logo-area">
          <div className="logo-icon">💸</div>
          <h1>SplitTrack</h1>
        </div>
        <nav>
          <a href="#" className="active">Dashboard</a>
          <a href="#">Expenses</a>
          <a href="#">Groups</a>
        </nav>
        <div className="user-profile" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="add-expense-trigger" onClick={() => setIsModalOpen(true)}>+ Expense</button>
          <span className="avatar">U</span>
        </div>
      </header>

      <main className="main-content">
        <div className="top-section">
          <DashboardStats totalExpenses={totalExpenses} balances={balances} />
        </div>
        
        <div className="bottom-section">
          <div className="left-panel">
            <ExpenseList expenses={expenses} />
          </div>
          <div className="right-panel">
            <Balances balances={balances} />
          </div>
        </div>
      </main>

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddExpense={handleAddExpense} 
        allPeople={['Aisha', 'Rohan', 'Priya', 'Meera', 'Dev', 'Sam']}
      />
    </div>
  );
}

export default App;
